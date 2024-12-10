<template>
    <div class="fixed top-0 left-0 bg-black/10 w-screen h-screen flex items-center justify-center">
        <form @submit.prevent="updateMedicalHistory" class="bg-white rounded-md h-fit w-full max-w-xl p-5 space-y-3">
            <h1 class="text-center text-lg font-semibold">Add Medical History</h1>
            <div>
                <h1 class="text-lg"><span class="font-semibold">Name:</span> {{ residentData.firstName }} {{ residentData.middleName || '' }} {{ residentData.lastName }}</h1>
                <h1 class="text-lg"><span class="font-semibold">Birthday:</span> {{ moment(residentData.birthdate).format('ll') }}</h1>
                <h1 class="text-lg"><span class="font-semibold">Gender:</span> {{ residentData.gender }}</h1>
                <h1 class="text-lg"><span class="font-semibold">Household Number:</span> {{ residentData.householdNumber }}</h1>
                <div class="text-lg mt-5 grid grid-cols-3 gap-2">
                    <div v-if="residentData.gender === 'Female'" class="space-y-1">
                        <label>Pregnant</label>
                        <div class="flex gap-x-5">
                            <div class="flex items-center gap-x-2">
                                <input type="radio" class="w-5 aspect-square" name="pregnant" value="Yes" v-model="medicalData.isPregnant">
                                <label>Yes</label>
                            </div>
                            <div class="flex items-center gap-x-2">
                                <input type="radio" class="w-5 aspect-square" name="pregnant" value="No" v-model="medicalData.isPregnant">
                                <label>No</label>
                            </div>
                        </div>
                    </div>
                    <div v-if="medicalData.isPregnant === 'Yes'" class="space-y-1">
                        <label>Prenatal</label>
                        <div class="flex gap-x-5">
                            <div class="flex items-center gap-x-2">
                                <input type="radio" class="w-5 aspect-square" name="prenatal" value="Yes" v-model="medicalData.prenatal">
                                <label>Yes</label>
                            </div>
                            <div class="flex items-center gap-x-2">
                                <input type="radio" class="w-5 aspect-square" name="prenatal" value="No" v-model="medicalData.prenatal">
                                <label>No</label>
                            </div>
                        </div>
                    </div>
                    <div v-if="medicalData.prenatal === 'Yes'" class="space-y-1">
                        <label>Check-up date</label>
                        <div class="flex gap-x-5">
                            <input type="date" class="border rounded px-1" v-model="medicalData.preCheckupDate">
                        </div>
                    </div>
                    <div v-if="medicalData.prenatal === 'Yes'" class="space-y-1">
                        <label>Follow-up date</label>
                        <div class="flex gap-x-5">
                            <input type="date" class="border rounded px-1" v-model="medicalData.followUpDate">
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label>Family Planning</label>
                        <div class="flex gap-x-5">
                            <select v-model="medicalData.familyPlanning" class="border rounded px-1">
                                <option value="" disabled>Select</option>
                                <option>Pills</option>
                                <option>Injectable</option>
                                <option>Implant</option>
                                <option>Condom</option>
                                <option>LAM</option>
                                <option>None</option>
                            </select>
                        </div>
                    </div>
                    <div class="space-y-1 col-span-3">
                        <label>Routine Vaccines</label>
                        <div class="flex gap-x-5 flex-wrap">
                            <div class="flex items-center gap-x-2">
                                <input type="checkbox" class="w-5 aspect-square" value="BCG" v-model="medicalData.vaccines">
                                <label>BCG</label>
                            </div>
                            <div class="flex items-center gap-x-2">
                                <input type="checkbox" class="w-5 aspect-square" value="Hepa B" v-model="medicalData.vaccines">
                                <label>Hepa B</label>
                            </div>
                            <div class="flex items-center gap-x-2">
                                <input type="checkbox" class="w-5 aspect-square" value="DPT-Hepa B-HiB" v-model="medicalData.vaccines">
                                <label>DPT-Hepa B-HiB</label>
                            </div>
                            <div class="flex items-center gap-x-2">
                                <input type="checkbox" class="w-5 aspect-square" value="OPV" v-model="medicalData.vaccines">
                                <label>OPV</label>
                            </div>
                            <div class="flex items-center gap-x-2">
                                <input type="checkbox" class="w-5 aspect-square" value="IPV" v-model="medicalData.vaccines">
                                <label>IPV</label>
                            </div>
                            <div class="flex items-center gap-x-2">
                                <input type="checkbox" class="w-5 aspect-square" value="PCV" v-model="medicalData.vaccines">
                                <label>PCV</label>
                            </div>
                            <div class="flex items-center gap-x-2">
                                <input type="checkbox" class="w-5 aspect-square" value="MMR" v-model="medicalData.vaccines">
                                <label>MMR</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full flex justify-end gap-x-4">
                <button class="bg-red-500 w-1/5 py-1 rounded text-white" type="button" @click="emit('closeModal')">Close</button>
                <button v-if="!updating" class="bg-green-500 w-1/5 py-1 rounded text-white">Update</button>
                <button v-else class="bg-green-500 w-1/5 py-1 rounded text-white animate-pulse" disabled>Updating</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import moment from "moment"
import { ref } from 'vue'
import { db } from '../config/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css' 

const $toast = useToast()

const emit = defineEmits(['closeModal'])

const { residentData } = defineProps({
    residentData: Object
})

const medicalData = ref({
    isPregnant: '',
    prenatal: '',
    preCheckupDate: '',
    followUpDate: '',
    familyPlanning: '',
    vaccines: [],
})

// update medical history
const updating = ref(false)

const updateMedicalHistory = async () => {
    try {
        updating.value = true
        const docRef = doc(db, 'residents', residentData.id)

        await updateDoc(docRef, medicalData.value)

        emit('closeModal')
        $toast.success('Updated medical history successfully')
    } catch (error) {
        $toast.error('Failed updating medical history')
    } finally {
        updating.value = false
    }
}
</script>   