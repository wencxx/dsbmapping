<template>
    <div class="flex flex-col gap-y-10">
        <div class="self-end">
            <button class="bg-slate-800 text-white px-3 py-2 rounded-md text-lg hover:bg-slate-900 flex items-center gap-x-1" @click="isAddHousehold = true">
                <Icon icon="mdi:house-add" class="text-xl" />
                Add Household
            </button>
        </div>
        <div class="rounded-md bg-white p-10 shadow">
            <h1 class="font-semibold text-xl">Household Lists</h1>
            <div class="container mx-auto">
                <input type="text" v-model="searchTerm" placeholder="Search..." class="border float-end border-gray-300 rounded pl-2 h-8 mb-4" />

                <table class="min-w-full border border-gray-300">
                    <thead>
                        <tr class="bg-gray-100">
                          <th class="border border-gray-300 p-2">Household Number</th>
                          <th class="border border-gray-300 p-2">Address</th>
                          <th class="border border-gray-300 p-2">Head</th>
                          <th class="border border-gray-300 p-2">Added at</th>
                          <th class="border border-gray-300 p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="paginatedData.length > 0">
                        <tr
                        v-for="item in paginatedData"
                        :key="item.id"
                        class="border border-gray-300 text-center"
                        >
                          <td class="border border-gray-300 p-2">{{ item.householdNumber }}</td>
                          <td class="border border-gray-300 p-2">{{ item.address }}</td>
                          <td class="border border-gray-300 p-2">{{ item.head }}</td>
                          <td class="border border-gray-300 p-2">{{ formatDate(item.addedAt) }}</td>
                          <td>
                            <div class="flex items-center justify-center">
                                <button @click="removeHousehold(item.id, item.householdNumber)">
                                    <Icon icon="mdi:trash" class="text-red-500 text-xl" />
                                </button>
                            </div>
                          </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="5" class=" py-2 text-center">No households</td>
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
        <AddHousehold v-if="isAddHousehold" @click.self="isAddHousehold = false" @closeModal="isAddHousehold = false" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import AddHousehold from '@components/AddHousehold.vue'
import { useDataStore } from '@store'
import moment from 'moment'
import { db } from '@config/firebaseConfig.js'
import { doc, deleteDoc, query, collection, where, getDocs } from 'firebase/firestore'

const $toast = useToast()

const dataStore = useDataStore()
const households = computed(() => dataStore.households)

const removeHousehold = async (householdId, householdNumber) => {
  const householdRef = doc(db, 'households', householdId)
  const residentsCollectionRef = collection(db, 'residents')
  try {
    const q = query(residentsCollectionRef, where('householdNumber', '==', householdNumber))
    const querySnapshot = await getDocs(q)

    const deletePromises = querySnapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref))
    await Promise.all(deletePromises)

    await deleteDoc(householdRef)
    dataStore.getHouseholds()
    $toast.success('Deleted household and associated residents successfully')
  } catch (error) {
    $toast.error('Failed to delete household and residents')
  }
}

const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredData = computed(() => {
  return households.value.filter((item) =>
    item.address.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    item.head.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    item.householdNumber.toLowerCase().includes(searchTerm.value.toLowerCase())
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

// add household
const isAddHousehold = ref(false)

const formatDate = (date) => {
  const milliseconds = date.seconds * 1000 + Math.floor(date.nanoseconds / 1000000);
  return moment(milliseconds).format('lll');
}
</script>