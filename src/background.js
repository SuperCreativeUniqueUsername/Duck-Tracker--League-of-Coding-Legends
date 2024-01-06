// background.js

function trackTime(tabId, url) {
    const currentTime = new Date().getTime();
  
    chrome.storage.local.get({ trackedSites: {} }, (result) => {
      const trackedSites = result.trackedSites || {};
  
      if (!trackedSites[url]) {
        trackedSites[url] = { startTime: currentTime, totalTime: 0 };
      } else {
        const elapsedTime = currentTime - trackedSites[url].startTime;
        trackedSites[url].totalTime += elapsedTime;
        trackedSites[url].startTime = currentTime;
      }
  
      chrome.storage.local.set({ trackedSites }, () => {
        console.log(`Time tracked for ${url}: ${trackedSites[url].totalTime} milliseconds`);
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
  