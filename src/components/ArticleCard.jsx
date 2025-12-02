import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

export const ArticleCard = ({ item, isRead, isExpanded, onToggleExpand, onMarkAsRead }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!isExpanded || isRead) return;

        let timeoutId;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    timeoutId = setTimeout(() => {
                        onMarkAsRead();
                    }, 1000); // 1 second delay
                    observer.disconnect();
                }
            },
            { threshold: 1.0 }
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }

        return () => {
            observer.disconnect();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isExpanded, isRead, onMarkAsRead]);

    const handleReadOriginal = (e) => {
        e.stopPropagation();
        onMarkAsRead();
    };

    const handleMarkAsReadClick = (e) => {
        e.stopPropagation();
        onMarkAsRead();
    };

    return (
        <div
            onClick={onToggleExpand}
            className={`block p-4 bg-white border rounded-lg transition-all hover:shadow-md cursor-pointer group relative ${isRead ? 'border-gray-100 bg-gray-50' : 'border-gray-200 border-l-4 border-l-blue-500'
                }`}
        >
            <div className="flex justify-between items-start gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {item.feedTitle}
                </span>
                <div className="flex items-center gap-2">
                    {!isRead && (
                        <button
                            onClick={handleMarkAsReadClick}
                            className="p-1 hover:bg-green-100 rounded-full transition-colors group/read"
                            title="Mark as read"
                        >
                            <Check className="w-3 h-3 text-gray-400 group-hover/read:text-green-600" />
                        </button>
                    )}
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {item.pubDate ? new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                </div>
            </div>

            <h3 className={`font-semibold mb-1 text-sm leading-snug ${isRead ? 'text-gray-500 font-normal' : 'text-gray-900 group-hover:text-blue-600'
                } ${!isExpanded && 'line-clamp-2'}`}>
                {item.title}
            </h3>

            {(!isRead || isExpanded) && (
                <div className={`text-sm text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-2 text-xs' : 'mt-2 space-y-2'}`}>
                    {isExpanded && item.imageUrl && (
                        <img src={item.imageUrl} alt="" className="w-full h-48 object-cover rounded-md mb-3" />
                    )}
                    <div
                        className={isExpanded ? "prose prose-sm max-w-none prose-blue prose-img:rounded-md prose-img:max-w-full" : ""}
                        dangerouslySetInnerHTML={{
                            __html: isExpanded
                                ? (item.fullContent || item.contentSnippet || '')
                                : (item.contentSnippet || item.content || '').replace(/<[^>]+>/g, '')
                        }}
                    />
                </div>
            )}

            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                    <div ref={bottomRef} className="h-1 w-1 opacity-0 pointer-events-none absolute bottom-0" />
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleReadOriginal}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        Read Original <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            )}
        </div>
    );
};
