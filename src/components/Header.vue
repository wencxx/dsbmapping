<template>
    <div class="flex items-center justify-between px-10">
        <h1 class="capitalize text-xl text-gray-800">{{ $route.name }}</h1>
        <div class="flex items-center gap-x-2">
            <h1 class="capitalize font-medium">Hi, {{ currentUser?.displayName }}</h1>
            <div class="relative">
                <Icon icon="solar:user-circle-bold"  @click="toggledUserMenu = !toggledUserMenu" class="text-4xl"/>
                <div v-if="toggledUserMenu" class="absolute right-0 top-[100%] py-2 px-5 bg-white border border-gray-100 rounded">
                    <button @click="logout">Logout</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { auth } from '@config/firebaseConfig.js'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@store'
import { computed, ref } from 'vue'

const toggledUserMenu = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const logout = async () => {
    try {
        await signOut(auth)

        await authStore.logout()

        router.push('/')
    } catch (error) {
        console.log(error)
    }
}
</script>