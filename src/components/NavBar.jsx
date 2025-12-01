import React from 'react';
import { Home as HomeIcon, List } from 'lucide-react';

export const NavBar = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex border-t border-gray-200 bg-white">
            <button
                onClick={() => onTabChange('home')}
                className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                <HomeIcon className="w-5 h-5" />
                <span className="text-[10px] font-medium">Home</span>
            </button>
            <button
                onClick={() => onTabChange('feeds')}
                className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'feeds' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                <List className="w-5 h-5" />
                <span className="text-[10px] font-medium">Feeds</span>
            </button>
        </div>
    );
};
