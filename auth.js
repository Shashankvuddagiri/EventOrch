/**
 * Authentication Logic for Event Management Platform
 */
const Auth = {
    async signup(email, password, name) {
        try {
            await window.appwrite.account.create(window.appwrite.ID.unique(), email, password, name);
            // Automatically login after signup
            return await this.login(email, password);
        } catch (error) {
            console.error('Signup Error:', error);
            throw error;
        }
    },

    async login(email, password) {
        try {
            return await window.appwrite.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            await window.appwrite.account.deleteSession('current');
            window.location.reload();
        } catch (error) {
            console.error('Logout Error:', error);
        }
    },

    async getUser() {
        try {
            return await window.appwrite.account.get();
        } catch (error) {
            return null;
        }
    },

    async isAdmin() {
        try {
            const user = await this.getUser();
            if (!user) return false;
            
            // Hardcoded Fallback for testing/setup
            if (user.email === 'admin@test.com') return true;
            
            // Standard check for Appwrite labels
            return user.labels && user.labels.includes('admin');
        } catch (error) {
            return false;
        }
    },

    async handleAuthRedirect() {
        const isAdmin = await this.isAdmin();
        if (isAdmin) {
            if (!window.location.pathname.includes('admin.html')) {
                window.location.href = 'admin.html';
            }
        } else {
            if (window.location.pathname.includes('admin.html')) {
                window.location.href = 'index.html';
            }
        }
    }
};

window.auth = Auth;
