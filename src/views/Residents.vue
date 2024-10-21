<template>
    <div class="flex flex-col gap-y-10">
        <div class="self-end">
            <button class="bg-slate-800 text-white px-3 py-2 rounded-md text-lg hover:bg-slate-900 flex items-center gap-x-1" @click="addResident">
                <Icon icon="ic:sharp-person-add" class="text-xl" />
                Add Resident
            </button>
        </div>
        <div class="rounded-md bg-white p-10 shadow">
            <h1 class="font-semibold text-xl">Resident Lists</h1>
            <div class="container mx-auto">
                <input type="text" v-model="searchTerm" placeholder="Search..." class="border float-end border-gray-300 rounded pl-2 h-8 mb-4" />

                <table class="min-w-full border border-gray-300">
                    <thead>
                        <tr class="bg-gray-100">
                          <th class="border border-gray-300 p-2">Household Number</th>
                          <th class="border border-gray-300 p-2">Name</th>
                          <th class="border border-gray-300 p-2">Birthdate</th>
                          <th class="border border-gray-300 p-2">Gender</th>
                          <th class="border border-gray-300 p-2">Medical History</th>
                          <th class="border border-gray-300 p-2">Status</th>
                          <th class="border border-gray-300 p-2">Religion</th>
                          <th class="border border-gray-300 p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="paginatedData.length > 0">
                        <tr
                        v-for="resident in paginatedData"
                        :key="resident.id"
                        class="border border-gray-300 text-center"
                        >
                          <td class="border border-gray-300 p-2">{{ resident.householdNumber }}</td>
                          <td class="border border-gray-300 p-2">{{ resident.firstName }}</td>
                          <td class="border border-gray-300 p-2">{{ formatDate(resident.birthdate) }}</td>
                          <td class="border border-gray-300 p-2">{{ resident.gender }}</td>
                          <td class="border border-gray-300 p-2">
                            {{ resident.medicalHistory.join(', ') }}
                          </td>
                          <td class="border border-gray-300 p-2">{{ resident.status }}</td>
                          <td class="border border-gray-300 p-2">{{ resident.religion }}</td>
                          <td>
                            <div class="flex items-center justify-center">
                                <button @click="removeResident(resident.id)">
                                    <Icon icon="mdi:trash" class="text-red-500 text-xl" />
                                </button>
                            </div>
                          </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="8" class="py-2 text-center">No residents</td>
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
        <AddResident v-if="isAddResident" @click.self="isAddResident = false" @closeModal="isAddResident = false" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AddResident from '@components/AddResident.vue'
import { useDataStore } from '@store'
import moment from 'moment'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { db } from '@config/firebaseConfig.js'
import { doc, deleteDoc } from 'firebase/firestore'

const $toast = useToast()

const dataStore = useDataStore()

const residents = computed(() => dataStore.residents)

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
  return residents.value.filter((item) =>
    item.firstName.toLowerCase().includes(searchTerm.value.toLowerCase())
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
const isAddResident = ref(false)
const addResident = () => {
    isAddResident.value = true
}

// format date
const formatDate = (date) => {
  return moment(date).format('ll')
}

</script>