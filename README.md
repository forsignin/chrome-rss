# Chrome RSS Reader Extension

A modern RSS reader Chrome extension built with React, Vite, and Tailwind CSS.

## Features

- 📖 Read RSS feeds in a clean, modern interface
- 🔍 Filter between unread and all articles
- ✅ Mark articles as read manually or automatically
- 📱 Responsive design optimized for browser extension popup
- 🎨 Beautiful UI with Tailwind CSS

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Load Extension in Chrome

1. Run `npm run build` to create the `dist` folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder

## Automated Build & Release

This project includes GitHub Actions workflows for automated building and releasing.

### Automatic Builds

The extension is automatically built on:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Tag pushes (creates releases)
- Manual workflow dispatch

### Creating a Release

You can create a new release in two ways:

#### Method 1: Manual Release Workflow
1. Go to GitHub Actions in your repository
2. Select the "Release" workflow
3. Click "Run workflow"
4. Enter the version number (e.g., `1.0.1`)
5. Click "Run workflow"

This will:
- Update `manifest.json` and `package.json` versions
- Build the extension
- Create a git tag
- Create a GitHub release with the extension zip file

#### Method 2: Git Tag (Manual)
```bash
# Update version in manifest.json and package.json manually
# Then create and push a tag
git tag v1.0.1
git push origin v1.0.1
```

### Build Artifacts

Each build creates:
- A zip file ready for Chrome Web Store upload
- Build artifacts stored for 30 days
- Automatic GitHub releases for tagged versions

## Project Structure

```
src/
├── components/          # React components
│   ├── ArticleCard.jsx  # Individual article display
│   ├── ArticleList.jsx  # Feed article list
│   ├── FeedList.jsx     # RSS feed management
│   ├── Home.jsx         # Main article feed
│   └── NavBar.jsx       # Navigation
├── utils/               # Utility functions
│   ├── rss.js          # RSS parsing logic
│   └── storage.js      # Chrome storage utilities
└── background/         # Extension background scripts
    └── service-worker.js
```

## Chrome Web Store Deployment

To deploy to Chrome Web Store (optional):

1. Uncomment the deploy section in `.github/workflows/build-extension.yml`
2. Set up Chrome Web Store API credentials
3. Add `BPP_KEYS` secret to your repository
4. The extension will auto-deploy on tagged releases

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License
