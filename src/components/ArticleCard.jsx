import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

export const ArticleCard = ({ item, isRead, isExpanded, onToggleExpand, onMarkAsRead }) => {
    const contentRef = useRef(null);

    useEffect(() => {
        if (!isExpanded || isRead) return;

        const handleScroll = () => {
            const element = contentRef.current;
            if (!element) return;

            // 检查是否滚动到底部（允许5px的误差）
            const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 5;
            
            if (isAtBottom) {
                // 延迟500ms标记为已读，给用户时间看到底部内容
                setTimeout(() => {
                    onMarkAsRead();
                }, 500);
            }
        };

        const element = contentRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll);
            
            // 如果内容不需要滚动（内容很短），立即检查
            if (element.scrollHeight <= element.clientHeight) {
                setTimeout(() => {
                    onMarkAsRead();
                }, 2000); // 2秒后自动标记为已读
            }
        }

        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScroll);
            }
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
                <div className={`text-sm text-gray-600 leading-relaxed ${
                    !isExpanded 
                        ? 'line-clamp-2 text-xs' 
                        : 'mt-2 h-64 overflow-y-auto scrollbar-elegant pr-2'
                }`}
                    ref={isExpanded ? contentRef : null}>
                    {isExpanded ? (
                        <div className="space-y-3">
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt="" className="w-full h-40 object-cover rounded-lg shadow-sm" />
                            )}
                            <div
                                className="prose prose-sm max-w-none prose-blue prose-img:rounded-md prose-img:max-w-full leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: item.fullContent || item.contentSnippet || ''
                                }}
                            />
                            {/* 底部标记，用于确保有足够的内容可滚动 */}
                            <div className="h-4"></div>
                        </div>
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: (item.contentSnippet || item.content || '').replace(/<[^>]+>/g, '')
                            }}
                        />
                    )}
                </div>
            )}

            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
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
