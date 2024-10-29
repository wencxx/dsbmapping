<template>
    <div class="flex flex-col gap-y-10">
        <div class="self-end">
            <button class="bg-slate-800 text-white px-3 py-2 rounded-md text-lg hover:bg-slate-900 flex items-center gap-x-1" @click="addResident">
                <Icon icon="ic:sharp-person-add" class="text-xl" />
                Add Announcement
            </button>
        </div>
        <div class="rounded-md bg-white p-10 shadow">
            <h1 class="font-semibold text-xl">Annoucements</h1>
            <div class="container mx-auto">
                <input type="text" v-model="searchTerm" placeholder="Search..." class="border float-end border-gray-300 rounded pl-2 h-8 mb-4" />

                <table class="min-w-full border border-gray-300">
                    <thead>
                        <tr class="bg-gray-100">
                          <th class="border border-gray-300 p-2">Title</th>
                          <th class="border border-gray-300 p-2">Description</th>
                          <th class="border border-gray-300 p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="paginatedData.length > 0">
                        <tr
                        v-for="announcement in paginatedData"
                        :key="announcement.id"
                        class="border border-gray-300 text-center"
                        >
                          <td class="border border-gray-300 p-2">{{ announcement.title }}</td>
                          <td class="border border-gray-300 p-2">{{ announcement.description }}</td>
                          <td class="border border-gray-300 p-2">{{ formatDate(announcement.birthdate) }}</td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="8" class="py-2 text-center">No announcements</td>
                        </tr>
                    </tbody>
                </table>

                <div class="flex justify-end items-center mt-4">
                    <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-300 text-white w-6 h-7  flex items-center justify-center">
                        <Icon icon="weui:arrow-outlined" class="rotate-180" />
                    </button>
                    <span class="bg-blue-500 w-6 h-7 text-white text-center">{{ currentPage }}</span>
                    <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-gray-300 text-white w-6 h-7 flex items-center justify-center">
                        <Icon icon="weui:arrow-outlined" />
                    </button>
                </div>
            </div>
        </div>

        <!-- add resident form component -->
        <AddAnnouncement v-if="isAddAnnouncement" @click.self="isAddAnnouncement = false" @closeModal="isAddAnnouncement = false" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AddAnnouncement from '@components/AddAnnouncement.vue'
import { useDataStore } from '@store'
import moment from 'moment'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { db } from '@config/firebaseConfig.js'
import { doc, deleteDoc } from 'firebase/firestore'

const $toast = useToast()

const dataStore = useDataStore()

const announcements = computed(() => dataStore.announcements)

// remove resident
const removeResident = async (residentId) => {
  const docRef = doc(db, 'residents', residentId)
  try {
    await deleteDoc(docRef)
    $toast.success('Deleted resident successfully')
  } catch (error) {
    $toast.error('Failed to delete resident')
  }
}

const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredData = computed(() => {
  return announcements.value.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.value.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};


// add resident
const isAddAnnouncement = ref(false)
const addResident = () => {
    isAddAnnouncement.value = true
}

// format date
const formatDate = (date) => {
  return moment(date).format('ll')
}

</script>