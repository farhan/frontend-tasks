import eventBus from '../EventEmitter.js';
import { ROLES } from '../../domain/roles/RBAC.js';
import User from '../../domain/users/User.js';
import { supabase, signUpWithEmail, signInWithEmail, signOut } from '../../infrastructure/cloudStorage/supabaseUtils.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = null;
        this.INACTIVITY_LIMIT = 2 * 60 * 60 * 1000; // 2 hours
        this.initialized = false;
    }

    /**
     * Initialize auth and check for existing session
     */
    async init() {
        if (this.initialized) return;
        this.initialized = true;

        // Listen for auth state changes from Supabase
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                const userProfile = session.user.user_metadata;
                this.currentUser = new User({
                    id: session.user.id,
                    name: userProfile?.name || session.user.email.split('@')[0],
                    email: session.user.email,
                    role: userProfile?.role || ROLES.DEVELOPER,
                    language: userProfile?.language || 'en'
                });
                localStorage.setItem('kb_session', JSON.stringify(this.currentUser.toJSON()));
                this.startInactivityTimer();
                eventBus.emit('auth:login', this.currentUser);
            } else {
                this.currentUser = null;
                localStorage.removeItem('kb_session');
                clearTimeout(this.sessionTimeout);
                eventBus.emit('auth:logout', null);
            }
        });

        // Try to get existing session on init
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const userProfile = session.user.user_metadata;
            this.currentUser = new User({
                id: session.user.id,
                name: userProfile?.name || session.user.email.split('@')[0],
                email: session.user.email,
                role: userProfile?.role || ROLES.DEVELOPER,
                language: userProfile?.language || 'en'
            });
            localStorage.setItem('kb_session', JSON.stringify(this.currentUser.toJSON()));
            this.startInactivityTimer();
        } else {
            const savedUser = localStorage.getItem('kb_session');
            if (savedUser) {
                localStorage.removeItem('kb_session');
            }
        }
    }

    /**
     * Signup user (Supabase implementation)
     * @param {string} email
     * @param {string} password
     * @param {string} role
     */
    async signup(email, password, role = ROLES.DEVELOPER) {
        if (!Object.values(ROLES).includes(role)) {
            throw new Error(`Invalid role: ${role}`);
        }

        const { data, error } = await signUpWithEmail(email, password);
        if (error) {
            throw error;
        }

        // Update user metadata with the selected role
        await supabase.auth.updateUser({
            data: { role: role }
        });

        // The onAuthStateChange listener will handle setting currentUser, localStorage, timer, and emitting event.
        return { user: data.user, session: data.session, error: null };
    }

    /**
     * Login user (Mock implementation)
     * @param {string} email 
     * @param {string} role 
     */
    async login(email, password) {
        const { data, error } = await signInWithEmail(email, password);
        if (error) {
            throw error;
        }

        // The onAuthStateChange listener will handle setting currentUser, localStorage, timer, and emitting event.
        // We just need to return the user data here if needed for immediate response.
        const session = data.session;
        const userProfile = session.user.user_metadata;
        this.currentUser = new User({
            id: session.user.id,
            name: userProfile?.name || session.user.email.split('@')[0],
            email: session.user.email,
            role: userProfile?.role || ROLES.DEVELOPER,
            language: userProfile?.language || 'en'
        });
        
        localStorage.setItem('kb_session', JSON.stringify(this.currentUser.toJSON()));
        this.startInactivityTimer();
        eventBus.emit('auth:login', this.currentUser);

        return this.currentUser;
    }

    /**
     * Logout user
     */
    async logout() {
        const { error } = await signOut();
        if (error) {
            throw error;
        }
        // The onAuthStateChange listener will handle clearing currentUser, localStorage, timer, and emitting event.
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

