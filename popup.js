$(function () {
    chrome.storage.sync.get(['total', 'limit'], function (budget) {
        $('#limit').text(budget.limit ? Number(budget.limit).toFixed(2) : $('#limit').text());
        $('#total').text(budget.total ? budget.total.toFixed(2) : '0.00');
        $('#remainingLimit').text(budget.limit && budget.total ? (budget.limit - budget.total).toFixed(2) : '0.00');
    });

    document.getElementById('goToOptions').addEventListener('click', function () {
        chrome.runtime.openOptionsPage();
    });

    $('#spendButton').click(function () {
        var amount = $('#enteredAmount').val();
        if (!isValidNumber(amount)) {
            chrome.notifications.create('entryAlert',
                createNotification('basic', '/images/b_icon-48.png', 'Enter a valid price', 'Looks like your spending entry is invalid!'));
            return;
        }

        if (amount.includes(',')) {
            amount = amount.replace(',', '.');
        }
        amount = parseFloat(amount);

        chrome.storage.sync.get(['total', 'limit', 'history'], function (data) {
            var newTotal = (data.total || 0) + amount;
            var remaining = data.limit ? (data.limit - newTotal) : 0;

            if (newTotal >= data.limit) {
                var notifOptions = {
                    type: 'basic',
                    iconUrl: '/images/b_icon-48.png',
                    title: 'Limit reached',
                    message: 'Looks like you reached your limit!'
                };
                chrome.notifications.create('limitNotif', notifOptions);
            }

            // Update history
            var today = new Date();
            var dateStr = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
            var history = data.history || [];
            history.push({ date: dateStr, amount: amount });

            chrome.storage.sync.set({
                'total': newTotal,
                'history': history
            });

            $('#total').text(newTotal.toFixed(2));
            $('#enteredAmount').val('');
            $('#remainingLimit').text(remaining.toFixed(2));
        });
    });
});
