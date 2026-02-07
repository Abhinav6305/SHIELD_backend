// ShieldScan - Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('ShieldScan Engine Loaded');
    chrome.storage.sync.set({
        settings: { sensitivity: 70, autoScan: true, theme: 'dark' }
    });
});

chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.type === 'SCAN_COMPLETE') {
        chrome.action.setBadgeText({ text: '!', tabId: sender.tab.id });
        chrome.action.setBadgeBackgroundColor({ color: '#10B981', tabId: sender.tab.id });
        
        if (chrome.action.openPopup) {
            chrome.action.openPopup().catch(() => {});
        }
    }
});
