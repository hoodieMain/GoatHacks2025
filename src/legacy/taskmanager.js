
class Task {

    constructor (id,title, estimatedPomodoro , priority ) {
        this.id = id ; 
        this.title = title ; 
        this.stimatedPomodoro = stimatedPomodoro ; 
        this.completed =  0 ; 
        this.priority = priority ; 
        this.status = 'pending'; // pending, in-progress, completed
        this.createdAt = new Date();
        this.completedAt = null;
    }

}

class TaskManager {

    constructor () {
        this.task ;
        this.currentTaskId = null; 
        this.loadTask; 
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
        chrome.storage.local.set({ 
            'tasks': this.tasks,
            'currentTaskId': this.currentTaskId 
        });
    }

    loadTasks() {
        chrome.storage.local.get(['tasks', 'currentTaskId'], (result) => {
            this.tasks = result.tasks || [];
            this.currentTaskId = result.currentTaskId || null;
        });
    }
}

// taskUI.js
class TaskUI {
    constructor(taskManager, pomodoroTimer) {
        this.taskManager = taskManager;
        this.pomodoroTimer = pomodoroTimer;
        this.initializeUI();
    }

    initializeUI() {
        // Add task form
        const taskForm = document.getElementById('taskForm');
        taskForm.innerHTML = `
            <input type="text" id="taskTitle" placeholder="Task title" required>
            <input type="number" id="estimatedPomodoros" min="1" value="1" required>
            <select id="taskPriority">
                <option value="high">High Priority</option>
                <option value="medium" selected>Medium Priority</option>
                <option value="low">Low Priority</option>
            </select>
            <button type="submit">Add Task</button>
        `;

        // Task list container
        const taskList = document.createElement('div');
        taskList.id = 'taskList';
        document.body.appendChild(taskList);

        this.bindEvents();
        this.renderTasks();
    }

    bindEvents() {
        // Handle new task submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('taskTitle').value;
            const pomodoros = parseInt(document.getElementById('estimatedPomodoros').value);
            const priority = document.getElementById('taskPriority').value;
            
            this.taskManager.addTask(title, pomodoros, priority);
            this.renderTasks();
        });

        // Handle Pomodoro completion
        this.pomodoroTimer.on('pomodoroComplete', () => {
            const currentTask = this.taskManager.getCurrentTask();
            if (currentTask) {
                this.taskManager.completePomodoro(currentTask.id);
                this.renderTasks();
            }
        });
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        // Current task section
        const currentTask = this.taskManager.getCurrentTask();
        if (currentTask) {
            const currentTaskElement = this.createTaskElement(currentTask, true);
            taskList.appendChild(this.createSection('Current Task', [currentTaskElement]));
        }

        // Pending tasks section
        const pendingTasks = this.taskManager.getPendingTasks()
            .map(task => this.createTaskElement(task));
        taskList.appendChild(this.createSection('Pending Tasks', pendingTasks));
    }

    createTaskElement(task, isCurrent = false) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item priority-${task.priority}`;
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <div class="task-details">
                <span class="pomodoro-count">
                    ${task.completedPomodoros}/${task.estimatedPomodoros} pomodoros
                </span>
                <span class="task-priority">${task.priority}</span>
            </div>
            <div class="task-actions">
                ${!isCurrent ? `
                    <button class="start-task" data-task-id="${task.id}">
                        Start
                    </button>
                ` : `
                    <button class="complete-task" data-task-id="${task.id}">
                        Complete
                    </button>
                `}
            </div>
        `;

        // Bind action buttons
        const actionButton = taskElement.querySelector('button');
        actionButton.addEventListener('click', () => {
            if (isCurrent) {
                this.taskManager.completeTask(task.id);
            } else {
                this.taskManager.startTask(task.id);
            }
            this.renderTasks();
        });

        return taskElement;
    }

    createSection(title, elements) {
        const section = document.createElement('div');
        section.className = 'task-section';
        section.innerHTML = `<h2>${title}</h2>`;
        elements.forEach(element => section.appendChild(element));
        return section;
    }
}

