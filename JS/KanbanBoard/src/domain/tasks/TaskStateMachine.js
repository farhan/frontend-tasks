import { PERMISSIONS, RBAC } from '../roles/RBAC.js';
import eventBus from '../../core/EventEmitter.js';

const TASK_STATUS = {
    TODO: 'Todo',
    IN_PROGRESS: 'In Progress',
    UAT: 'UAT',
    DONE: 'Done'
};

const VALID_TRANSITIONS = {
    [TASK_STATUS.TODO]: [TASK_STATUS.IN_PROGRESS],
    [TASK_STATUS.IN_PROGRESS]: [TASK_STATUS.TODO, TASK_STATUS.UAT],
    [TASK_STATUS.UAT]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE],
    [TASK_STATUS.DONE]: [TASK_STATUS.UAT] // Allow moving back from Done if needed
};

class TaskStateMachine {
    /**
     * Validate and transition a task to a new status
     * @param {Task} task 
     * @param {string} newStatus 
     * @param {Object} user 
     * @returns {Task} The updated task
     */
    static transition(task, newStatus, user) {
        const currentStatus = task.status;

        // 1. Check if transition is valid
        if (currentStatus !== newStatus) {
            if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
                throw new Error(`Invalid transition from ${currentStatus} to ${newStatus}`);
            }
        }

        // 2. Check RBAC permissions for moving to 'Done'
        if (newStatus === TASK_STATUS.DONE) {
            if (!RBAC.canUserPerformAction(user, PERMISSIONS.MOVE_TO_DONE)) {
                throw new Error("Insufficient permissions to move task to Done.");
            }
        }

        // 3. Apply transition
        const oldStatus = task.status;
        task.status = newStatus;
        task.updatedAt = new Date().toISOString();

        // 4. Emit event for notifications
        eventBus.emit('task:status-changed', {
            taskId: task.id,
            oldStatus,
            newStatus,
            task
        });

        return task;
    }
}

export { TASK_STATUS, TaskStateMachine as default };

