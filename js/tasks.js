/**
 * StudySync Tasks Module
 * Handles task creation, completion, deletion, and filtering
 */

// Initialize tasks functionality
function initTasks() {
    loadTasks();
    setupTaskModal();
    setupAddTaskButton();
    setupTaskFilters();
}

// Load and display tasks
function loadTasks(filter = 'all') {
    const tasksContainer = document.getElementById('tasksContainer');
    if (!tasksContainer) return;
    
    // Clear container
    tasksContainer.innerHTML = '';
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get tasks for current user
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = allTasks[currentUser.id] || [];
    
    // Filter tasks based on selected filter
    let filteredTasks = userTasks;
    
    if (filter === 'completed') {
        filteredTasks = userTasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = userTasks.filter(task => !task.completed);
    }
    
    // Sort tasks (completed at the bottom, then by timestamp)
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return b.timestamp - a.timestamp;
    });
    
    if (filteredTasks.length === 0) {
        // Show empty state
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-square fa-3x"></i>
                <h3>No tasks ${filter !== 'all' ? `(${filter})` : ''}</h3>
                <p>${filter === 'all' ? 'Click the "Add Task" button to create your first task.' : 'Try a different filter.'}</p>
            </div>
        `;
        return;
    }
    
    // Create task items
    filteredTasks.forEach(task => {
        const taskItem = createTaskItem(task);
        tasksContainer.appendChild(taskItem);
    });
}

// Create a task item element
function createTaskItem(task) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
    taskItem.setAttribute('data-id', task.id);
    
    taskItem.innerHTML = `
        <div class="task-checkbox">
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
        </div>
        <div class="task-title">${task.title}</div>
        <div class="task-actions">
            <button class="delete-task" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    // Add event listeners
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        toggleTaskCompletion(task.id, checkbox.checked);
    });
    
    // Delete button
    taskItem.querySelector('.delete-task').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(task.id);
        }
    });
    
    return taskItem;
}

// Setup task modal
function setupTaskModal() {
    const modal = document.getElementById('taskModal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelTaskBtn');
    const form = document.getElementById('taskForm');
    
    // Close modal on X button click
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal on cancel button click
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskId = document.getElementById('taskId').value;
        const title = document.getElementById('taskTitle').value.trim();
        
        if (title) {
            if (taskId) {
                // Edit existing task (not implemented in this version)
                updateTask(taskId, title);
            } else {
                // Create new task
                createTask(title);
            }
            
            // Close modal
            modal.style.display = 'none';
        }
    });
}

// Open task modal for creating or editing
function openTaskModal(mode, task = null) {
    const modal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('taskModalTitle');
    const taskIdInput = document.getElementById('taskId');
    const taskTitleInput = document.getElementById('taskTitle');
    
    // Set modal title based on mode
    modalTitle.textContent = mode === 'create' ? 'Add New Task' : 'Edit Task';
    
    // Clear form
    taskIdInput.value = '';
    taskTitleInput.value = '';
    
    // If editing, populate form with task data
    if (mode === 'edit' && task) {
        taskIdInput.value = task.id;
        taskTitleInput.value = task.title;
    }
    
    // Show modal
    modal.style.display = 'block';
    
    // Focus on title input
    taskTitleInput.focus();
}

// Setup add task button
function setupAddTaskButton() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            openTaskModal('create');
        });
    }
}

// Create a new task
function createTask(title) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get tasks for current user
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = allTasks[currentUser.id] || [];
    
    // Create new task
    const newTask = {
        id: Date.now().toString(),
        title,
        completed: false,
        timestamp: Date.now()
    };
    
    // Add new task to user's tasks
    userTasks.push(newTask);
    
    // Update tasks in localStorage
    allTasks[currentUser.id] = userTasks;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    
    // Get active filter
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    
    // Reload tasks with active filter
    loadTasks(activeFilter);
}

// Update an existing task (not fully implemented in this version)
function updateTask(id, title) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get tasks for current user
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = allTasks[currentUser.id] || [];
    
    // Find task index
    const taskIndex = userTasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        // Update task
        userTasks[taskIndex].title = title;
        
        // Update tasks in localStorage
        allTasks[currentUser.id] = userTasks;
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        
        // Get active filter
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        // Reload tasks with active filter
        loadTasks(activeFilter);
    }
}

// Toggle task completion status
function toggleTaskCompletion(id, completed) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get tasks for current user
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = allTasks[currentUser.id] || [];
    
    // Find task index
    const taskIndex = userTasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        // Update task completion status
        userTasks[taskIndex].completed = completed;
        
        // Update tasks in localStorage
        allTasks[currentUser.id] = userTasks;
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        
        // Get active filter
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        // Reload tasks with active filter
        loadTasks(activeFilter);
    }
}

// Delete a task
function deleteTask(id) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get tasks for current user
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = allTasks[currentUser.id] || [];
    
    // Filter out the task to delete
    const updatedTasks = userTasks.filter(task => task.id !== id);
    
    // Update tasks in localStorage
    allTasks[currentUser.id] = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    
    // Get active filter
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    
    // Reload tasks with active filter
    loadTasks(activeFilter);
}

// Setup task filters
function setupTaskFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filter = button.getAttribute('data-filter');
            
            // Load tasks with selected filter
            loadTasks(filter);
        });
    });
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initTasks); 