import { defineStore } from "pinia";
import { auth } from '@config/firebaseConfig.js'; 
import { onAuthStateChanged } from 'firebase/auth';
import { useDataStore } from './index'

const useAuthStore = defineStore('authStore', {
    state: () => ({
        currentUser: null,
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
        isAuth: !!localStorage.getItem('isAuth') || false,
    }),
    actions: {
        async login(token, user, role) {
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('isAuth', true);
            this.currentUser = user;
            this.isAuth = true;
            this.token = token;
            this.role = role;

            const dataStore = useDataStore();
            if (!dataStore.households.length) { 
                dataStore.getHouseholds();
            }
        },
        async logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('isAuth');

            this.currentUser = null;
            this.isAuth = false;
            this.token = null;
        },
        initializeAuthListener() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.token = user.accessToken;
                    this.currentUser = user

                    const dataStore = useDataStore();
                    if (!dataStore.households.length) {
                        dataStore.getHouseholds();
                    }
                } else {
                    this.logout();
                }
            });
        },
    }
});

export default useAuthStore;
