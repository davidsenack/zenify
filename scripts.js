document.getElementById('block').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    if (url) {
        chrome.storage.sync.get('blockedUrls', function(data) {
            let blockedUrls = data.blockedUrls || [];
            blockedUrls.push(url);
            chrome.storage.sync.set({blockedUrls: blockedUrls}, function() {
                alert(`Blocked ${url}`);
            });
        });
    }
});

// Set timer and unblock websites
document.getElementById('setTimer').addEventListener('click', function() {
    const timerMinutes = document.getElementById('timer').value;
    if (timerMinutes) {
        const timerMilliseconds = timerMinutes * 60 * 1000;

        // Save the timer's end time
        const endTime = new Date().getTime() + timerMilliseconds;
        chrome.storage.sync.set({timerEndTime: endTime}, function() {
            alert(`Timer set for ${timerMinutes} minutes.`);
        });

        // Unblock websites when the timer ends
        setTimeout(unblockWebsites, timerMilliseconds);
    }
});

function unblockWebsites() {
    chrome.storage.sync.set({blockedUrls: []}, function() {
        alert('All websites unblocked.');
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
        chrome.storage.sync.get(['blockedUrls', 'timerEndTime'], function(data) {
            const blockedUrls = data.blockedUrls || [];

            // Check if the timer has ended
            const currentTime = new Date().getTime();
            const timerEnded = data.timerEndTime && currentTime >= data.timerEndTime;
            if (timerEnded) {
                // Reset timer and unblock websites
                chrome.storage.sync.set({timerEndTime: null, blockedUrls: []}, function() {
                    console.log('Timer ended. All websites unblocked.');
                });
            } else {
                // Block websites
                blockedUrls.forEach(function(url) {
                    if (tab.url.includes(url)) {
                        chrome.tabs.update(tabId, {url: 'blocked.html'});
                    }
                });
            }
        });
    }
});
