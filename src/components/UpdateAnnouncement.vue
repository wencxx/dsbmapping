<template>
    <div class="absolute top-0 left-0 w-screen h-screen bg-black/55 flex items-center justify-center">
        <form @submit.prevent="updateAnnouncement" class="bg-white w-fit h-fit rounded-md p-5 px-10 space-y-7">
            <h1 class="text-center text-xl">Update Announcement</h1>
            <div class="space-y-5">    
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Title</label>
                    <input type="text" class="h-10 w-72 lg:w-96 rounded border border-black pl-2" v-model="announcementData.title">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Description</label>
                    <textarea class="h-10 w-72 lg:w-96 rounded border border-black pl-2 min-h-32" v-model="announcementData.description"></textarea>
                </div>
                <div class="col-span-3 flex justify-end items-center gap-x-3 mt-5">
                    <button class="w-2/6 border py-1 rounded bg-red-500 text-white hover:bg-red-600" type="button" @click="closeModal">Back</button>
                    <button v-if="!addingAnnouncement" class="w-2/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600">Update</button>
                    <button v-else class="w-2/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600 animate-pulse" disabled>Updating</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import { useDataStore } from '@store'
import { db, storage } from '@config/firebaseConfig.js'
import { doc, updateDoc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const dataStore = useDataStore()

const emit = defineEmits(['closeModal'])
const prop = defineProps({
    announcementData: Object
})

const closeModal = () => {
    emit('closeModal')
}

const announcementData = ref({
    title: prop.announcementData.title,
    description: prop.announcementData.description,
})


// add data
const announcementRef = doc(db, 'announcements', prop.announcementData.id)
const addingAnnouncement = ref(false)

const updateAnnouncement = async () => {
    try {
        addingAnnouncement.value = true

        await updateDoc(announcementRef, {
            ...announcementData.value,
        })  
        
        closeModal()
        
        addingAnnouncement.value = false
        announcementData.value = {
            title: '',
            description: '',
        }
        $toast.success("Updated announcement successfully")
    } catch (error) {
        $toast.error(error.message)
    }
}
</script>