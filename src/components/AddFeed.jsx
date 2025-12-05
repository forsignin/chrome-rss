import React, { useState, useEffect } from 'react';
import { fetchFeed } from '../utils/rss';
import { saveFeed } from '../utils/storage';
import { Loader2, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { loadFeedsConfig, getFeedsByCategory, refreshFeedsConfig } from '../utils/defaultFeeds';

export const AddFeed = ({ onFeedAdded }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRecommended, setShowRecommended] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [config, setConfig] = useState(null);
    const [loadingConfig, setLoadingConfig] = useState(false);

    // 加载配置
    useEffect(() => {
        const loadConfig = async () => {
            setLoadingConfig(true);
            try {
                const loadedConfig = await loadFeedsConfig();
                setConfig(loadedConfig);
            } catch (error) {
                console.error('加载配置失败:', error);
            } finally {
                setLoadingConfig(false);
            }
        };

        if (showRecommended && !config) {
            loadConfig();
        }
    }, [showRecommended, config]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const feed = await fetchFeed(url);
            const savedFeeds = await saveFeed({
                title: feed.title,
                url: url,
                description: feed.description,
                image: feed.image?.url
            });
            setUrl('');
            if (onFeedAdded) onFeedAdded(savedFeeds);
        } catch {
            setError('Failed to fetch feed. Please check the URL.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecommended = async (feed) => {
        setLoading(true);
        setError('');
        try {
            const fetchedFeed = await fetchFeed(feed.url);
            const savedFeeds = await saveFeed({
                title: fetchedFeed.title || feed.title,
                url: feed.url,
                description: fetchedFeed.description || feed.description,
                image: fetchedFeed.image?.url
            });
            if (onFeedAdded) onFeedAdded(savedFeeds);
        } catch {
            setError(`添加 "${feed.title}" 失败，请稍后重试。`);
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshConfig = async () => {
        setLoadingConfig(true);
        try {
            const newConfig = await refreshFeedsConfig();
            setConfig(newConfig);
        } catch (error) {
            console.error('刷新配置失败:', error);
        } finally {
            setLoadingConfig(false);
        }
    };

    const filteredFeeds = config ? getFeedsByCategory(config.feeds, selectedCategory) : [];
    const categories = config?.categories || [];

    return (
        <div className="border-b border-gray-200">
            <form onSubmit={handleSubmit} className="p-4">
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="输入 RSS 地址"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        添加
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </form>

            {/* 推荐订阅按钮 */}
            <div className="px-4 pb-3">
                <button
                    onClick={() => setShowRecommended(!showRecommended)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                    <Sparkles className="w-4 h-4" />
                    {showRecommended ? '隐藏推荐订阅' : '显示推荐订阅'}
                </button>
            </div>

            {/* 推荐订阅列表 */}
            {showRecommended && (
                <div className="px-4 pb-4">
                    {loadingConfig ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
                            <span className="ml-2 text-sm text-gray-500">加载配置中...</span>
                        </div>
                    ) : config ? (
                        <>
                            {/* 分类标签 */}
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                                            selectedCategory === category.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category.icon} {category.name}
                                    </button>
                                ))}

                                {/* 刷新按钮 */}
                                <button
                                    onClick={handleRefreshConfig}
                                    disabled={loadingConfig}
                                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors disabled:opacity-50 ml-auto"
                                    title="刷新配置"
                                >
                                    <RefreshCw className={`w-3 h-3 inline ${loadingConfig ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {/* 推荐订阅源列表 */}
                            <div className="max-h-[200px] overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2">
                                {filteredFeeds.length > 0 ? (
                                    filteredFeeds.map((feed) => (
                                        <div
                                            key={feed.url}
                                            className="flex items-start justify-between p-2 hover:bg-gray-50 rounded-md group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {feed.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {feed.description}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleAddRecommended(feed)}
                                                disabled={loading}
                                                className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 shrink-0"
                                            >
                                                添加
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-sm text-gray-500">
                                        该分类暂无推荐订阅
                                    </div>
                                )}
                            </div>

                            {/* 配置信息提示 */}
                            {config.version && (
                                <div className="mt-2 text-xs text-gray-400 text-center">
                                    配置版本: {config.version} {config.lastUpdated && `(${config.lastUpdated})`}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4 text-sm text-red-500">
                            加载配置失败，请稍后重试
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};