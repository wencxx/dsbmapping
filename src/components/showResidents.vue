<template>
    <div class="fixed w-screen h-screen top-0 left-0 bg-black/10 flex items-center justify-center">
        <div class="rounded-xl w-full max-w-2xl h-1/2 p-5 bg-white overflow-y-auto relative">
        <Icon icon="mdi:close" class="absolute top-5 right-5 cursor-pointer text-lg" @click="emit('closeModal')" />
            <h1 v-if="type === 'disease'" class="text-lg font-bold text-center mb-5">Residents with {{ disease }}</h1>
            <div class="flex justify-end gap-x-2 my-2 mt-6">
                <button class="bg-blue-500 px-3 text-white rounded" v-print="'#medicalReports'">Print</button>
                <download-csv
                    :data="downloadable()" name="reports.csv" class="bg-green-500 px-3 text-white rounded cursor-pointer">
                    Download Data
                </download-csv>
            </div>
            <table class="w-full" id="medicalReports">
                <thead>
                    <tr class="text-start">
                        <th class="border">Barangay</th>
                        <th class="border" v-if="type === 'disease'">Comorbidites</th>
                        <th class="border" v-else-if="type === 'immunizations'">Immunizations</th>
                        <th class="border" v-else-if="type === 'familyPlanning'">Family Planning</th>
                        <th class="border" v-else></th>
                        <th class="border">Resident Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="res in filteredResidents" :key="res.id" class="text-center">
                        <td class="border">{{ barangay(res.householdNumber) }}</td>
                        <td class="border">{{ disease }}</td>
                        <td class="border">{{ res.firstName + ' ' + res.middleName + ' ' + res.lastName }}</td>
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
const households = computed(() => dataStore.households)

const filteredResidents = computed(() => {
    if(type === 'disease'){
        return residents.value.filter(res => res.medicalHistory.includes(disease))
    }else if(type === 'immunizations'){
        return residents.value.filter(res => res.immunization?.includes(disease))
    }else if(type === 'dewormed'){
        return residents.value.filter(res => res.isDewormed)
    }else if(type === 'notDewormed'){
        return residents.value.filter(res => res.isDewormed === false)
    }else if(type === 'familyPlanning'){
        return residents.value.filter(res => res.familyPlanning === disease)
    }else if(type === 'Pregnant'){
        return residents.value.filter(res => res.isPregnant === 'Yes')
    }else if(type === 'notPregnant'){
        return residents.value.filter(res => res.isPregnant === 'No')
    }
})

const barangay = (householdNum) => {
    const foundeHousehold = households.value.find(household => household.householdNumber == householdNum)

    return foundeHousehold.address.split(', ')[1]
}

const downloadable = () => {
    return filteredResidents.value.map(resident => ({
        householdNumber: resident.householdNumber,
        firstName: resident.firstName,
        middleName: resident.middleName,
        lastName: resident.lastName,
        disease: disease,
    }));
};
</script>