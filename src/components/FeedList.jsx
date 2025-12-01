import React from 'react';
import { Trash2, Rss } from 'lucide-react';

export const FeedList = ({ feeds, onSelectFeed, onDeleteFeed }) => {
    if (feeds.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <Rss className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No feeds yet. Add one above!</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto max-h-[400px]">
            {feeds.map((feed) => (
                <div
                    key={feed.url}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer group transition-colors"
                    onClick={() => onSelectFeed(feed)}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        {feed.image ? (
                            <img src={feed.image} alt="" className="w-8 h-8 object-contain rounded bg-white border border-gray-100" />
                        ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center shrink-0">
                                <Rss className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                        <div className="truncate">
                            <h3 className="font-medium text-gray-900 truncate text-sm">{feed.title || 'Untitled Feed'}</h3>
                            <p className="text-xs text-gray-500 truncate">{feed.url}</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteFeed(feed.url);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove feed"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
