<template>
    <div class="absolute top-0 left-0 w-screen h-screen bg-black/55 flex items-center justify-center">
        <form @submit.prevent="addHousehold" class="bg-white w-1/2 h-fit rounded-md p-5 space-y-7">
            <h1 class="text-center text-xl">Household Information Form</h1>
            <div class="grid grid-cols-3 gap-5">    
                <h1 class="col-span-3 font-semibold text-lg">Household Info</h1>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Household Number</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="householdData.householdNumber">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Address</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="householdData.address">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Select on map</label>
                    <button type="button" class="bg-blue-600 h-10 rounded text-white flex items-center justify-center gap-x-2" @click="showMap = true">
                        <Icon icon="mdi:location" />
                        Select on map
                    </button>
                </div>
                <h1 class="col-span-3 font-semibold text-lg">Head Info</h1>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Firstname</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="headData.firstName">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Middlename</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="headData.middleName">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Lastname</label>
                    <input type="text" class="h-10 rounded border border-black pl-2" v-model="headData.lastName">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Birthdate</label>
                    <input type="date" class="h-10 rounded border border-black pl-2"  v-model="headData.birthdate">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Status</label>
                    <select class="h-10 rounded border border-black pl-2"  v-model="headData.status">
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
                    <select class="h-10 rounded border border-black pl-2"  v-model="headData.gender">
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Educational Attainment</label>
                    <select class="h-10 rounded border border-black pl-2"  v-model="headData.educationalAttainment">
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
                    <label class="text-lg">Religion</label>
                    <select class="h-10 rounded border border-black pl-2" v-model="headData.religion">
                        <option value="">Select Religion</option>
                        <option>Roman Catholic</option>
                        <option>Baptist</option>
                        <option>Seventh Day Adventist</option>
                    </select>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Email</label>
                    <input type="email" class="h-10 rounded border border-black pl-2" v-model="headData.email">
                </div>
                <h1 class="col-span-3 font-semibold text-lg">Medical History</h1>
                <div class="col-span-3 grid grid-cols-5">
                    <div class="flex items-center gap-x-2">
                        <p>Hypertension</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Hypertension" v-model="headData.medicalHistory">
                    </div>
                    <div class="flex items-center gap-x-2">
                        <p>Diabetes</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Diabetes" v-model="headData.medicalHistory">
                    </div>
                    <div class="flex items-center gap-x-2">
                        <p>Cancer</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Cancer" v-model="headData.medicalHistory">
                    </div>
                    <div class="flex items-center gap-x-2">
                        <p>Tuberculosis</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Tuberculosis" v-model="headData.medicalHistory">
                    </div>
                     <div class="flex items-center justify-center gap-x-2">
                        <p>Others</p>
                        <input type="checkbox" class="border w-4 aspect-square" @change="others = !others">
                    </div>
                    <div v-if="others" class="flex items-center gap-x-2 col-span-2">
                        <input type="text" class="border w-full h-8 pl-2" placeholder="Enter other comorbidities" v-model="otherMedicalHistory" @change="inputOtherMedicalHistory">
                    </div>
                </div>
            </div>
            <div class="col-span-3 flex justify-end items-center gap-x-3 mt-5">
                <button class="!w-2/6 xl:w-1/6 border py-1 rounded bg-red-500 text-white hover:bg-red-600" type="button" @click="closeModal">Back</button>
                <button v-if="!addingHousehold" class="!w-2/6 xl:w-1/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600">Add Household</button>
                <button v-else class="!w-2/6 xl:w-1/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600">Adding Household</button>
            </div>
        </form>

        <div v-if="showMap" @click.self="showMap = false" class="absolute top-0 left-0 bg-black/30 w-screen h-screen flex items-center justify-center">
            <div class="bg-white w-1/2 h-[75dvh] rounded-md p-5 space-y-7">
                 <l-map class="!w-full !h-[90%]" ref="map" v-model:zoom="zoom" :center="[10.5555, 123.2683]" @click="addMarker">
                    <l-tile-layer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        layer-type="base"
                        name="OpenStreetMap"
                    ></l-tile-layer>
                    <l-marker v-if="markers" :lat-lng="markers"></l-marker>
                </l-map>
                <div class="h-[5%] flex gap-x-2 items-center justify-end">
                    {{ householdData.address }}
                    <button class="border border-green-500 text-green-500 w-1/6 py-1 rounded" @click="showMap = false">Cancel</button>
                    <button class="bg-green-500 text-white w-1/6 py-1 rounded" @click="showMap = false">Select</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineEmits, ref } from 'vue'
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet'
import { db } from '@config/firebaseConfig.js'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const zoom = ref(13);

const emit = defineEmits(['closeModal'])

const closeModal = () => {
    emit('closeModal')
}

const others = ref(false)

const otherMedicalHistory = ref('')

const inputOtherMedicalHistory = () => {
    if(otherMedicalHistory.value){
        headData.value.medicalHistory.push(otherMedicalHistory.value)
    }
}

const householdData = ref({
    householdNumber: '',
    address: '',
    lat: '',
    lng: '',
})

const headData = ref({
    firstName: '',
    middleName: '',
    lastName: '',
    birthdate: '',
    status: '',
    gender: '',
    educationalAttainment: '',
    householdNumber: computed(() => householdData.value.householdNumber),
    religion: '',
    email: '',
    medicalHistory: []
})

// select on map
const showMap = ref(false)
const markers = ref(null);

const addMarker = async (event) => {
    const { lat, lng } = event.latlng;
    markers.value = [lat, lng]

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        const data = await response.json()
        if (data && data.display_name) {
            householdData.value.address = data.display_name
            householdData.value.lat = lat
            householdData.value.lng = lng
        }

    } catch (error) {
        console.error('Error fetching address:', error);
    }
}

const householdRef = collection(db, 'households')
const residentRef = collection(db, 'residents')

const addingHousehold = ref(false)

// add household
const addHousehold = async () => {
    try {

        if(Object.values(householdData.value).some(field => !field) || Object.values(headData.value).some(field => !field)) return $toast.error('Fill out all fields')

        addingHousehold.value = true
        const snapshot = await addDoc(residentRef, {
            ...headData.value,
            addedAt: Timestamp.now()
        })

        const household = await addDoc(householdRef, {
            ...householdData.value,
            headId: snapshot.id,
            head: `${headData.value.firstName} ${headData.value.middleName} ${headData.value.lastName}`,
            addedAt: Timestamp.now()
        })

        if(!household.empty){
            closeModal()
            $toast.success('Household added successfully')
        }

        addingHousehold.value = false
    } catch (error) {
        console.log(error.message)
        $toast.error('Failed to add household')
    }
}


</script>