# Advanced Kanban Board

An enterprise-grade Kanban board with role-based access control, real-time notifications, and high-performance data exports.

## Features

- **Role-Based Access Control (RBAC)**: Admin, QA, and Developer roles with distinct permissions.
- **Task Management**: Drag and drop tasks between columns (Todo, In Progress, UAT, Done).
- **Persistence**: Powered by IndexedDB (via Dexie.js) for robust client-side storage.
- **Notifications**: System-wide event bus for status changes and assignments.
- **Performance**: Web Worker-driven data exports (JSON/CSV) to prevent UI blocking.
- **Session Management**: 2-hour inactivity auto-logout.

## How to Run

1. Navigate to this directory:
   ```bash
   cd JS/KanbanBoard
   ```

2. Start the local server:
   ```bash
   make serve
   ```

3. Open your browser to:
   [http://localhost:8000](http://localhost:8000)

## Demo Credentials

| Role | Email |
| :--- | :--- |
| **Admin** | `admin@example.com` |
| **QA** | `qa@example.com` |
| **Developer** | `dev@example.com` |

