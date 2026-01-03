import db from './AppDatabase.js';
import Task from '../../domain/tasks/Task.js';

class TaskRepository {
    /**
     * Get all tasks
     * @returns {Promise<Task[]>}
     */
    async getAll() {
        const rawTasks = await db.tasks.toArray();
        return rawTasks.map(data => new Task(data));
    }

    /**
     * Get task by ID
     * @param {number} id 
     * @returns {Promise<Task|null>}
     */
    async getById(id) {
        const data = await db.tasks.get(id);
        return data ? new Task(data) : null;
    }

    /**
     * Save or update a task
     * @param {Task} task 
     * @param {number} [id] 
     * @returns {Promise<number>} ID of the saved task
     */
    async save(task, id) {
        const taskData = task.toJSON();
        if (id) {
            await db.tasks.update(id, taskData);
            return id;
        } else {
            return await db.tasks.add(taskData);
        }
    }

    /**
     * Delete a task
     * @param {number} id 
     */
    async delete(id) {
        await db.tasks.delete(id);
    }

    /**
     * Get tasks by status
     * @param {string} status 
     * @returns {Promise<Task[]>}
     */
    async getByStatus(status) {
        const rawTasks = await db.tasks.where('status').equals(status).toArray();
        return rawTasks.map(data => new Task(data));
    }
}

const taskRepository = new TaskRepository();
export { taskRepository as default };

