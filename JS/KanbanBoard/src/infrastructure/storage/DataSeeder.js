import db from './AppDatabase.js';
import { TASK_STATUS } from '../../domain/tasks/TaskStateMachine.js';

export class DataSeeder {
    /**
     * Seeds the database with initial tasks if it's empty.
     */
    static async seedIfEmpty() {
        const count = await db.tasks.count();
        if (count > 0) return;

        console.log("Seeding initial demo data...");

        // Generate dates for the future to pass Task validation
        const inTwoDays = new Date();
        inTwoDays.setDate(inTwoDays.getDate() + 2);

        const inFiveDays = new Date();
        inFiveDays.setDate(inFiveDays.getDate() + 5);

        const inTenDays = new Date();
        inTenDays.setDate(inTenDays.getDate() + 10);

        const initialTasks = [
            {
                title: "Setup Project Architecture",
                description: "Define modular folders, setup Dexie.js for IndexedDB, and implement a central Event Bus for communication.\n\n**Status:** SOLID principles applied.",
                status: TASK_STATUS.DONE,
                priority: "Critical",
                assignee: "admin@example.com",
                dueDate: inTwoDays.toISOString(),
                comments: [
                    { id: 'c1', author: 'admin@example.com', message: "Initial architecture looks great!", createdAt: new Date().toISOString(), editHistory: [] }
                ],
                attachments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                title: "Implement Drag and Drop Logic",
                description: "Wiring up the native HTML5 Drag and Drop API with the `TaskStateMachine` to ensure valid transitions between columns.",
                status: TASK_STATUS.IN_PROGRESS,
                priority: "High",
                assignee: "dev@example.com",
                dueDate: inFiveDays.toISOString(),
                comments: [],
                attachments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                title: "QA Validation of RBAC",
                description: "Verify that Developers cannot move tasks to the 'Done' column, while QA and Admins can.",
                status: TASK_STATUS.UAT,
                priority: "Medium",
                assignee: "qa@example.com",
                dueDate: inTwoDays.toISOString(),
                comments: [],
                attachments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                title: "Background Data Export (Web Worker)",
                description: "Develop a Web Worker to handle JSON/CSV generation for 10k+ tasks without blocking the main thread UI.",
                status: TASK_STATUS.TODO,
                priority: "Low",
                assignee: "dev@example.com",
                dueDate: inTenDays.toISOString(),
                comments: [],
                attachments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        // We use bulkAdd on the raw db table to bypass some constructor validations 
        // if necessary, but these objects are shaped to be valid Task instances.
        await db.tasks.bulkAdd(initialTasks);
        console.log("Demo data seeded successfully.");
    }
}

