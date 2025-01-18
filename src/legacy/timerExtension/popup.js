let timerInterval;

document.getElementById('startButton').addEventListener('click', function() {
    const hoursInput = document.getElementById('hours').value;
    const minutesInput = document.getElementById('minutes').value;

    const hours = parseInt(hoursInput) || 0;
    const minutes = parseInt(minutesInput) || 0;

    const totalSeconds = (hours * 3600) + (minutes * 60);

    if (totalSeconds > 0) {
        // Send a message to the background script to start the timer
        chrome.runtime.sendMessage({ type: 'start-timer', totalSeconds: totalSeconds }, (response) => {
            console.log(response.status);
            startTimerDisplay(totalSeconds);
        });
    } else {
        alert('Please enter a valid time.');
    }
});

function startTimerDisplay(totalSeconds) {
    let timeLeft = totalSeconds;
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        document.getElementById('timerDisplay').textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}
