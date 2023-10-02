$(function () {
    $('#showLimitButton').click(function() {
        console.log("hdshdf")
        $('.limit-container').show(); 
        $(this).hide(); 
    });

    chrome.storage.sync.get('limit', function(budget){
        $('#limit').val(budget.limit);
    })

    $('#saveLimit').click(function () {
        var limit = $('#limit').val();
        if (limit) {
            chrome.storage.sync.set({ 'limit': limit }, function () {
                close();
            });
        }
    });
    $('#resetTotal').click(function () {
        console.log("Reset set!");
        chrome.storage.sync.set({ 'total': 0 });
        var notifOptions = {
            type: 'basic',
            iconUrl: '/images/b_icon-48.png',
            title: 'Total reset',
            message: 'Total has been set to 0!'
        };
        chrome.notifications.create('limitNotif', notifOptions);
    });
});