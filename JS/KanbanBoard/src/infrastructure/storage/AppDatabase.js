// Using Dexie.js pattern for IndexedDB management
import Dexie from 'https://unpkg.com/dexie@latest/dist/dexie.mjs';

class AppDatabase extends Dexie {
    constructor() {
        super("KanbanBoardDB");
        
        // Define tables and indexes
        // ++id means auto-incrementing primary key
        // status and assignee are indexed for faster lookups
        this.version(1).stores({
            tasks: '++id, title, status, assignee, dueDate, priority',
            notifications: '++id, taskId, timestamp, read',
            users: '++id, email, role',
            attachments: '++id, taskId, filename'
        });
    }

    /**
     * Clear all data from the database
     */
    async clearAll() {
        await Promise.all(this.tables.map(table => table.clear()));
    }
}

const db = new AppDatabase();
export { db as default };

