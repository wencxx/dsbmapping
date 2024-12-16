<template>
    <div class="absolute top-0 left-0 w-screen h-screen bg-black/55 flex items-center justify-center">
        <form @submit.prevent="addResident" class="bg-white w-1/2 h-fit max-h-[80dvh] overflow-y-auto rounded-md p-5 space-y-7">
            <h1 class="text-center text-xl">Resident Information Form</h1>
            <div class="grid grid-cols-3 gap-5">  
                <p v-if="err" class="col-span-3 bg-red-500 text-white pl-2 py-1 rounded">{{ err }}</p>  
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
                    <input type="date" class="h-10 rounded border border-black pl-2" v-model="residentData.birthdate" @change="checkAgeIfBelow4">
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
                <div v-if="isBelowFour" class="flex flex-col gap-y-2">
                    <label class="text-lg">Weight</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="residentData.weight">
                </div>
                <div v-if="isBelowFour" class="flex flex-col gap-y-2">
                    <label class="text-lg">Height</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="residentData.height">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Relationship to the Household Head</label>
                    <select class="h-10 rounded border border-black pl-2" v-model="residentData.relationshipToTheHead">
                        <option value="">Relationship to the Household Head</option>
                        <option>Spouse</option>
                        <option>Child</option>
                        <option>Son-in-law</option>
                        <option>Daughter-in-law</option>
                        <option>Grandchild</option>
                        <option>Parent</option>
                        <option>Parent-in-law</option>
                        <option>Sibling</option>
                        <option>Brother-in-law</option>
                        <option>Sister-in-law</option>
                        <option>Nephew</option>
                        <option>Niece</option>
                        <option>Other Relative</option>
                        <option>Household Help</option>
                        <option>Boarder</option>
                        <option>Other Non-relative</option>
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
                        <option>Master's Level</option>
                        <option>Master's Degree</option>
                        <option>Doctorate's Level</option>
                        <option>Doctorate's Degrree</option>
                    </select>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Email</label>
                    <input type="email" class="h-10 rounded border border-black pl-2" v-model="residentData.email">
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
                        <option>Islam</option>
                        <option>Iglesia Ni Cristo</option>
                        <option>IFI</option>
                        <option>PGDA</option>
                        <option>Protestants</option>
                        <option>Seventh Day Adventist</option>
                        <option>Jehovah's Witness</option>
                        <option>Born Again Christian</option>
                        <option>Church of Jesus Christ of Latter-Day Saints (Mormon)</option>
                        <option>Others</option>
                    </select>
                </div>
                <div v-if="isBetweenSix" class="flex flex-col gap-y-2 col-span-3">
                    <label class="text-lg">Deworming</label>
                    <div class="flex items-center gap-x-5 rounded h-10">
                        <div class="flex items-center gap-x-2">
                            <label class="text-lg">Yes</label>
                            <input type="radio" name="deworming" :value="true" v-model="residentData.isDewormed" class="w-4 aspect-square">
                        </div>
                        <div class="flex items-center gap-x-2">
                            <label class="text-lg">No</label>
                            <input type="radio" name="deworming" :value="false" v-model="residentData.isDewormed" class="w-4 aspect-square">
                        </div>
                    </div>
                </div> 
                <h1 v-if="isBelowFour" class="col-span-3 font-semibold text-lg">Immunization</h1>
                <div v-if="isBelowFour" class="col-span-3 grid grid-cols-5 gap-3">
                    <div class="flex items-center justify-center gap-x-2">
                        <p>BCG</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="BCG" v-model="residentData.immunization">
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>Hepa B</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Hepa B" v-model="residentData.immunization">
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>DPT-Hepa B-HiB</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="DPT-Hepa B-HiB" v-model="residentData.immunization"> 
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>OPV</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="OPV" v-model="residentData.immunization">
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>IPV</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="IPV" v-model="residentData.immunization">
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>PCV</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="PCV" v-model="residentData.immunization">
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>MMR</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="MMR" v-model="residentData.immunization">
                    </div>
                    <div class="col-span-5 flex flex-col">
                        <label class="text-lg">Date Taken</label>
                        <input type="date" class="h-10 rounded border border-black pl-2 w-1/3" v-model="residentData.immunizationDate">
                    </div>
                </div>
                <h1 class="col-span-3 font-semibold text-lg">Medical History</h1>
                <div class="col-span-3 grid grid-cols-7 gap-3">
                    <div class="flex items-center justify-center gap-x-2">
                        <p>Hypertension</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Hypertension" v-model="residentData.medicalHistory">
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>Diabetes</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Diabetes" v-model="residentData.medicalHistory">
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>Cancer</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Cancer" v-model="residentData.medicalHistory"> 
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>Tuberculosis</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Tuberculosis" v-model="residentData.medicalHistory">
                    </div>
                    <div class="flex items-center justify-center gap-x-2">
                        <p>Others</p>
                        <input type="checkbox" class="border w-4 aspect-square" @change="others = !others">
                    </div>
                    <div v-if="others" class="flex items-center gap-x-2 col-span-2">
                        <input type="text" class="border w-full h-8 pl-2" placeholder="Enter other comorbidities" v-model="otherMedicalHistory" @change="inputOtherMedicalHistory">
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
import { db, auth } from '@config/firebaseConfig.js'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const dataStore = useDataStore()
const households = computed(() => dataStore.households)

const others = ref(false)

const otherMedicalHistory = ref('')

const inputOtherMedicalHistory = () => {
    if(otherMedicalHistory.value){
        residentData.value.medicalHistory.push(otherMedicalHistory.value)
    }
}

const residentData = ref({
    firstName: '',
    middleName: '',
    lastName: '',
    birthdate: '',
    status: '',
    gender: '',
    weight: '',
    height: '',
    relationshipToTheHead: '',
    educationalAttainment: '',
    email: '',
    householdNumber: '',
    religion: '',
    medicalHistory: [],
    immunization: [],
    immunizationDate: '',
    isDewormed: '',
})

const isBelowFour = ref(false)
const isBetweenSix = ref(false)

const checkAgeIfBelow4 = () => {
    const today = new Date()
    const todaysYear = today.getFullYear()
    const birthday = new Date(residentData.value.birthdate)
    const birthYear = birthday.getFullYear()

    if (todaysYear - birthYear <= 6) {
        if(todaysYear - birthYear >= 2){
            isBetweenSix.value = true;
        }else{
            isBetweenSix.value = false
        }
        if(todaysYear - birthYear <= 4){
            isBelowFour.value = true;
        }else{
            isBelowFour.value = false;
        }
    }else {
        isBelowFour.value = false;
        isBetweenSix.value = false;
    }
}

const emit = defineEmits(['closeModal'])

const closeModal = () => {
    emit('closeModal')
}

// add data
const err = ref('')
const residentRef = collection(db, 'residents')
const userRef = collection(db, 'Users')
const addingResident = ref(false)

const addResident = async () => {
    err.value = ''
    try {
        addingResident.value = true
        if(!residentData.value.householdNumber || !residentData.value.relationshipToTheHead || !residentData.value.firstName || !residentData.value.lastName || !residentData.value.gender || !residentData.value.educationalAttainment || !residentData.value.birthdate || !residentData.value.status){
            err.value = 'Fill out required fields'
            addingResident.value = false            
            return
        }
        const snapshot = await addDoc(residentRef, {
            ...residentData.value,
            addedAt: Timestamp.now()
        })  
        
        if(snapshot.empty) return $toast.error("Failed to add resident")

        if(residentData.value.email){
            const userCredential  = await createUserWithEmailAndPassword(auth, residentData.value.email, residentData.value.householdNumber)

            await updateProfile(userCredential.user, {
                displayName: residentData.value.firstName
            })

            await addDoc(userRef, {
                firstName: residentData.value.firstName,
                lastName: residentData.value.lastName,
                email: residentData.value.email,
                role: 'Residents',
                isAccepted: true,
                userId: userCredential.user.uid
            })
        }
        closeModal()
        addingResident.value = false
        $toast.success("Added resident successfully")
    } catch (error) {
        $toast.error(error.message)
    }
}
</script>