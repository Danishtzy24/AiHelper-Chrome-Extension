chrome.runtime.onInstalled.addListener(() => {
    console.log("AI Screenshot Answer Extension Installed!");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "capture_screenshot") {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (imageUri) => {
            sendResponse({ screenshot: imageUri });
        });
        return true; 
    }
});
