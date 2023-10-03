$(function () {
    chrome.storage.sync.get(['total', 'limit'], function (budget) {
        $('#limit').text(budget.limit ? Number(budget.limit).toFixed(2) : $('#limit').text());
        if (budget.limit) {
            $('#total').text((budget.total ? budget.total.toFixed(2) : '0.00'));
            $('#remainingLimit').text((budget.limit && budget.total ? (budget.limit - budget.total).toFixed(2) : '0.00'));
        }
    })

    document.getElementById('goToOptions').addEventListener('click', function () {
        chrome.runtime.openOptionsPage();
    });


    $('#spendButton').click(function () {
        chrome.storage.sync.get(['total', 'limit'], function (budget) {
            var newTotal = 0;
            if (budget.total) {
                newTotal += parseFloat(budget.total);
            }

            var amount = $('#enteredAmount').val();
            if (amount) {
                if (amount.includes(',')) {
                    amount = amount.replace(',', '.');
                }
                newTotal += parseFloat(amount);
                var remaining = (budget.limit && budget.total) ? (budget.limit - newTotal) : 0;
            }

            chrome.storage.sync.set({ 'total': newTotal }, function () {
                if (amount && newTotal >= budget.limit) {
                    var notifOptions = {
                        type: 'basic',
                        iconUrl: '/images/b_icon-48.png',
                        title: 'Limit reached',
                        message: 'Looks like you reached your limit!'
                    };
                    chrome.notifications.create('limitNotif', notifOptions);

                }
            });

            $('#total').text(newTotal.toFixed(2));
            $('#enteredAmount').val('');
            $('#remainingLimit').text(remaining.toFixed(2));
        });

        var amount = $('#enteredAmount').val();
        if (amount) {
            chrome.storage.sync.get(['history'], function (data) {
                var history = data.history || [];
                var today = new Date();
                var dateStr = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                history.push({ date: dateStr, amount: parseFloat(amount) });
                chrome.storage.sync.set({ 'history': history });
            });
        }
    });
});
