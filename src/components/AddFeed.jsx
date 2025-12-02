import React, { useState } from 'react';
import { fetchFeed } from '../utils/rss';
import { saveFeed } from '../utils/storage';
import { Loader2, Plus } from 'lucide-react';

export const AddFeed = ({ onFeedAdded }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        } catch (_err) {
            setError('Failed to fetch feed. Please check the URL.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter RSS URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    Add
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </form>
    );
};
