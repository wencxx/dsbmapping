<template>
    <div class="absolute top-0 left-0 w-screen h-screen bg-black/55 flex items-center justify-center">
        <form @submit.prevent="addResident" class="bg-white w-1/2 h-fit rounded-md p-5 space-y-7">
            <h1 class="text-center text-xl">Resident Information Form</h1>
            <div class="grid grid-cols-3 gap-5">    
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Firstname</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="residentData.firstName">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Middlename</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="residentData.middleName">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Lastname</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="residentData.lastName">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Birthdate</label>
                    <input type="date" class="h-10 rounded border border-black pl-2" v-model="residentData.birthdate">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Status</label>
                    <select class="h-10 rounded border border-black pl-2" v-model="residentData.status">
                        <option value="">Select Status</option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Annulled</option>
                        <option>Seperated</option>
                        <option>Widow</option>
                    </select>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Gender</label>
                    <select class="h-10 rounded border border-black pl-2" v-model="residentData.gender">
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Educational Attainment</label>
                    <select class="h-10 rounded border border-black pl-2" v-model="residentData.educationalAttainment">
                        <option value="">Select Educational Attainment</option>
                        <option>No Grade Completed</option>
                        <option>Elementary Level</option>
                        <option>Elementary Graduate</option>
                        <option>Highschool Level</option>
                        <option>Highschool/SHS Graduate</option>
                        <option>College Level</option>
                        <option>College Graduate</option>
                    </select>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Household Number</label>
                    <select class="h-10 rounded border border-black pl-2" v-model="residentData.householdNumber">
                        <option value="">Select Household Number</option>
                        <option v-for="household in households" :key="household.id">{{ household.householdNumber }}</option>
                    </select>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Religion</label>
                    <select class="h-10 rounded border border-black pl-2" v-model="residentData.religion">
                        <option value="">Select Religion</option>
                        <option>Roman Catholic</option>
                        <option>Baptist</option>
                        <option>Seventh Day Adventist</option>
                    </select>
                </div>
                <h1 class="col-span-3 font-semibold text-lg">Medical History</h1>
                <div class="col-span-3 grid grid-cols-5">
                    <div class="flex items-center gap-x-2">
                        <p>Hypertension</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Hypertension" v-model="residentData.medicalHistory">
                    </div>
                    <div class="flex items-center gap-x-2">
                        <p>Diabetes</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Diabetes" v-model="residentData.medicalHistory">
                    </div>
                    <div class="flex items-center gap-x-2">
                        <p>Cancer</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Cancer" v-model="residentData.medicalHistory"> 
                    </div>
                    <div class="flex items-center gap-x-2">
                        <p>Tuberculosis</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Tuberculosis" v-model="residentData.medicalHistory">
                    </div>
                    <div class="flex items-center gap-x-2">
                        <p>Others</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Others" v-model="residentData.medicalHistory">
                    </div>
                </div>
                <div class="col-span-3 flex justify-end items-center gap-x-3 mt-5">
                    <button class="w-1/6 border py-1 rounded bg-red-500 text-white hover:bg-red-600" type="button" @click="closeModal">Back</button>
                    <button v-if="!addingResident" class="w-1/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600">Add Resident</button>
                    <button v-else class="w-1/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600 animate-pulse" disabled>Adding Resident</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, defineEmits, ref } from 'vue'
import { useDataStore } from '@store'
import { db } from '@config/firebaseConfig.js'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const dataStore = useDataStore()
const households = computed(() => dataStore.households)

const residentData = ref({
    firstName: '',
    middleName: '',
    lastName: '',
    birthdate: '',
    status: '',
    gender: '',
    educationalAttainment: '',
    householdNumber: '',
    religion: '',
    medicalHistory: [],
})

const emit = defineEmits(['closeModal'])

const closeModal = () => {
    emit('closeModal')
}

// add data
const residentRef = collection(db, 'residents')
const addingResident = ref(false)

const addResident = async () => {
    try {
        addingResident.value = true
        const snapshot = await addDoc(residentRef, {
            ...residentData.value,
            addedAt: Timestamp.now()
        })  
        
        if(snapshot.empty) return $toast.error("Failed to add resident")
        closeModal()
        addingResident.value = false
        $toast.success("Added resident successfully")
    } catch (error) {
        $toast.error(error.message)
    }
}
</script>