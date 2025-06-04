import { createRouter, createWebHistory } from 'vue-router'
import CharacterView from '@/views/CharacterView.vue'
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import NotFound from "@/views/NotFound.vue";

import { useUserStore } from '@/stores/user'

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    {
        path: '/character',
        name: 'character',
        component: CharacterView,
        meta: { requiresAuth: true } // ← protection activée ici
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const user = useUserStore()
    if (to.meta.requiresAuth && !user.isAuthenticated) {
        next('/login') // redirige si non connecté
    } else {
        next() // autorise sinon
    }
})

export default router