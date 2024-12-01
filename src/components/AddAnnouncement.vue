<template>
    <div class="absolute top-0 left-0 w-screen h-screen bg-black/55 flex items-center justify-center">
        <form @submit.prevent="addAnnouncement" class="bg-white w-fit h-fit rounded-md p-5 px-10 space-y-7">
            <h1 class="text-center text-xl">Add Announcement</h1>
            <div class="space-y-5">    
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Title</label>
                    <input type="text" class="h-10 w-72 lg:w-96 rounded border border-black pl-2" v-model="announcementData.title">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Description</label>
                    <textarea class="h-10 w-72 lg:w-96 rounded border border-black pl-2 min-h-32" v-model="announcementData.description"></textarea>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">When</label>
                    <input type="datetime-local" class="h-10 w-72 lg:w-96 rounded border border-black pl-2" v-model="announcementData.when">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label class="text-lg">Images</label>
                    <input type="file" class="h-10 w-72 lg:w-96 rounde" accept=".jpg, .jpeg, .png" multiple @change="handleImageUpload">
                </div>
                <div class="!mt-0 space-y-1">
                    <div v-for="(name, index) in fileName" :key="index" class="cursor-pointer flex items-center gap-x-1 group">
                        <Icon icon="material-symbols-light:image-outline" class="text-xl" />
                        <p>{{ name }}</p>
                        <Icon icon="mdi:close" class="text-lg ml-auto hidden group-hover:block" @click="removeImage(index)" />
                    </div>
                </div>
                <div class="col-span-3 flex justify-end items-center gap-x-3 mt-5">
                    <button class="w-2/6 border py-1 rounded bg-red-500 text-white hover:bg-red-600" type="button" @click="closeModal">Back</button>
                    <button v-if="!addingAnnouncement" class="w-2/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600">Add</button>
                    <button v-else class="w-2/6 border py-1 rounded bg-green-500 text-white hover:bg-green-600 animate-pulse" disabled>Adding</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, defineEmits, ref } from 'vue'
import { useDataStore } from '@store'
import { db, storage } from '@config/firebaseConfig.js'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import  emailjs from 'emailjs-com'

const $toast = useToast()

const dataStore = useDataStore()

const residents = computed(() => dataStore.residents)

const announcementData = ref({
    title: '',
    description: '',
    when: ''
})

const images = ref([])

const emit = defineEmits(['closeModal'])

const closeModal = () => {
    emit('closeModal')
}

const fileName = ref([])

const handleImageUpload = () => {
    const files = event.target.files

    Array.from(files).forEach(file => {
        images.value.push(file)
        fileName.value.push(file.name)
    })
}

const removeImage = (index) => {
    images.value.splice(index, 1)
    fileName.value.splice(index, 1)
}

// add data
const announcementRef = collection(db, 'announcements')
const addingAnnouncement = ref(false)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const addAnnouncement = async () => {
    try {
        addingAnnouncement.value = true;
        const imageUrls = [];

        for (const image of images.value) {
            const storageRefInstance = storageRef(storage, `announcements/${image.name}`);
            const snapshot = await uploadBytes(storageRefInstance, image);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            imageUrls.push(downloadUrl);
        }

        const snapshot = await addDoc(announcementRef, {
            ...announcementData.value,
            images: imageUrls,
            addedAt: Timestamp.now(),
        });

        if (snapshot.empty) return $toast.error("Failed to add announcement");

        closeModal();
        addingAnnouncement.value = false;
        
        fileName.value = [];
        images.value = [];
        $toast.success("Added announcement successfully");

        for (const res of residents.value) {
            const templateParams = {
                name: res.firstName,
                eventName: announcementData.value.title,
                to: res.email,
                from: 'Rural Health Unit',
            };

            try {
                await emailjs.send(
                    'service_3k2ha2s',
                    'template_2apc7wh',
                    templateParams,
                    'yqf3r_scJmWURJ-Ju'
                );
                console.log(`Email sent to ${res.email}`);
            } catch (error) {
                console.error(`Failed to send email to ${res.email}:`, error);
            }

            await delay(1000); 
        }

        announcementData.value = {
            title: '',
            description: '',
            when: '',
        };
    } catch (error) {
        $toast.error(error.message);
    }
};

</script>