export const getFeeds = async () => {
    const result = await chrome.storage.local.get('feeds');
    return result.feeds || [];
};

export const saveFeed = async (feed) => {
    const feeds = await getFeeds();
    // Avoid duplicates
    if (feeds.some(f => f.url === feed.url)) return feeds;
    const newFeeds = [...feeds, feed];
    await chrome.storage.local.set({ feeds: newFeeds });
    return newFeeds;
};

export const removeFeed = async (url) => {
    const feeds = await getFeeds();
    const newFeeds = feeds.filter(f => f.url !== url);
    await chrome.storage.local.set({ feeds: newFeeds });
    // Also remove cache for this feed
    await removeFeedCache(url);
    return newFeeds;
};

// --- Caching ---

export const getCachedArticles = async (feedUrl) => {
    const key = `rss_cache_${feedUrl}`;
    const result = await chrome.storage.local.get(key);
    return result[key] || null; // { timestamp: number, data: Object }
};

export const saveCachedArticles = async (feedUrl, data) => {
    const key = `rss_cache_${feedUrl}`;
    await chrome.storage.local.set({
        [key]: {
            timestamp: Date.now(),
            data: data
        }
    });
};

const removeFeedCache = async (feedUrl) => {
    const key = `rss_cache_${feedUrl}`;
    await chrome.storage.local.remove(key);
};

// --- Read Status ---

export const getReadStatus = async () => {
    const result = await chrome.storage.local.get('readArticles');
    return result.readArticles || {}; // { [articleId/Link]: timestamp }
};

export const markAsRead = async (articleId) => {
    const readArticles = await getReadStatus();
    readArticles[articleId] = Date.now();
    await chrome.storage.local.set({ readArticles });
    return readArticles;
};
