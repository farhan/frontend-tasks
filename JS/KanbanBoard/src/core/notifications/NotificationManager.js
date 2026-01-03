import eventBus from '../EventEmitter.js';

class NotificationManager {
    constructor() {
        this.subscriptions = [];
        this.defaultSettings = {
            enableStatusChange: true,
            enableAssignment: true,
            enableDueReminders: true,
            reminderLeadTimes: [24 * 60, 60, 15], // minutes: 1 day, 1 hour, 15 mins
            channels: ['toast', 'browser']
        };
    }

    init() {
        // Listen for task-related events
        this.subscriptions.push(
            eventBus.on('task:status-changed', (data) => this.handleStatusChange(data)),
            eventBus.on('task:assigned', (data) => this.handleAssignment(data)),
            eventBus.on('task:comment-added', (data) => this.handleComment(data))
        );

        // Start due date reminder poller
        this.startDuePoller();
    }

    handleStatusChange({ task, oldStatus, newStatus }) {
        if (!this.defaultSettings.enableStatusChange) return;
        
        this.showNotification({
            title: 'Task Status Updated',
            body: `Task "${task.title}" moved from ${oldStatus} to ${newStatus}`,
            type: 'info'
        });
    }

    handleAssignment({ task, assignee }) {
        if (!this.defaultSettings.enableAssignment) return;

        this.showNotification({
            title: 'Task Assigned',
            body: `You have been assigned to: ${task.title}`,
            type: 'success'
        });
    }

    handleComment({ task, comment }) {
        this.showNotification({
            title: 'New Comment',
            body: `${comment.author} commented on "${task.title}"`,
            type: 'info'
        });
    }

    /**
     * Show notification using available channels
     */
    showNotification({ title, body, type }) {
        console.log(`[Notification] ${title}: ${body}`);
        
        // In-app toast (placeholder)
        eventBus.emit('ui:toast', { title, body, type });

        // Browser notification (if permitted)
        if (this.defaultSettings.channels.includes('browser') && Notification.permission === 'granted') {
            new Notification(title, { body });
        }
    }

    /**
     * Poller to check for upcoming due dates
     */
    startDuePoller() {
        setInterval(() => {
            eventBus.emit('system:check-due-dates');
        }, 60 * 1000); // Every minute
    }

    destroy() {
        this.subscriptions.forEach(unsubscribe => unsubscribe());
    }
}

const notificationManager = new NotificationManager();
export { notificationManager as default };

