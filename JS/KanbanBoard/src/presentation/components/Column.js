import { TaskCard } from './TaskCard.js';

export class Column {
    constructor(title, status, tasks, currentUser) {
        this.title = title;
        this.status = status;
        this.tasks = tasks;
        this.currentUser = currentUser;
    }

    render() {
        const column = document.createElement('div');
        column.className = 'kanban-column flex-shrink-0';
        column.innerHTML = `
            <div class="flex items-center justify-between mb-4 px-1">
                <div class="flex items-center space-x-2">
                    <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider">${this.title}</h3>
                    <span class="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ${this.tasks.length}
                    </span>
                </div>
            </div>
            <div class="task-list bg-gray-100/50 p-2 rounded-xl min-h-[500px]" data-status="${this.status}">
                <!-- Task cards will be here -->
            </div>
        `;

        const taskList = column.querySelector('.task-list');
        this.tasks.forEach(task => {
            const card = new TaskCard(task, this.currentUser);
            taskList.appendChild(card.render());
        });

        // Drag and Drop listeners
        taskList.ondragover = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            taskList.classList.add('drag-over');
        };

        taskList.ondragleave = () => taskList.classList.remove('drag-over');

        taskList.ondrop = (e) => {
            e.preventDefault();
            taskList.classList.remove('drag-over');
            const taskId = e.dataTransfer.getData('text/plain');
            const event = new CustomEvent('task:dropped', { 
                detail: { taskId, newStatus: this.status } 
            });
            window.dispatchEvent(event);
        };

        return column;
    }
}

