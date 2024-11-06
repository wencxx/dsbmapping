<template>
    <div class="absolute top-0 left-0 w-screen h-screen bg-black/55 flex items-center justify-center">
        <form @submit.prevent="updateHousehold" class="bg-white w-1/2 h-fit rounded-md p-5 space-y-7">
            <h1 class="text-center text-xl">Update Household</h1>
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
                    <div class="flex items-center gap-x-2">
                        <p>Others</p>
                        <input type="checkbox" class="border w-4 aspect-square" value="Others" v-model="headData.medicalHistory">
                    </div>
                </div>
            </div>
            <div class="col-span-3 flex justify-end items-center gap-x-3 mt-5">
                <button class="!w-2/6 xl:w-1/6 border py-1 rounded bg-red-500 text-white hover:bg-red-600" type="button" @click="closeModal">Back</button>
                <button v-if="!addingHousehold" class="!w-2/6 xl:w-1/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600">Update Household</button>
                <button v-else class="!w-2/6 xl:w-1/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600">Updating Household</button>
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
import { computed, defineEmits, ref, defineProps, onMounted, watch } from 'vue'
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet'
import { db } from '@config/firebaseConfig.js'
import { updateDoc, doc, Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const zoom = ref(13);

const emit = defineEmits(['closeModal'])

const closeModal = () => {
    emit('closeModal')
}
const prop = defineProps({
    householdData: Object
})

const householdData = ref({
    householdNumber: prop.householdData.householdNumber,
    address: prop.householdData.address,
    lat: prop.householdData.lat,
    lng: prop.householdData.lng,
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
    medicalHistory: ''
})

onMounted(() => {
    watch(prop, (newData) => {
        if(newData) {
            headData.value.firstName = prop.householdData.firstName
            headData.value.middleName = prop.householdData.middleName
            headData.value.lastName = prop.householdData.lastName
            headData.value.birthdate = prop.householdData.birthdate
            headData.value.status = prop.householdData.status
            headData.value.gender = prop.householdData.gender
            headData.value.educationalAttainment = prop.householdData.educationalAttainment
            headData.value.religion = prop.householdData.religion
            headData.value.medicalHistory = prop.householdData.medicalHistory
            householdId.value = prop.householdData.id
            headId.value = prop.householdData.headId
        }
    })
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

const householdId = ref('')
const headId = ref('')

const addingHousehold = ref(false)

// add household
const updateHousehold = async () => {
    const householdRef = doc(db, 'households', householdId.value)
    const residentRef = doc(db, 'residents', headId.value)
    try {

        addingHousehold.value = true
        await updateDoc(residentRef, {
            ...headData.value,
        })

        await updateDoc(householdRef, {
            ...householdData.value,
        })

        closeModal()
        $toast.success('Household updated successfully')

        addingHousehold.value = false
    } catch (error) {
        console.log(error.message)
        $toast.error('Failed to update household')
    }
}


</script>