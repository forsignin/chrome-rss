# RSS 源配置说明

## 概述

本扩展支持从远程 GitHub 仓库加载推荐的 RSS 订阅源配置。这样可以在不更新扩展的情况下动态更新推荐源列表。

## 配置文件格式

配置文件位于 `public/feeds-config.json`,格式如下:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-12-05",
  "categories": [
    {
      "id": "all",
      "name": "全部",
      "icon": "📑"
    },
    {
      "id": "新闻",
      "name": "新闻",
      "icon": "📰"
    }
  ],
  "feeds": [
    {
      "title": "BBC 中文网",
      "url": "https://feeds.bbci.co.uk/zhongwen/simp/rss.xml",
      "description": "BBC 中文网新闻订阅",
      "category": "新闻"
    }
  ]
}
```

## 配置字段说明

### 顶层字段
- `version`: 配置文件版本号
- `lastUpdated`: 最后更新日期
- `categories`: 分类列表
- `feeds`: RSS 源列表

### 分类对象 (categories)
- `id`: 分类唯一标识符
- `name`: 分类显示名称
- `icon`: 分类图标(emoji)

**注意**: `id: "all"` 是必须的,表示"全部"分类

### RSS 源对象 (feeds)
- `title`: 订阅源标题
- `url`: RSS 订阅地址
- `description`: 订阅源描述
- `category`: 所属分类(必须匹配 categories 中的某个 id)

## 配置加载策略

扩展会按以下优先级加载配置:

1. **远程配置** (最优先)
   - URL: `https://raw.githubusercontent.com/forsignin/chrome-rss/main/public/feeds-config.json`
   - 成功获取后会缓存到本地

2. **本地缓存**
   - 缓存有效期: 24小时
   - 在远程加载失败时使用

3. **内置默认配置** (兜底)
   - 硬编码在 `src/utils/defaultFeeds.js` 中
   - 在远程和缓存都失败时使用

## 如何更新推荐源

### 方法一: 修改远程配置文件 (推荐)

1. Fork 或编辑 `https://github.com/forsignin/chrome-rss` 仓库
2. 修改 `public/feeds-config.json` 文件
3. 提交并推送到 main 分支
4. 用户的扩展会在以下情况自动获取新配置:
   - 点击"显示推荐订阅"时(如果本地无缓存)
   - 点击刷新按钮(右上角的刷新图标)
   - 缓存过期后(24小时)

### 方法二: 修改本地默认配置

如果需要修改内置的兜底配置,编辑 `src/utils/defaultFeeds.js` 中的 `LOCAL_DEFAULT_CONFIG` 对象。

## 用户使用说明

### 查看推荐订阅
1. 打开扩展的 "Feeds" 标签
2. 点击"显示推荐订阅"按钮
3. 等待配置加载完成

### 筛选分类
- 点击不同的分类标签(全部/新闻/科技/开发/综合)可以筛选对应类别的订阅源

### 刷新配置
- 点击右上角的刷新图标可以强制从远程重新加载最新配置

### 添加推荐源
- 在推荐列表中点击任何订阅源旁边的"添加"按钮即可快速订阅

## 配置缓存管理

### 缓存存储位置
配置缓存存储在 Chrome 扩展的 `chrome.storage.local` 中,键名为 `feeds_config_cache`。

### 清除缓存
如果需要手动清除缓存:
1. 打开 Chrome 开发者工具 (F12)
2. 切换到 Console 标签
3. 执行: `chrome.storage.local.remove('feeds_config_cache')`

或者直接点击扩展中的刷新按钮,会自动清除缓存并重新加载。

## 技术细节

### 远程配置 URL
可以通过修改 `src/utils/defaultFeeds.js` 中的 `REMOTE_CONFIG_URL` 常量来更改远程配置源:

```javascript
const REMOTE_CONFIG_URL = 'https://raw.githubusercontent.com/your-username/your-repo/main/public/feeds-config.json';
```

### 缓存时长
默认缓存时长为 24 小时,可以通过修改 `CACHE_DURATION` 常量来调整:

```javascript
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 毫秒
```

## 添加新的推荐源示例

在 `feeds-config.json` 中添加新的订阅源:

```json
{
  "title": "你的网站名称",
  "url": "https://your-website.com/rss",
  "description": "网站描述",
  "category": "科技"
}
```

注意:
- `url` 必须是有效的 RSS/Atom 订阅地址
- `category` 必须是已定义的分类 id
- 建议先测试 RSS 地址是否可访问

## 故障排查

### 配置加载失败
如果显示"加载配置失败":
1. 检查网络连接
2. 确认 GitHub 是否可访问
3. 验证配置文件 JSON 格式是否正确
4. 查看浏览器控制台的错误日志

### RSS 源添加失败
如果推荐源无法添加:
1. 确认 RSS URL 是否有效
2. 检查是否有 CORS 限制
3. 尝试手动访问该 RSS 地址
4. 查看控制台错误信息

## 贡献指南

欢迎提交 Pull Request 来添加更多优质的 RSS 订阅源!

提交时请确保:
- RSS 源可正常访问
- 内容质量高,更新频繁
- 正确设置分类
- 提供准确的描述