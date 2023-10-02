$(function () {
    chrome.storage.sync.get(['total', 'limit'], function (budget) {
        $('#total').text(budget.total.toFixed(2));
        $('#limit').text(budget.limit);
        $('#remainingLimit').text((budget.limit - budget.total).toFixed(2));
    })

    document.getElementById('goToOptions').addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });
    

    $('#spendButton').click(function () {
        chrome.storage.sync.get(['total', 'limit'], function (budget) {
            var newTotal = 0;
            if (budget.total) {
                newTotal += parseFloat(budget.total);
                console.log(`budget total: ${newTotal}`);

            }

            var amount = $('#enteredAmount').val();
            if (amount) {
                if(amount.includes(',')){
                    amount = amount.replace(',','.');
                }
                newTotal += parseFloat(amount);
                var remaining = budget.limit - newTotal;
                console.log(remaining)
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
    });
});
