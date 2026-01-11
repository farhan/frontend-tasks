import authManager from './core/auth/AuthManager.js';
import { Toast } from './presentation/components/Toast.js';
import eventBus from './core/EventEmitter.js';
import { progressBar } from './core/ProgressBar.js';
import { ROLES } from './domain/roles/RBAC.js';

document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app');
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');

    console.log('main_auth_forms.js loaded.');
    console.log('authContainer:', authContainer);
    console.log('appContainer:', appContainer);

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    const showLogin = () => {
        loginView.classList.remove('hidden');
        signupView.classList.add('hidden');
    };

    const showSignup = () => {
        loginView.classList.add('hidden');
        signupView.classList.remove('hidden');
    };

    if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); showSignup(); });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                progressBar.show();
                await authManager.login(email, password);
                // Redirection to app handled by AuthManager's onAuthStateChange listener
            } catch (error) {
                Toast.show('Login Failed', error.message, 'error');
            } finally {
                progressBar.hide();
            }
        });
    }

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                progressBar.show();
                // The Supabase signUpWithEmail function does not currently accept metadata
                // You would need to add an additional step to update user metadata after signup if needed.
                const { user, session, error } = await authManager.signup(email, password, ROLES.DEVELOPER);
                if (error) throw error;
                Toast.show('Signup Successful', 'Please check your email to confirm your account.', 'success');
                showLogin(); // Show login form after successful signup
            } catch (error) {
                Toast.show('Signup Failed', error.message, 'error');
            } finally {
                progressBar.hide();
            }
        });
    }

    // Initial auth state check to show correct view
    const checkAuthAndRender = async () => {
        console.log('checkAuthAndRender called.');
        const isAuthenticated = await authManager.isAuthenticated();
        console.log('isAuthenticated:', isAuthenticated);
        if (isAuthenticated) {
            console.log('User is authenticated, showing appContainer');
            authContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            // Dynamically load and initialize main.js
            import('./main.js').then(({ default: App }) => {
                const app = new App();
                app.init();
            });
        } else {
            console.log('User is NOT authenticated, showing authContainer');
            authContainer.classList.remove('hidden');
            appContainer.classList.add('hidden');
            showLogin(); // Default to showing the login form
        }
    };

    // Listen for auth state changes from AuthManager
    eventBus.on('auth:login', () => {
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
    });

    eventBus.on('auth:logout', () => {
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
        showLogin();
    });

    // Initialize AuthManager and then check auth state
    authManager.init().then(checkAuthAndRender);

});
