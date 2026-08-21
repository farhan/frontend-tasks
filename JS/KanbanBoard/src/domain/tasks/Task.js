class Task {
    constructor({
        id = null,
        title,
        description = "",
        assignee = null,
        dueDate = null,
        priority = "Medium",
        status = "Todo",
        comments = [],
        attachments = [],
        createdAt = new Date(),
        updatedAt = new Date()
    }) {
        if (id !== null && id !== undefined) {
            this.id = id;
        }
        // Title: required, max 100 chars
        if (!title || typeof title !== "string" || title.trim().length === 0) {
            throw new Error("Title is required.");
        }
        if (title.length > 100) {
            throw new Error("Title cannot exceed 100 characters.");
        }
        this.title = title;

        // Description (Markdown supported)
        this.description = description;

        // Assignee (Authenticated user object or ID)
        this.assignee = assignee; // Should validate externally from authenticated users

        // Due Date (UTC ISO String; validate future date)
        if (dueDate !== null) {
            const now = new Date();
            const due = new Date(dueDate);
            if (isNaN(due.getTime())) {
                throw new Error("Invalid due date.");
            }
            if (due < now) {
                throw new Error("Due Date must be in the future.");
            }
            this.dueDate = due.toISOString(); // Store as ISO string, timezone-aware
        } else {
            this.dueDate = null;
        }

        // Priority (Low/Medium/High/Critical)
        const priorities = ["Low", "Medium", "High", "Critical"];
        if (!priorities.includes(priority)) {
            throw new Error("Invalid priority.");
        }
        this.priority = priority;

        // Status (Todo/In Progress/UAT/Done)
        const statuses = ["Todo", "In Progress", "UAT", "Done"];
        if (!statuses.includes(status)) {
            throw new Error("Invalid status.");
        }
        this.status = status;

        // Comments (Array of comment objects w/ history)
        // Each comment: { id, author, message, createdAt, editHistory: [{message, editedAt}] }
        this.comments = Array.isArray(comments) ? comments : [];

        // Attachments (Array of attachment indexdb keys or data)
        // Each attachment: { id, filename, type, indexdbKey, uploadedAt }
        this.attachments = Array.isArray(attachments) ? attachments : [];

        // Timestamps
        this.createdAt = createdAt instanceof Date ? createdAt.toISOString() : createdAt;
        this.updatedAt = updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt;
    }

    addComment({ author, message }) {
        if (!author || typeof message !== "string" || message.trim().length === 0) {
            throw new Error("Author and non-empty message are required.");
        }
        const comment = {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
            author,
            message,
            createdAt: new Date().toISOString(),
            editHistory: []
        };
        this.comments.push(comment);
        this.updatedAt = new Date().toISOString();
        return comment;
    }

    editComment(commentId, newMessage) {
        const comment = this.comments.find(c => c.id === commentId);
        if (!comment) throw new Error("Comment not found.");
        comment.editHistory = comment.editHistory || [];
        comment.editHistory.push({
            message: comment.message,
            editedAt: new Date().toISOString()
        });
        comment.message = newMessage;
        this.updatedAt = new Date().toISOString();
    }

    addAttachment({ filename, type, indexdbKey }) {
        // indexdbKey: unique key for image/blob in IndexedDB
        if (!filename || !type || !indexdbKey) {
            throw new Error("Attachment must have filename, type, and indexdbKey.");
        }
        const attachment = {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
            filename,
            type,
            indexdbKey,
            uploadedAt: new Date().toISOString()
        };
        this.attachments.push(attachment);
        this.updatedAt = new Date().toISOString();
        return attachment;
    }

    removeAttachment(attachmentId) {
        this.attachments = this.attachments.filter(att => att.id !== attachmentId);
        this.updatedAt = new Date().toISOString();
    }

    toJSON() {
        // Serialization (for persistence)
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            assignee: this.assignee,
            dueDate: this.dueDate,
            priority: this.priority,
            status: this.status,
            comments: this.comments,
            attachments: this.attachments,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Static helper for IndexedDB (not actual implementation)
    static async saveAttachmentToIndexedDB(file) {
        // The actual code would require a db instance;
        // here is a placeholder interface (should use idb or similar lib in practice)
        // Returns indexdbKey
        // e.g., IndexedDBUtil.saveFile(file)
        throw new Error("Not implemented: saveAttachmentToIndexedDB");
    }

    // You might have helpers like: getAssigneeName(), getMarkdownDescription(), etc.
}

export { Task as default };
