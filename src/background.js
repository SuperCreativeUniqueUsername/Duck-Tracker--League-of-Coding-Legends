function trackTime(tabId, url) {
    const currentTime = new Date().getTime();
    const currentDate = new Date().toLocaleDateString();
  
    chrome.storage.local.get({ trackedSites: {} }, (result) => {
      const trackedSites = result.trackedSites || {};
  
      if (!trackedSites[url]) {
        trackedSites[url] = {};
      }
  
      if (!trackedSites[url][currentDate]) {
        trackedSites[url][currentDate] = { startTime: currentTime, totalTime: 0 };
      } else {
        const elapsedTime = currentTime - trackedSites[url][currentDate].startTime;
        trackedSites[url][currentDate].totalTime += elapsedTime;
        trackedSites[url][currentDate].startTime = currentTime;
      }
  
      chrome.storage.local.set({ trackedSites }, () => {
        console.log(`Time tracked for ${url} on ${currentDate}: ${trackedSites[url][currentDate].totalTime} milliseconds`);
      });
    });
  }

chrome.tabs.onActivated.addListener((activeInfo) => {
    const { tabId, windowId } = activeInfo;
    chrome.tabs.get(tabId, (tab) => {
        if (tab.windowId === windowId) {
            trackTime(tab.id, tab.url);
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        console.log('URL updated:', changeInfo.url);
        trackTime(tabId, changeInfo.url);
    }
});
