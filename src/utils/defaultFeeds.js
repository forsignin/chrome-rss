// 远程配置 URL
const REMOTE_CONFIG_URL = 'https://raw.githubusercontent.com/forsignin/chrome-rss/main/public/feeds-config.json';
const CACHE_KEY = 'feeds_config_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时缓存

// 默认本地配置 (作为备用)
const LOCAL_DEFAULT_CONFIG = {
    categories: [
        { id: 'all', name: '全部', icon: '📑' },
        { id: '新闻', name: '新闻', icon: '📰' },
        { id: '科技', name: '科技', icon: '💻' },
        { id: '开发', name: '开发', icon: '👨‍💻' },
        { id: '综合', name: '综合', icon: '🌐' }
    ],
    feeds: [
        {
            title: 'BBC 中文网',
            url: 'https://rsshub.app/bbc/chinese',
            description: 'BBC 中文网新闻订阅 (RSSHub)',
            category: '新闻'
        },
        {
            title: '知乎日报',
            url: 'https://rsshub.app/zhihu/daily',
            description: '知乎日报每日精选 (RSSHub)',
            category: '综合'
        },
        {
            title: '少数派',
            url: 'https://sspai.com/feed',
            description: '少数派科技文章',
            category: '科技'
        },
        {
            title: 'Hacker News',
            url: 'https://hnrss.org/frontpage',
            description: 'Hacker News 热门文章',
            category: '科技'
        },
        {
            title: 'GitHub Trending',
            url: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
            description: 'GitHub 每日热门项目',
            category: '开发'
        },
        {
            title: 'V2EX',
            url: 'https://rsshub.app/v2ex/topics/latest',
            description: 'V2EX 创意工作者社区 (RSSHub)',
            category: '科技'
        }
    ]
};

// 从缓存中获取配置
const getCachedConfig = async () => {
    try {
        const result = await chrome.storage.local.get(CACHE_KEY);
        const cached = result[CACHE_KEY];
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.config;
        }
    } catch (error) {
        console.warn('读取缓存配置失败:', error);
    }
    return null;
};

// 保存配置到缓存
const saveCachedConfig = async (config) => {
    try {
        await chrome.storage.local.set({
            [CACHE_KEY]: {
                config,
                timestamp: Date.now()
            }
        });
    } catch (error) {
        console.warn('保存配置缓存失败:', error);
    }
};

// 从远程获取配置
const fetchRemoteConfig = async () => {
    try {
        const response = await fetch(REMOTE_CONFIG_URL, {
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const config = await response.json();

        // 验证配置格式
        if (!config.categories || !config.feeds || !Array.isArray(config.feeds)) {
            throw new Error('配置格式无效');
        }

        return config;
    } catch (error) {
        console.warn('获取远程配置失败:', error);
        return null;
    }
};

// 获取配置 (优先远程,其次缓存,最后本地默认)
export const loadFeedsConfig = async () => {
    // 1. 尝试从远程获取
    const remoteConfig = await fetchRemoteConfig();
    if (remoteConfig) {
        await saveCachedConfig(remoteConfig);
        return remoteConfig;
    }

    // 2. 使用缓存
    const cachedConfig = await getCachedConfig();
    if (cachedConfig) {
        return cachedConfig;
    }

    // 3. 使用本地默认配置
    return LOCAL_DEFAULT_CONFIG;
};

// 根据分类筛选订阅源
export const getFeedsByCategory = (feeds, category) => {
    if (category === 'all') return feeds;
    return feeds.filter(feed => feed.category === category);
};

// 强制刷新配置
export const refreshFeedsConfig = async () => {
    // 清除缓存
    try {
        await chrome.storage.local.remove(CACHE_KEY);
    } catch (error) {
        console.warn('清除缓存失败:', error);
    }

    // 重新加载
    return await loadFeedsConfig();
};
