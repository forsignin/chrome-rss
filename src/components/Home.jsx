import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllFeeds } from '../utils/rss';
import { getReadStatus, markAsRead } from '../utils/storage';
import { Loader2, RefreshCw } from 'lucide-react';
import { ArticleCard } from './ArticleCard';

export const Home = ({ feeds }) => {
    const [articles, setArticles] = useState([]);
    const [readArticles, setReadArticles] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('unread'); // 'all' | 'unread'
    const [expandedArticles, setExpandedArticles] = useState({}); // { [id]: boolean }

    const loadData = useCallback(async (force = false) => {
        try {
            if (force) setRefreshing(true);
            else setLoading(true);

            const [items, readStatus] = await Promise.all([
                fetchAllFeeds(feeds, force),
                getReadStatus()
            ]);

            setArticles(items);
            setReadArticles(readStatus);
        } catch (error) {
            console.error("Failed to load home feed", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [feeds]);

    useEffect(() => {
        if (feeds.length > 0) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [feeds, loadData]);

    const handleArticleClick = (article) => {
        const id = article.id || article.link;
        const isCurrentlyExpanded = expandedArticles[id];
        
        if (isCurrentlyExpanded) {
            // Collapsing: first save the current position of the element
            const element = document.querySelector(`[data-article-id="${id}"]`);
            const scrollContainer = document.querySelector('.overflow-y-auto');
            
            if (element && scrollContainer) {
                const elementRect = element.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                const currentScrollTop = scrollContainer.scrollTop;
                const relativeTop = elementRect.top - containerRect.top;
                const targetScrollPosition = currentScrollTop + relativeTop;
                
                // Toggle expansion
                setExpandedArticles(prev => ({
                    ...prev,
                    [id]: false
                }));
                
                // Restore position after DOM update
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        scrollContainer.scrollTo({
                            top: targetScrollPosition,
                            behavior: 'smooth'
                        });
                    });
                });
            } else {
                // Fallback if elements not found
                setExpandedArticles(prev => ({
                    ...prev,
                    [id]: false
                }));
            }
        } else {
            // Expanding: just toggle
            setExpandedArticles(prev => ({
                ...prev,
                [id]: true
            }));
        }
    };

    const handleMarkAsRead = async (id) => {
        if (!readArticles[id]) {
            const newReadStatus = await markAsRead(id);
            setReadArticles(newReadStatus);
        }
    };

    const filteredArticles = articles.filter(item => {
        if (filter === 'all') return true;
        const id = item.id || item.link;
        return !readArticles[id] || expandedArticles[id];
    });

    if (loading && articles.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            </div>
        );
    }

    if (feeds.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <p>No feeds subscribed.</p>
                <p className="text-sm mt-2">Go to the Feeds tab to add some!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
                <h2 className="font-bold text-lg text-gray-800">Latest News</h2>
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === 'unread' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Unread
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            All
                        </button>
                    </div>
                    <button
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${refreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto flex-1 p-3 space-y-3">
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        {filter === 'unread' ? 'No unread articles!' : 'No articles found.'}
                    </div>
                ) : (
                    filteredArticles.map((item, index) => {
                        const id = item.id || item.link;
                        const isRead = !!readArticles[id];
                        const isExpanded = !!expandedArticles[id];

                        return (
                            <div key={`${id}-${index}`} data-article-id={id}>
                                <ArticleCard
                                    item={item}
                                    isRead={isRead}
                                    isExpanded={isExpanded}
                                    onToggleExpand={() => handleArticleClick(item)}
                                    onMarkAsRead={() => handleMarkAsRead(id)}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
