import { PERMISSIONS, RBAC } from '../../domain/roles/RBAC.js';

export class TaskCard {
    /**
     * @param {Task} task 
     * @param {Object} currentUser 
     */
    constructor(task, currentUser) {
        this.task = task;
        this.currentUser = currentUser;
    }

    render() {
        const card = document.createElement('div');
        card.className = `task-card bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-200 hover:shadow-md transition-shadow priority-${this.task.priority.toLowerCase()}`;
        card.setAttribute('draggable', 'true');
        card.dataset.taskId = this.task.id;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-gray-100 text-gray-600">
                    ${this.task.priority}
                </span>
                ${this.task.dueDate ? `
                    <span class="text-[10px] text-gray-400 font-medium">
                        Due ${new Date(this.task.dueDate).toLocaleDateString()}
                    </span>
                ` : ''}
            </div>
            <h4 class="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">${this.task.title}</h4>
            <div class="flex items-center justify-between mt-3">
                <div class="flex -space-x-1">
                    <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-white">
                        ${this.task.assignee ? this.task.assignee.charAt(0).toUpperCase() : '?'}
                    </div>
                </div>
                <div class="flex items-center space-x-2 text-gray-400">
                    <span class="flex items-center text-[10px]">
                        <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        ${this.task.comments.length}
                    </span>
                </div>
            </div>
        `;

        // Event Listeners
        card.ondblclick = () => this.onOpenEdit();
        card.ondragstart = (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.task.id);
            e.dataTransfer.effectAllowed = 'move';
        };
        card.ondragend = () => card.classList.remove('dragging');

        return card;
    }

    onOpenEdit() {
        const event = new CustomEvent('task:open-edit', { detail: { task: this.task } });
        window.dispatchEvent(event);
    }
}


