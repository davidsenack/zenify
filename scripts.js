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
