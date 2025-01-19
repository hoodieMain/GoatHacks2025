import { GameManager } from "./garden/gameManager.js";

class Task {
  constructor(id, title, estimatedPomodoros, priority = 'medium') {
    this.id = id;
    this.title = title;
    this.estimatedPomodoros = estimatedPomodoros;
    this.completedPomodoros = 0;
    this.priority = priority;
    this.status = 'pending'; // pending, in-progress, completed
    this.createdAt = new Date();
    this.completedAt = null;
  }
}

class TaskManager {
  constructor() {
    this.tasks = [];
    this.currentTaskId = null;
    this.loadTasks();
  }

  addTask(title, estimatedPomodoros, priority) {
    const id = Date.now().toString();
    const task = new Task(id, title, estimatedPomodoros, priority);
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  startTask(taskId) {
    const task = this.getTask(taskId);
    if (task) {
      this.currentTaskId = taskId;
      task.status = 'in-progress';
      this.saveTasks();
    }
  }

  completePomodoro(taskId) {
    const task = this.getTask(taskId);
    if (task) {
      task.completedPomodoros++;
      this.saveTasks();
    }
  }

  completeTask(taskId) {
    const task = this.getTask(taskId);
    if (task) {
      task.status = 'completed';
      task.completedAt = new Date();
      this.currentTaskId = null;
      this.saveTasks();
    }
  }

  getTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  getCurrentTask() {
    return this.tasks.find(task => task.id === this.currentTaskId);
  }

  getPendingTasks() {
    return this.tasks.filter(task => task.status === 'pending');
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('currentTaskId', this.currentTaskId);
    this.renderTasks();
  }

  loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    this.currentTaskId = localStorage.getItem('currentTaskId');
    this.renderTasks();
  }

  renderTasks() {
    // Render current task
    const currentTaskElement = document.getElementById('currentTaskContent');
    const currentTask = this.getCurrentTask();
    
    currentTaskElement.innerHTML = currentTask ? this.createTaskHTML(currentTask, true) : '<p>No current task</p>';

    // Render pending tasks
    const pendingTasksElement = document.getElementById('pendingTasksContent');
    const pendingTasks = this.getPendingTasks();
    
    pendingTasksElement.innerHTML = pendingTasks.length > 0 ? 
      pendingTasks.map(task => this.createTaskHTML(task, false)).join('') : 
      '<p>No pending tasks</p>';

    // Add event listeners
    document.querySelectorAll('.task-actions button').forEach(button => {
      button.onclick = () => {
        const taskId = button.getAttribute('data-task-id');
        if (button.classList.contains('start-task')) {
          this.startTask(taskId);
        } else if (button.classList.contains('complete-task')) {
          this.completeTask(taskId);
        }
      };
    });
  }


  createTaskHTML(task, isCurrent) {
    return `
      <div class="task-item priority-${task.priority}">
        <h3>${task.title}</h3>
        <div class="task-details">
          <span class="pomodoro-count">
            ${task.completedPomodoros}/${task.estimatedPomodoros} pomodoros
          </span>
          <span class="task-priority">${task.priority}</span>
        </div>
        <div class="task-actions">
          ${!isCurrent ? 
            `<button class="start-task" data-task-id="${task.id}">Start</button>` : 
            `<button class="complete-task" data-task-id="${task.id}">Complete</button>`
          }
        </div>
      </div>
    `;
  }
}

// Initialize TaskManager
const taskManager = new TaskManager();

// Function to add new task from form
window.addNewTask = function() {
  const title = document.getElementById('taskTitle').value;
  const pomodoros = parseInt(document.getElementById('estimatedPomodoros').value);
  const priority = document.getElementById('taskPriority').value;

  if (title && pomodoros) {
    // Assuming taskManager is defined elsewhere and has an addTask method
    taskManager.addTask(title, pomodoros, priority);

    // Reset form inputs
    document.getElementById('taskTitle').value = '';
    document.getElementById('estimatedPomodoros').value = '1';
    document.getElementById('taskPriority').value = 'medium';
  } else {
    alert("Please fill out all required fields!");
  }
};

const timer = {
  session: 30,
  break: 5,
  sessions: 0,
};


// Timer functionality
let interval;
let gameTickInterval = 5; // The amount of time between each game tick in seconds.

let gameManager = new GameManager(); // Creates the game manager object to store data on the state of the garden and communicate with the game.
loadGameManager();
// Loads the plant_list.json file and sets the plant_list variable in the game manager.
gameManager.loadPlantData().then(() => {
  console.log('GameManager is ready with plant data.');
});

function saveGameManager() {
  console.log('gameManager', JSON.stringify(gameManager));
  localStorage.setItem('gameManager', JSON.stringify(gameManager));
}

function loadGameManager() {
  const savedData = localStorage.getItem('gameManager');
  if (savedData) {
      const parsedData = JSON.parse(savedData);
      gameManager = Object.assign(new GameManager(), parsedData);
      console.log('GameManager loaded:', gameManager);
      gameManager.rehydratePlants(); // Ensure proper instantiation
  } else {
      console.error('No gameManager data found in localStorage!');
  }
}

const buttonSound = new Audio('src/timer/button-sound.mp3');
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

const restartButton = document.getElementById('js-restart-btn');
restartButton.addEventListener('click', () => {
  buttonSound.play();
  restartTimer();
  stopTimer();
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

  if (timer.mode === 'session') {
    timer.sessions++;
    document.querySelector('.gompei-image').classList.add('float');
    document.body.classList.add('session-active');
    document.body.classList.remove('break-active');
    document.querySelector('.circle-container').classList.add('session-active');
    document.querySelector('.circle-container').classList.remove('break-active');
  }

  mainButton.dataset.action = 'stop';
  mainButton.textContent = 'stop';
  mainButton.classList.add('active');

  document.getElementById('js-minutes').setAttribute('contenteditable', 'false');
  document.getElementById('js-seconds').setAttribute('contenteditable', 'false');

  interval = setInterval(function() {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

        // Calls gameTick from gameManager to grow plants every 5 minutes.
      if (timer.remainingTime.total % gameTickInterval === 0) {
          gameManager.gameTick();
      }

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);

      switch (timer.mode) {
        case 'session':
          switchMode('break');
          document.querySelector('.gompei-image').classList.remove('float');
          document.body.classList.add('break-active');
          document.body.classList.remove('session-active');
          document.querySelector('.circle-container').classList.add('break-active');
          document.querySelector('.circle-container').classList.remove('session-active');
          break;
        default:
          switchMode('session');
          document.querySelector('.gompei-image').classList.add('float');
          document.body.classList.add('session-active');
          document.body.classList.remove('break-active');
          document.querySelector('.circle-container').classList.add('session-active');
          document.querySelector('.circle-container').classList.remove('break-active');
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

  document.querySelector('.gompei-image').classList.remove('float');
  document.body.classList.remove('session-active', 'break-active');
  document.querySelector('.circle-container').classList.remove('session-active', 'break-active');
}

function restartTimer() {
  clearInterval(interval);
  switchMode(timer.mode);
  startTimer();
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

  // Comment out or remove the line that changes the background color
  // document.body.style.backgroundColor = `var(--${mode})`;

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

document.getElementById('xp-count').innerHTML = `XP: ${gameManager.getXP()}`;

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
  saveTimerSettings();
}

function saveTimerSettings() {
  localStorage.setItem('sessionTime', timer.session);
  localStorage.setItem('breakTime', timer.break);
}

function loadTimerSettings() {
  const sessionTime = localStorage.getItem('sessionTime');
  const breakTime = localStorage.getItem('breakTime');

  if (sessionTime) {
    timer.session = parseInt(sessionTime, 10);
  }
  if (breakTime) {
    timer.break = parseInt(breakTime, 10);
  }
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

  loadTimerSettings();
  switchMode('session');
});

document.querySelector('#js-garden-btn').addEventListener('click', () => {
  saveGameManager();
  window.location.href = 'src/garden/gardenvisual.html';
});

document.getElementById("js-reset-btn").addEventListener('click', () => {
  localStorage.clear();
  gameManager = new GameManager();
  location.reload();
});


document.addEventListener('xpChanged', () => {
  const xp = gameManager.getXP();
  document.getElementById('xp-count').textContent = `XP: ${xp}`;
});