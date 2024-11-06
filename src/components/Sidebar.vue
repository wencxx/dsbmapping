<template>
    <div class="w-[15dvw] h-screen bg-slate-900 text-white  py-5 space-y-10">
        <div class="flex items-center justify-center gap-x-2">
            <img src="../assets/logo.png" alt="logo" class="w-12 aspect-square -mt-2">
            <h1 class="font-bold text-lg">Rural Health Unit</h1>
        </div>
        <nav>
            <ul class="flex flex-col">
                <li v-if="role === 'Admin'" class="w-full">
                    <router-link :to="{ name: 'dashboard'}" class="w-full flex justify-start items-center pl-10 gap-x-3 py-2 hover:bg-blue-800">
                        <Icon icon="bx:line-chart" class="text-3xl"/>
                        <p>Dashboard</p>
                    </router-link>
                </li>
                <li class="w-full">
                    <router-link :to="{ name: 'residents'}" class="w-full flex justify-start items-center pl-10 gap-x-3 py-2 hover:bg-blue-800">
                        <Icon icon="mdi:people-group" class="text-3xl"/>
                        <p>Residents</p>
                    </router-link>
                </li>
                <li class="w-full">
                    <router-link :to="{ name: 'households'}" class="w-full flex justify-start items-center pl-10 gap-x-3 py-2 hover:bg-blue-800">
                        <Icon icon="fa6-solid:house" class="text-3xl"/>
                        <p>Households</p>
                    </router-link>
                </li>
                <li v-if="role === 'Admin'" class="w-full">
                    <router-link :to="{ name: 'announcements'}" class="w-full flex justify-start items-center pl-10 gap-x-3 py-2 hover:bg-blue-800">
                        <Icon icon="material-symbols:newspaper" class="text-3xl"/>
                        <p>Announcements</p>
                    </router-link>
                </li>
                <li v-if="role === 'Admin'" class="w-full">
                    <router-link :to="{ name: 'reports'}" class="w-full flex justify-start items-center pl-10 gap-x-3 py-2 hover:bg-blue-800">
                        <Icon icon="mingcute:report-forms-line" class="text-3xl"/>
                        <p>Reports</p>
                    </router-link>
                </li>
                <li v-if="role === 'Admin'" class="w-full">
                    <router-link :to="{ name: 'map'}" class="w-full flex justify-start items-center pl-10 gap-x-3 py-2 hover:bg-blue-800">
                        <Icon icon="ri:road-map-fill" class="text-3xl"/>
                        <p>Maps</p>
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { useAuthStore } from '@store'
import { computed } from 'vue'

const authStore = useAuthStore()

const role = computed(() => authStore.role)

</script>

<style scoped>
.router-link-active {
    background-color: #1e40af
}
</style>