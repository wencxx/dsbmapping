<template>
    <div class="flex flex-col gap-y-10  h-[92dvh] overflow-auto">
        <div class="self-end">
            <button class="bg-slate-800 text-white px-3 py-2 rounded-md text-lg hover:bg-slate-900 flex items-center gap-x-1" @click="addAnnouncement">
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
                          <th class="border border-gray-300 p-2 w-1/5">Title</th>
                          <th class="border border-gray-300 p-2 w-2/5">Description</th>
                          <th class="border border-gray-300 p-2 w-1/5">Date added</th>
                          <th class="border border-gray-300 p-2 w-1/5">Action</th>
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
                          <td class="border border-gray-300 p-2">
                            <div class="flex items-center justify-center gap-x-2">
                              <Icon icon="mdi:pencil" class="text-green-500 text-xl" @click="updateAnnouncement(announcement)" />
                              <Icon icon="mdi:trash" class="text-red-500 text-xl" @click="showDeletModal(announcement.id)" />
                            </div>
                          </td>
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

        <!-- add announvement form component -->
        <AddAnnouncement v-if="isAddAnnouncement" @click.self="isAddAnnouncement = false" @closeModal="isAddAnnouncement = false" />
        <UpdateAnnouncement v-if="isUpdateAnnouncement" @click.self="isUpdateAnnouncement = false" @closeModal="isUpdateAnnouncement = false" :announcementData="announcementData" />

        <!-- modal for deletion -->
        <div v-if="willDelete" @click.self="willDelete = false" class="fixed top-0 left-0 w-screen h-screen bg-black/10 flex items-center justify-center">
            <div class="bg-white rounded-xl shadow p-10 flex flex-col items-center justify-center">
              <Icon icon="mdi:warning" class="text-orange-500 text-[100px]" />
              <h1 class="font-medium text-xl">Proceed with the deletion?</h1>
              <div class="mt-5 w-full flex justify-center gap-x-5">
                  <button class="w-1/3 bg-green-500 text-white rounded" @click="willDelete = false">No</button>
                  <button class="w-1/3 bg-red-500 text-white rounded" @click="deleteAnnouncement">Yes</button>
              </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AddAnnouncement from '@components/AddAnnouncement.vue'
import UpdateAnnouncement from '@components/UpdateAnnouncement.vue'
import { useDataStore } from '@store'
import moment from 'moment'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { db } from '@config/firebaseConfig.js'
import { doc, deleteDoc } from 'firebase/firestore'

const $toast = useToast()

const dataStore = useDataStore()

const announcements = computed(() => dataStore.announcements)

// remove announcement
const willDelete = ref(false)
const announcementToBeDeleted = ref('')

const showDeletModal = (id) => {
  willDelete.value = true
  announcementToBeDeleted.value = id
}
const deleteAnnouncement = async () => {
  const docRef = doc(db, 'announcements', announcementToBeDeleted.value)
  try {
    await deleteDoc(docRef)
    willDelete.value = false
    $toast.success('Deleted announcement successfully')
  } catch (error) {
    $toast.error('Failed to delete announcement')
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

// add annouuncement
const isAddAnnouncement = ref(false)
const addAnnouncement = () => {
    isAddAnnouncement.value = true
}

// update announcement
const isUpdateAnnouncement = ref(false)
const announcementData = ref({})

const updateAnnouncement = (data) => {
  isUpdateAnnouncement.value = true
  announcementData.value = data
}

// format date
const formatDate = (date) => {
  return moment(date).format('ll')
}

</script>