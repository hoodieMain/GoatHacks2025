chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'start-timer') {
        const totalSeconds = request.totalSeconds;
        chrome.alarms.create('timerAlarm', { delayInMinutes: totalSeconds / 60 });
        sendResponse({ status: 'Timer started' });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'timerAlarm') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Timer Extension',
            message: 'Time is up!'
        });
    }
});
