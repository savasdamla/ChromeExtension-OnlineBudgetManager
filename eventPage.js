let contextMenuCreated = false;

function createNotification(type, iconUrl, title, message) {
    return notifOptions = {
        type: type,
        iconUrl: iconUrl,
        title: title,
        message: message
    };
}

function setUpContextMenu() {
    if (contextMenuCreated) return;
    var contextMenuItem = {
        "id": "spendMoney",
        "title": "Add to Budget",
        "contexts": ["selection"]
    };

    chrome.contextMenus.create(contextMenuItem, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            contextMenuCreated = true;  // Set the flag to true
        }
    });
}

function isValidNumber(val) {
    val = val.replace(',', '.').replace('€', '');
    return !isNaN(val) && parseFloat(val) == val;
}


chrome.contextMenus.onClicked.addListener(function (clickedData) {
    if (clickedData.menuItemId == "spendMoney" && clickedData.selectionText) {
        if (isValidNumber(clickedData.selectionText)) {
            chrome.storage.sync.get(['total', 'limit'], function (budget) {
                var newTotal = 0;
                if (budget.total) {
                    newTotal += parseFloat(budget.total);
                }
                var selectedAmount = parseFloat(clickedData.selectionText);
                    chrome.storage.sync.get(['history'], function (data) {
                        var history = data.history || [];
                        var today = new Date();
                        var dateStr = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                        history.push({ date: dateStr, amount: selectedAmount});
                        chrome.storage.sync.set({ 'history': history });
                    });
           
                newTotal += selectedAmount;
                chrome.storage.sync.set({ 'total': newTotal }, function () {
                    if (newTotal >= budget.limit) {
                        chrome.notifications.create('limitNotif',
                            createNotification('basic', '/images/b_icon-48.png', 'Limit reached', 'Looks like you reached your limit!'));
                    }
                });
            });
        }
        else {
            chrome.notifications.create('selectionAlert',
                createNotification('basic', '/images/b_icon-48.png', 'Select a valid price', 'Looks like your selection is invalid!'));
        }
    }
});

chrome.runtime.onInstalled.addListener(function () {
    setUpContextMenu();
});

chrome.storage.onChanged.addListener(function (changes) {
    if (changes.total && changes.total.newValue !== undefined) {
        chrome.action.setBadgeText({ "text": changes.total.newValue.toString() });

        chrome.storage.sync.get('limit', function (data) {
            if (changes.total.newValue > data.limit) {
                chrome.action.setBadgeBackgroundColor({ color: [239, 22, 22, 255] }); // Red
            } else if (changes.total.newValue * 2 > data.limit) {
                chrome.action.setBadgeBackgroundColor({ color: [245, 239, 145, 255] }); // Yellow
            }
            else {
                chrome.action.setBadgeBackgroundColor({ color: [98, 193, 92, 255] }); // Green
            }
        });
    } else {
        console.error('newValue for total is undefined');
    }
});
