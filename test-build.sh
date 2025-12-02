#!/bin/bash

# Test script for validating Chrome extension build
set -e

echo "🧪 Testing Chrome Extension Build..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
rm -f *.zip

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running ESLint..."
npm run lint

# Build extension
echo "🏗️  Building extension..."
npm run build

# Verify build output
echo "✅ Verifying build output..."
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found"
    exit 1
fi

if [ ! -f "dist/manifest.json" ]; then
    echo "❌ Error: manifest.json not found in dist"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: index.html not found in dist"
    exit 1
fi

echo "📁 Build contents:"
ls -la dist/

# Create test zip
echo "📦 Creating test archive..."
cd dist
zip -r ../chrome-rss-extension-test.zip .
cd ..

if [ ! -f "chrome-rss-extension-test.zip" ]; then
    echo "❌ Error: Failed to create zip archive"
    exit 1
fi

echo "📊 Archive info:"
ls -lh chrome-rss-extension-test.zip

# Validate manifest version
echo "🔍 Validating manifest version..."
VERSION=$(node -p "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')).version")
echo "📋 Manifest version: $VERSION"

PACKAGE_VERSION=$(node -p "JSON.parse(require('fs').readFileSync('package.json', 'utf8')).version")
echo "📦 Package version: $PACKAGE_VERSION"

if [ "$VERSION" != "$PACKAGE_VERSION" ]; then
    echo "⚠️  Warning: Version mismatch between manifest.json and package.json"
else
    echo "✅ Versions are synchronized"
fi

echo "🎉 All tests passed! Extension is ready for deployment."

# Clean up test files
rm -f chrome-rss-extension-test.zip

echo "✨ Test completed successfully!"