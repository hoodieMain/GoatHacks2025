const timer = {
  session: 30,
  break: 5,
  sessions: 0,
};

let interval;

const buttonSound = new Audio('button-sound.mp3');
const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
  buttonSound.play();
  const { action } = mainButton.dataset;
  if (action === 'start') {
    startTimer();
  } else {
    stopTimer();
  }
});

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

document.getElementById('js-minutes').addEventListener('blur', updateTimerFromText);
document.getElementById('js-seconds').addEventListener('blur', updateTimerFromText);

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  if (timer.mode === 'session') timer.sessions++;

  mainButton.dataset.action = 'stop';
  mainButton.textContent = 'stop';
  mainButton.classList.add('active');

  document.getElementById('js-minutes').setAttribute('contenteditable', 'false');
  document.getElementById('js-seconds').setAttribute('contenteditable', 'false');

  interval = setInterval(function() {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);

      switch (timer.mode) {
        case 'session':
          switchMode('break');
          break;
        default:
          switchMode('session');
      }

      if (Notification.permission === 'granted') {
        const text =
          timer.mode === 'session' ? 'Get back to work!' : 'Take a break!';
        new Notification(text);
      }

      document.querySelector(`[data-sound="${timer.mode}"]`).play();

      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = 'start';
  mainButton.textContent = 'start';
  mainButton.classList.remove('active');

  document.getElementById('js-minutes').setAttribute('contenteditable', 'true');
  document.getElementById('js-seconds').setAttribute('contenteditable', 'true');
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, '0');
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  const min = document.getElementById('js-minutes');
  const sec = document.getElementById('js-seconds');
  min.textContent = minutes;
  sec.textContent = seconds;

  const text =
    timer.mode === 'session' ? 'Get back to work!' : 'Take a break!';
  document.title = `${minutes}:${seconds} — ${text}`;

  const progress = document.getElementById('js-progress');
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  document
    .querySelectorAll('button[data-mode]')
    .forEach(e => e.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  document.body.style.backgroundColor = `var(--${mode})`;
  document
    .getElementById('js-progress')
    .setAttribute('max', timer.remainingTime.total);

  document.getElementById('js-minutes').textContent = timer[mode];
  document.getElementById('js-seconds').textContent = '00';

  updateClock();
}

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchMode(mode);
  stopTimer();
}

function updateTimerFromText() {
  const minutes = parseInt(document.getElementById('js-minutes').textContent, 10);
  const seconds = parseInt(document.getElementById('js-seconds').textContent, 10);

  if (timer.mode === 'session') {
    timer.session = minutes;
  } else {
    timer.break = minutes;
  }

  timer.remainingTime = {
    total: minutes * 60 + seconds,
    minutes: minutes,
    seconds: seconds,
  };

  document.getElementById('js-progress').setAttribute('max', timer.remainingTime.total);
  updateClock();
}

document.addEventListener('DOMContentLoaded', () => {
  if ('Notification' in window) {
    if (
      Notification.permission !== 'granted' &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          new Notification(
            'Awesome! You will be notified at the start of each session'
          );
        }
      });
    }
  }

  switchMode('session');
});