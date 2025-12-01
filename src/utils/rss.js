import Parser from 'rss-parser';
import { getCachedArticles, saveCachedArticles } from './storage';

const parser = new Parser();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const fetchFeed = async (url, forceRefresh = false) => {
    if (!forceRefresh) {
        const cached = await getCachedArticles(url);
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            console.log('Returning cached feed:', url);
            return { ...cached.data, url, originalUrl: url, fromCache: true };
        }
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        const feed = await parser.parseString(text);

        // Normalize items and add feed info
        const items = feed.items.map(item => {
            // Try to find an image
            let imageUrl = null;
            if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) {
                imageUrl = item.enclosure.url;
            } else if (item['media:content'] && item['media:content'].$.url) {
                imageUrl = item['media:content'].$.url;
            } else if (item.content) {
                const match = item.content.match(/<img[^>]+src="([^">]+)"/);
                if (match) imageUrl = match[1];
            }

            return {
                ...item,
                feedTitle: feed.title,
                feedUrl: url,
                id: item.guid || item.link || item.title, // Best effort ID
                imageUrl,
                fullContent: item['content:encoded'] || item.content || item.description || ''
            };
        });

        // Cache the result (we only cache the items and basic metadata to save space if needed, but full feed is fine for now)
        await saveCachedArticles(url, { ...feed, items });

        return { ...feed, items, url, originalUrl: url, fromCache: false };
    } catch (error) {
        console.error("Error fetching feed:", error);
        // Try to return stale cache if fetch fails
        const cached = await getCachedArticles(url);
        if (cached) {
            console.log('Returning stale cached feed:', url);
            return { ...cached.data, url, originalUrl: url, fromCache: true, error: error.message };
        }
        throw error;
    }
};

export const fetchAllFeeds = async (feeds, forceRefresh = false) => {
    const promises = feeds.map(feed => fetchFeed(feed.url, forceRefresh).catch(err => {
        console.error(`Failed to fetch ${feed.url}`, err);
        return null;
    }));

    const results = await Promise.all(promises);
    const validResults = results.filter(r => r !== null);

    // Aggregate all items
    let allItems = [];
    validResults.forEach(feed => {
        if (feed.items) {
            allItems = [...allItems, ...feed.items];
        }
    });

    // Sort by date (newest first)
    allItems.sort((a, b) => {
        const dateA = new Date(a.pubDate || a.isoDate || 0);
        const dateB = new Date(b.pubDate || b.isoDate || 0);
        return dateB - dateA;
    });

    return allItems;
};
