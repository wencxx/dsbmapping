<template>
    <div class="!p-10 space-y-10">
        <!-- boxed data -->
       <div class="grid grid-cols-4 gap-x-10">
            <router-link :to="{ name: 'households' }" class="bg-white h-36 rounded-lg shadow flex items-center justify-center gap-x-8">
                <div class="bg-blue-600 py-3 px-5 rounded w-fit">
                    <Icon icon="fa6-solid:house" class="text-4xl text-white" />
                </div>
                <div class="flex flex-col gap-y-2">
                    <h1 class="text-xl">Total Households</h1>
                    <p class="text-2xl font-bold">{{ totalHouseholds }}</p>
                </div>
            </router-link>
            <router-link :to="{ name: 'residents' }" class="bg-white h-36 rounded-lg shadow flex items-center justify-center gap-x-8">
                <div class= "bg-blue-600 py-3 px-5 rounded w-fit">
                    <Icon icon="mdi:people-group" class="text-4xl text-white" />
                </div>
                <div class="flex flex-col gap-y-2">
                    <h1 class="text-xl">Total Residents</h1>
                    <p class="text-2xl font-bold">{{ totalResidents }}</p>
                </div>
            </router-link>
            <div class="bg-white h-36 rounded-lg shadow flex items-center justify-center gap-x-8">
                <div class="bg-blue-600 py-3 px-5 rounded w-fit">
                    <Icon icon="tabler:old" class="text-4xl text-white" />
                </div>
                <div class="flex flex-col gap-y-2">
                    <h1 class="text-xl">Total Senior Citizen</h1>
                    <p class="text-2xl font-bold">{{ totalSenior }}</p>
                </div>
            </div>
            <div class="bg-white h-36 rounded-lg shadow flex items-center justify-center gap-x-8">
                <div class="bg-blue-600 py-3 px-5 rounded w-fit">
                    <Icon icon="fa6-solid:house" class="text-4xl text-white" />
                </div>
                <div class="flex flex-col gap-y-2">
                    <h1 class="text-lg">Residents With Disease</h1>
                    <p class="text-2xl font-bold">{{ totalWithMedical }}</p>
                </div>
            </div>
       </div>
       <!-- charts -->
       <div class="grid grid-cols-2 gap-x-10">
            <div class="h-[50dvh] bg-white rounded-md flex flex-col justify-center p-10 gap-y-5">
                <h1 class="text-lg">Residents over years</h1>
                <barChart :data="groupedByYear" />
            </div>
            <div class="h-[50dvh] bg-white rounded-md flex flex-col justify-center p-10 gap-y-5">
                <h1 class="text-lg">Medical History Reports</h1>
                <lineChart :data="groupedByMedical" />
            </div>
       </div>
    </div>
</template>

<script setup>
import barChart from '@components/charts/BarChart.vue'
import lineChart from '@components/charts/LineChart.vue'
import { useDataStore } from '@store'
import { computed } from 'vue'

const dataStore = useDataStore()

const totalHouseholds = computed(() => dataStore.totalHouseholds) 
const totalResidents = computed(() => dataStore.totalResidents) 
const totalWithMedical = computed(() => dataStore.totalWithMedical) 
const totalSenior = computed(() => dataStore.totalSenior) 
const groupedByYear = computed(() => dataStore.groupedByYear) 
const groupedByMedical = computed(() => dataStore.groupedByMedical) 
</script>