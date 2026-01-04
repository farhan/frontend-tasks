import eventBus from '../EventEmitter.js';
import { ROLES } from '../../domain/roles/RBAC.js';
import User from '../../domain/users/User.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = null;
        this.INACTIVITY_LIMIT = 2 * 60 * 60 * 1000; // 2 hours
    }

    /**
     * Initialize auth and check for existing session
     */
    async init() {
        const savedUser = localStorage.getItem('kb_session');
        if (savedUser) {
            this.currentUser = new User(JSON.parse(savedUser));
            this.startInactivityTimer();
            eventBus.emit('auth:state-change', this.currentUser);
        }
    }

    /**
     * Login user (Mock implementation)
     * @param {string} email 
     * @param {string} role 
     */
    async login(email, role = ROLES.DEVELOPER) {
        // Mock name generation from email
        const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
        
        this.currentUser = new User({
            email,
            role,
            name,
            language: 'en'
        });
        
        localStorage.setItem('kb_session', JSON.stringify(this.currentUser.toJSON()));
        this.startInactivityTimer();
        eventBus.emit('auth:login', this.currentUser);
        return this.currentUser;
    }

    /**
     * Logout user
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem('kb_session');
        clearTimeout(this.sessionTimeout);
        eventBus.emit('auth:logout', null);
    }

    /**
     * Start/Reset inactivity timer for auto-logout
     */
    startInactivityTimer() {
        if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
        
        this.sessionTimeout = setTimeout(() => {
            console.log("Session expired due to inactivity.");
            this.logout();
        }, this.INACTIVITY_LIMIT);
    }

    /**
     * Record user activity to keep session alive
     */
    recordActivity() {
        if (this.currentUser) {
            this.startInactivityTimer();
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getUser() {
        return this.currentUser;
    }
}

const authManager = new AuthManager();
export { authManager as default };

