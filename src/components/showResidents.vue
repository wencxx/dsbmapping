<template>
    <div class="fixed w-screen h-screen top-0 left-0 bg-black/10 flex items-center justify-center">
        <div class="rounded-xl w-full max-w-lg h-1/2 p-5 bg-white overflow-y-auto relative">
        <Icon icon="mdi:close" class="absolute top-5 right-5 cursor-pointer text-lg" @click="emit('closeModal')" />
            <h1 v-if="type === 'disease'" class="text-lg font-bold text-center mb-5">Residents with {{ disease }}</h1>
            <table class="w-full">
                <thead>
                    <tr class="text-start">
                        <th class="border">Resident Name</th>
                        <th class="border">Household Number</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="res in filteredResidents" :key="res.id" class="text-center">
                        <td class="border">{{ res.firstName + ' ' + res.middleName + ' ' + res.lastName }}</td>
                        <td class="border">{{ res.householdNumber }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataStore } from '@store'

const { disease, type } = defineProps({
    disease: String,
    type: String,
})

const emit = defineEmits(['closeModal'])

const dataStore = useDataStore()
const residents = computed(() => dataStore.residents)

const filteredResidents = computed(() => {
    if(type === 'disease'){
        return residents.value.filter(res => res.medicalHistory.includes(disease))
    }else if(type === 'immunizations'){
        return residents.value.filter(res => res.immunization?.includes(disease))
    }
})
</script>