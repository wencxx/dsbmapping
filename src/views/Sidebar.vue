<template>
    <div class="w-[5dvw] h-screen bg-slate-900 text-white  py-5 space-y-10">
        <h1 class="text-center font-semibold text-3xl">RHU</h1>
        <nav>
            <ul class="flex flex-col items-center">
                <li v-if="role === 'Admin'" class="w-full">
                    <router-link :to="{ name: 'dashboard'}" class="w-full flex justify-center py-2 group relative hover:bg-blue-800">
                        <Icon icon="bx:line-chart" class="text-3xl"/>
                        <div class="absolute left-[100%] top-0 bg-black/20 h-full items-center justify-center w-full hidden group-hover:flex !z-[1000]">
                            <p>Dashboard</p>
                        </div>
                    </router-link>
                </li>
                <li class="w-full">
                    <router-link :to="{ name: 'residents'}" class="w-full flex justify-center py-2 group relative hover:bg-blue-800">
                        <Icon icon="mdi:people-group" class="text-3xl"/>
                        <div class="absolute left-[100%] top-0 bg-black/20 h-full items-center justify-center w-full hidden group-hover:flex !z-[1000]">
                            <p>Residents</p>
                        </div>
                    </router-link>
                </li>
                <li class="w-full">
                    <router-link :to="{ name: 'households'}" class="w-full flex justify-center py-2 group relative hover:bg-blue-800">
                        <Icon icon="fa6-solid:house" class="text-3xl"/>
                        <div class="absolute left-[100%] top-0 bg-black/20 h-full items-center justify-center w-full hidden group-hover:flex !z-[1000]">
                            <p>Households</p>
                        </div>
                    </router-link>
                </li>
                <li v-if="role === 'Admin'" class="w-full">
                    <router-link :to="{ name: 'map'}" class="w-full flex justify-center py-2 group relative hover:bg-blue-800">
                        <Icon icon="mingcute:report-forms-line" class="text-3xl"/>
                        <div class="absolute left-[100%] top-0 bg-black/20 h-full items-center justify-center w-full hidden group-hover:flex !z-[1000]">
                            <p>Reports</p>
                        </div>
                    </router-link>
                </li>
                <li v-if="role === 'Admin'" class="w-full">
                    <router-link :to="{ name: 'map'}" class="w-full flex justify-center py-2 group relative hover:bg-blue-800">
                        <Icon icon="ri:road-map-fill" class="text-3xl"/>
                        <div class="absolute left-[100%] top-0 bg-black/20 h-full items-center justify-center w-full hidden group-hover:flex !z-[1000]">
                            <p>Map</p>
                        </div>
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