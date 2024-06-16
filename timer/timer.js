let countdownInterval;
let totalTime;
let remainingTime;
let isPaused = false;

document.getElementById('set-time').addEventListener('click', () => {
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    totalTime = (minutes * 60) + seconds;
    remainingTime = totalTime;
    displayTime(remainingTime);
});

document.getElementById('start').addEventListener('click', () => {
    if (!isPaused) {
        startCountdown();
    } else {
        isPaused = false;
        startCountdown();
    }
});

document.getElementById('pause').addEventListener('click', () => {
    clearInterval(countdownInterval);
    isPaused = true;
});

document.getElementById('reset').addEventListener('click', () => {
    clearInterval(countdownInterval);
    remainingTime = 0;
    displayTime(remainingTime);
    isPaused = false;
});

function startCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            displayTime(remainingTime);
        } else {
            clearInterval(countdownInterval);
            document.getElementById('alarm-sound').play();
        }
    }, 1000);
}

function displayTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById('timer-count').textContent = `${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}
