import React, { useEffect, useState } from 'react';
import { fetchFeed } from '../utils/rss';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const ArticleList = ({ feed, onBack }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const data = await fetchFeed(feed.url);
                setArticles(data.items || []);
            } catch (err) {
                setError('Failed to load articles.');
            } finally {
                setLoading(false);
            }
        };
        loadArticles();
    }, [feed.url]);

    if (loading) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-white">
                    <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-semibold truncate flex-1 text-sm">{feed.title}</h2>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
                <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="font-semibold truncate flex-1 text-sm text-gray-800">{feed.title}</h2>
            </div>

            {error ? (
                <div className="p-8 text-red-500 text-center text-sm">{error}</div>
            ) : (
                <div className="overflow-y-auto flex-1 p-3 space-y-3">
                    {articles.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all group"
                        >
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 text-sm leading-snug">{item.title}</h3>
                            <p className="text-xs text-gray-500 mb-2">
                                {item.pubDate ? new Date(item.pubDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''}
                            </p>
                            <div className="text-xs text-gray-600 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.contentSnippet || item.content || '' }} />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};
