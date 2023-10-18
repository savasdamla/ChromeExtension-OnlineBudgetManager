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
            history.reverse().forEach(function (entry) {
                historyHtml += '<li><input type="checkbox" class="history-checkbox" style="display: none;"><span class="date">' + entry.date + '</span>: <span class="amount">' + entry.amount.toFixed(2) + ' €</span></li>';
            });
            historyHtml += '</ul>';
            $('#historyList').html(historyHtml);
        });
    }

    $('#viewHistory').click(function () {
        displayHistory();
        $('#historyContainer').toggle();
    });

    $('#editHistory').click(function() {
        $('.history-checkbox').toggle();
        $('#deleteSelected').toggle();
    });

    $('#deleteSelected').click(function() {
        chrome.storage.sync.get(['history', 'total'], function(data) {
            var history = data.history;
            var total = data.total;
    
            var indicesToDelete = [];
            $('.history-checkbox:checked').each(function() {
                var htmlIndex = $(this).closest('li').index();
                var actualIndex = history.length - 1 - htmlIndex; // index in the original array
                indicesToDelete.push(actualIndex);
                total -= history[actualIndex].amount;
            });

            indicesToDelete.sort((a, b) => b - a);
            indicesToDelete.forEach(function(index) {
                history.splice(index, 1);
            });
    
            chrome.storage.sync.set({
                'history': history,
                'total': total
            });
    
            $('.history-checkbox:checked').each(function() {
                $(this).closest('li').remove();
            });
            $('#deleteSelected').hide();
            $('.history-checkbox').hide();
        });
    });
    

});

