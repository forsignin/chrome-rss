import React, { useState, useEffect } from 'react';
import { AddFeed } from './components/AddFeed';
import { FeedList } from './components/FeedList';
import { ArticleList } from './components/ArticleList';
import { Home } from './components/Home';
import { NavBar } from './components/NavBar';
import { getFeeds, removeFeed } from './utils/storage';

function App() {
  const [feeds, setFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    getFeeds().then(setFeeds);
  }, []);

  const handleFeedAdded = (newFeeds) => {
    setFeeds(newFeeds);
  };

  const handleDeleteFeed = async (url) => {
    const newFeeds = await removeFeed(url);
    setFeeds(newFeeds);
  };

  // If a feed is selected, show the article list (overlay)
  if (selectedFeed) {
    return (
      <div className="w-[400px] h-[600px] bg-white flex flex-col font-sans text-gray-900">
        <ArticleList feed={selectedFeed} onBack={() => setSelectedFeed(null)} />
      </div>
    );
  }

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col font-sans text-gray-900">
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'home' ? (
          <Home feeds={feeds} />
        ) : (
          <>
            <header className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-orange-500">RSS</span> Feeds
              </h1>
            </header>
            <AddFeed onFeedAdded={handleFeedAdded} />
            <FeedList
              feeds={feeds}
              onSelectFeed={setSelectedFeed}
              onDeleteFeed={handleDeleteFeed}
            />
          </>
        )}
      </div>
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
