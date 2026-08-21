import { PERMISSIONS, RBAC } from '../../domain/roles/RBAC.js';

export class TaskModal {
    constructor(task = null, currentUser, onSave, onDelete) {
        this.task = task;
        this.currentUser = currentUser;
        this.onSave = onSave;
        this.onDelete = onDelete;
        this.activeTab = 'details';
    }

    render() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay fixed inset-0 flex items-center justify-center p-4 z-50';
        
        const isEdit = !!this.task;
        const canEdit = !isEdit || RBAC.canUserPerformAction(this.currentUser, PERMISSIONS.EDIT_ALL_FIELDS);

        overlay.innerHTML = `
            <div class="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 class="text-lg font-bold text-gray-800">${isEdit ? 'Edit Task' : 'Create New Task'}</h2>
                    <button class="close-modal text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-6">
                    <form id="task-form" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                            <input type="text" id="task-title" required maxlength="100" 
                                ${!canEdit ? 'disabled' : ''}
                                value="${this.task?.title || ''}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                                <select id="task-priority" ${!canEdit ? 'disabled' : ''}
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                    <option value="Low" ${this.task?.priority === 'Low' ? 'selected' : ''}>Low</option>
                                    <option value="Medium" ${(!this.task || this.task.priority === 'Medium') ? 'selected' : ''}>Medium</option>
                                    <option value="High" ${this.task?.priority === 'High' ? 'selected' : ''}>High</option>
                                    <option value="Critical" ${this.task?.priority === 'Critical' ? 'selected' : ''}>Critical</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Due Date</label>
                                <input type="date" id="task-due-date" ${!canEdit ? 'disabled' : ''}
                                    value="${this.task?.dueDate ? this.task.dueDate.split('T')[0] : new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <textarea id="task-desc" rows="4" ${!canEdit ? 'disabled' : ''}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">${this.task?.description || ''}</textarea>
                        </div>
                    </form>
                    
                    ${isEdit ? `
                        <div class="mt-8 border-t border-gray-100 pt-6">
                            <h3 class="text-xs font-bold text-gray-500 uppercase mb-4">Comments</h3>
                            <div id="comments-list" class="space-y-4 mb-4">
                                ${this.task.comments.map(c => `
                                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-xs font-bold text-gray-700">${c.author}</span>
                                            <span class="text-[10px] text-gray-400">${new Date(c.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p class="text-sm text-gray-600">${c.message}</p>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="flex space-x-2">
                                <input type="text" id="new-comment" placeholder="Add a comment..." 
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm">
                                <button id="btn-add-comment" class="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900">Send</button>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        ${isEdit && RBAC.canUserPerformAction(this.currentUser, PERMISSIONS.DELETE_TASK) ? `
                            <button id="btn-delete-task" class="text-red-600 text-sm font-semibold hover:text-red-700">Delete Task</button>
                        ` : ''}
                    </div>
                    <div class="flex space-x-3">
                        <button class="close-modal px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Cancel</button>
                        <button id="btn-save-task" class="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors">
                            ${isEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Event Listeners
        const close = () => overlay.remove();
        overlay.querySelectorAll('.close-modal').forEach(b => b.onclick = close);
        
        overlay.querySelector('#btn-save-task').onclick = () => {
            const data = {
                title: overlay.querySelector('#task-title').value,
                priority: overlay.querySelector('#task-priority').value,
                dueDate: overlay.querySelector('#task-due-date').value || null,
                description: overlay.querySelector('#task-desc').value
            };
            this.onSave(data);
            close();
        };

        if (isEdit) {
            const deleteBtn = overlay.querySelector('#btn-delete-task');
            if (deleteBtn) deleteBtn.onclick = () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    this.onDelete(this.task.id);
                    close();
                }
            };

            overlay.querySelector('#btn-add-comment').onclick = () => {
                const msg = overlay.querySelector('#new-comment').value;
                if (!msg.trim()) return;
                const event = new CustomEvent('task:add-comment', { 
                    detail: { taskId: this.task.id, message: msg } 
                });
                window.dispatchEvent(event);
                overlay.querySelector('#new-comment').value = '';
                // Re-rendering comments list would be better but for now just update UI
                const list = overlay.querySelector('#comments-list');
                const div = document.createElement('div');
                div.className = "bg-gray-50 p-3 rounded-lg border border-gray-100";
                div.innerHTML = `<div class="flex justify-between items-center mb-1"><span class="text-xs font-bold text-gray-700">${this.currentUser.email}</span><span class="text-[10px] text-gray-400">Just now</span></div><p class="text-sm text-gray-600">${msg}</p>`;
                list.appendChild(div);
            };
        }

        return overlay;
    }
}

