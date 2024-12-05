<template>
    <div class="overflow-auto">
        <div class="flex items-center flex-col gap-y-10">
            <div v-for="(announcement, index) in announcements" :key="index" class="w-full max-w-3xl flex flex-col gap-y-5 bg-white p-10 rounded-md shadow">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-x-2">
                        <img src="../assets/logo.png" alt="logo" class="w-10 aspect-square">
                        <h1 class="text-xl font-semibold">Rural Health Unit</h1>
                    </div>
                    <p class="text-sm">{{ formatDate(announcement.addedAt) }}</p>
                </div>
                <div class="flex flex-col gap-y-5">
                    <h1 class="font-medium capitalize">{{ announcement.title }}</h1>
                    <p class="">{{ announcement.description }}</p>
                </div>
                <div class="grid gap-2" :class="{ 'grid-cols-2': announcement.images?.length > 1 }">
                    <img v-for="image in announcement.images" :key="image" :src="image" alt="post image" class="rounded aspect-square object-cover">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { db } from '../config/firebaseConfig'
import { onSnapshot, collection } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import moment from 'moment'

const $toast = useToast()

const announcements = ref([])

const isFirstLoad = ref(true)

const getAnnouncement = () => {
    try {
        onSnapshot(
            collection(db, 'announcements'),
            (snapshot) => {
                announcements.value = []
                snapshot.docs.forEach(doc => {
                    announcements.value.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                if (!isFirstLoad.value) {
                    $toast.info('New announcement added', {
                        position: 'top'
                    });
                }
                
                isFirstLoad.value = false;
            }
        )
    } catch (error) {
        console.log(error)
        $toast.error(error.message)
    }
}

const formatDate = (FirebaseTimestamp) => {
    const date = new Date(FirebaseTimestamp.seconds * 1000)

    return moment(date).format('lll')
}

onMounted(() => {
    getAnnouncement()
})
</script>