import authManager from './core/auth/AuthManager.js';
import notificationManager from './core/notifications/NotificationManager.js';
import taskRepository from './infrastructure/storage/TaskRepository.js';
import TaskStateMachine, { TASK_STATUS } from './domain/tasks/TaskStateMachine.js';
import Task from './domain/tasks/Task.js';
import { Toast } from './presentation/components/Toast.js';
import { Column } from './presentation/components/Column.js';
import { TaskModal } from './presentation/components/TaskModal.js';
import { UserModal } from './presentation/components/UserModal.js';
import exportManager from './core/ExportManager.js';
import eventBus from './core/EventEmitter.js';
import { DataSeeder } from './infrastructure/storage/DataSeeder.js';

class App {
    constructor() {
        this.boardContainer = document.querySelector('#kanban-board > div');
        this.appContainer = document.querySelector('#app');
        this.authOverlay = document.querySelector('#auth-overlay');
        
        // Profile Dropdown Elements
        this.profileBtn = document.querySelector('#profile-menu-button');
        this.profileDropdown = document.querySelector('#profile-dropdown');
        this.profileIcon = document.querySelector('#user-profile-icon');
        this.dropdownUserName = document.querySelector('#dropdown-user-name');
        this.dropdownUserRole = document.querySelector('#dropdown-user-role');
        this.userDisplay = document.querySelector('#user-display');
        this.roleBadge = document.querySelector('#role-badge');
    }

    async init() {
        // Seed initial data if needed
        await DataSeeder.seedIfEmpty();

        // Initialize Core Services
        await authManager.init();
        notificationManager.init();

        // Bind Global Events
        this.bindEvents();

        // Initial Auth Check
        if (authManager.isAuthenticated()) {
            this.showApp();
        } else {
            this.showLogin();
        }
    }

    bindEvents() {
        // Auth Events
        eventBus.on('auth:login', (user) => {
            this.showApp();
            Toast.show('Welcome', `Logged in as ${user.email}`, 'success');
        });

        eventBus.on('auth:logout', () => {
            this.showLogin();
            Toast.show('Logged Out', 'You have been logged out.', 'info');
        });

        // UI Events
        eventBus.on('ui:toast', ({ title, body, type }) => {
            Toast.show(title, body, type);
        });

        // Task Events
        window.addEventListener('task:dropped', async (e) => {
            const { taskId, newStatus } = e.detail;
            await this.handleTaskMove(parseInt(taskId), newStatus);
        });

        window.addEventListener('task:open-edit', async (e) => {
            this.openTaskModal(e.detail.task);
        });

        window.addEventListener('task:add-comment', async (e) => {
            const { taskId, message } = e.detail;
            const task = await taskRepository.getById(taskId);
            if (task) {
                task.addComment({ author: authManager.getUser().email, message });
                await taskRepository.save(task, taskId);
            }
        });

        // Form Bindings
        document.querySelector('#login-form').onsubmit = (e) => {
            e.preventDefault();
            const email = document.querySelector('#login-email').value;
            const role = document.querySelector('#login-role').value;
            authManager.login(email, role);
        };

        // Profile Dropdown Logic
        this.profileBtn.onclick = (e) => {
            e.stopPropagation();
            this.profileDropdown.classList.toggle('hidden');
        };

        window.onclick = () => {
            if (!this.profileDropdown.classList.contains('hidden')) {
                this.profileDropdown.classList.add('hidden');
            }
        };

        document.querySelector('#btn-dropdown-logout').onclick = () => authManager.logout();

        document.querySelector('#btn-dropdown-account').onclick = () => {
            const user = authManager.getUser();
            const modal = new UserModal(user);
            document.querySelector('#modal-container').appendChild(modal.render());
        };

        document.querySelector('#btn-add-task').onclick = () => this.openTaskModal();

        document.querySelector('#btn-dropdown-export').onclick = async () => {
            const tasks = await taskRepository.getAll();
            const json = await exportManager.exportTasks(tasks.map(t => t.toJSON()), 'json');
            exportManager.downloadFile(json, 'kanban-export.json', 'application/json');
            Toast.show('Export Success', 'Data downloaded as JSON', 'success');
        };

        // Keep session alive on clicks
        window.addEventListener('mousedown', () => authManager.recordActivity());
    }

    async showApp() {
        this.authOverlay.classList.add('hidden');
        this.appContainer.classList.remove('hidden');
        const user = authManager.getUser();
        
        // Update Header UI
        this.userDisplay.textContent = user.email;
        this.roleBadge.textContent = user.role;
        
        // Update Profile Dropdown
        this.profileIcon.src = user.profileIcon;
        this.dropdownUserName.textContent = user.name;
        this.dropdownUserRole.textContent = user.role;
        
        await this.renderBoard();
    }

    showLogin() {
        this.authOverlay.classList.remove('hidden');
        this.appContainer.classList.add('hidden');
    }

    async renderBoard() {
        this.boardContainer.innerHTML = '';
        const allTasks = await taskRepository.getAll();
        const user = authManager.getUser();

        const columns = [
            { title: 'To Do', status: TASK_STATUS.TODO },
            { title: 'In Progress', status: TASK_STATUS.IN_PROGRESS },
            { title: 'UAT', status: TASK_STATUS.UAT },
            { title: 'Done', status: TASK_STATUS.DONE }
        ];

        columns.forEach(col => {
            const tasks = allTasks.filter(t => t.status === col.status);
            const columnUI = new Column(col.title, col.status, tasks, user);
            this.boardContainer.appendChild(columnUI.render());
        });
    }

    async handleTaskMove(taskId, newStatus) {
        try {
            const task = await taskRepository.getById(taskId);
            if (!task) return;

            TaskStateMachine.transition(task, newStatus, authManager.getUser());
            await taskRepository.save(task, taskId);
            await this.renderBoard();
            
            Toast.show('Success', `Task moved to ${newStatus}`, 'success');
        } catch (error) {
            Toast.show('Action Denied', error.message, 'error');
            // Re-render to reset visual state if needed
            this.renderBoard();
        }
    }

    openTaskModal(task = null) {
        const container = document.querySelector('#modal-container');
        const modal = new TaskModal(
            task, 
            authManager.getUser(),
            async (data) => {
                if (task) {
                    // Update
                    Object.assign(task, data);
                    await taskRepository.save(task, task.id);
                    Toast.show('Updated', 'Task updated successfully', 'success');
                } else {
                    // Create
                    const newTask = new Task({ ...data, status: TASK_STATUS.TODO });
                    await taskRepository.save(newTask);
                    Toast.show('Created', 'New task added to board', 'success');
                }
                this.renderBoard();
            },
            async (id) => {
                await taskRepository.delete(id);
                this.renderBoard();
                Toast.show('Deleted', 'Task removed', 'warning');
            }
        );
        container.appendChild(modal.render());
    }
}

const app = new App();
app.init();

