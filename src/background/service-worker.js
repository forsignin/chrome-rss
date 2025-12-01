// Background service worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('RSS Reader Extension installed');

    // Setup an alarm for periodic updates (every 60 minutes)
    chrome.alarms.create('refreshFeeds', {
        periodInMinutes: 60
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'refreshFeeds') {
        console.log('Refreshing feeds...');
        // In a real app, we would fetch feeds here and update badge text
        // For now, just log it
    }
});
