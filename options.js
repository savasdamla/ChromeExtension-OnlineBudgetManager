$(function () {
    $('#showLimitButton').click(function () {
        $('.limit-container').show();
        $(this).hide();
    });

    chrome.storage.sync.get('limit', function (budget) {
        $('#limit').val(budget.limit);
    })

    $('#saveLimit').click(function () {
        var limit = $('#limit').val();
        console.log('Limit button')
        if (limit) {
            chrome.storage.sync.set({ 'limit': limit }, function () {
                close();
            });
        }
    });
    $('#resetTotal').click(function () {
        chrome.storage.sync.set({ 'total': 0, 'history': [] }); // Clear the history when total is reset
        var notifOptions = {
            type: 'basic',
            iconUrl: '/images/b_icon-48.png',
            title: 'Total reset',
            message: 'Total has been set to 0!'
        };
        chrome.notifications.create('limitNotif', notifOptions);
    });


    // Spending history
function displayHistory() {
    chrome.storage.sync.get('history', function (data) {
        var history = data.history || [];
        var historyHtml = '<ul class="history-list">';
        history.forEach(function (entry) {
            historyHtml += '<li><span class="date">' + entry.date + '</span>: <span class="amount">' + entry.amount.toFixed(2) + ' €</li>';
        });
        historyHtml += '</ul>';
        $('#historyContainer').html(historyHtml);
    });
}

    $('#viewHistory').click(function () {
        displayHistory();
        $('#historyContainer').toggle();
    });

});

