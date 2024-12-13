import { createWebHistory, createRouter }  from 'vue-router'
import { useAuthStore } from '../store';
import dashboardView from '../views/Dashboard.vue'
import householdsView from '../views/Households.vue'

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: dashboardView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/staffs',
        name: 'staffs',
        component: () => import('../views/Staffs.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/residents',
        name: 'residents',
        component: () => import('../views/Residents.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/households',
        name: 'households',
        component: householdsView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/reports',
        name: 'reports',
        component: () => import('../views/Reports.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/announcements',
        name: 'announcements',
        component: () => import('../views/Announcements.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: () => import('../views/Calendar.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/map',
        name: 'map',
        component: () => import('../views/Map.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/newsfeed',
        name: 'newsfeed',
        component: () => import('../views/ResidentsNewsfeed.vue'),
        meta: {
            requiresAuth: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuth
    const role = authStore.role

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ path: '/' })
    }else if(to.path === '/' && isAuthenticated){
        if(role === 'Admin'){
            next({ path: '/dashboard' })
        }else{
            next({ path: '/residents' })
        }
    } else {
        next()
    }
})

export default router