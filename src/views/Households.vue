<template>
    <div class="flex flex-col gap-y-10  h-[92dvh] overflow-auto">
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
                                <button @click="updateHousehold(item)">
                                    <Icon icon="mdi:pencil" class="text-green-500 text-xl" />
                                </button>
                                <button @click="showDeleteModal(item.id, item.householdNumber)">
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
        <UpdateHousehold v-if="isUpdateHousehold" @click.self="isUpdateHousehold = false" @closeModal="isUpdateHousehold = false" :householdData="householdData" />

        <!-- modal for deletion -->
        <div v-if="willDelete" @click.self="willDelete = false" class="fixed top-0 left-0 w-screen h-screen bg-black/10 flex items-center justify-center">
            <div class="bg-white rounded-xl shadow p-10 flex flex-col items-center justify-center">
              <Icon icon="mdi:warning" class="text-orange-500 text-[100px]" />
              <h1 class="font-medium text-xl">Proceed with the deletion?</h1>
              <div class="mt-5 w-full flex justify-center gap-x-5">
                  <button class="w-1/3 bg-green-500 text-white rounded" @click="willDelete = false">No</button>
                  <button class="w-1/3 bg-red-500 text-white rounded" @click="removeHousehold">Yes</button>
              </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import AddHousehold from '@components/AddHousehold.vue'
import UpdateHousehold from '@components/UpdateHousehold.vue'
import { useDataStore } from '@store'
import moment from 'moment'
import { db } from '@config/firebaseConfig.js'
import { doc, deleteDoc, query, collection, where, getDocs, getDoc } from 'firebase/firestore'

const $toast = useToast()

const dataStore = useDataStore()
const households = computed(() => dataStore.households)

// remove household
const willDelete = ref(false)
const householdToBeDeleted = ref('')
const householdNumberToBeDeleted = ref('')

const showDeleteModal = (householdId, householdNumber) => {
  willDelete.value = true
  householdToBeDeleted.value = householdId
  householdNumberToBeDeleted.value = householdNumber
}

const removeHousehold = async () => {
  const householdRef = doc(db, 'households', householdToBeDeleted.value)
  const residentsCollectionRef = collection(db, 'residents')
  try {
    const q = query(residentsCollectionRef, where('householdNumber', '==', householdNumberToBeDeleted.value))
    const querySnapshot = await getDocs(q)

    const deletePromises = querySnapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref))
    await Promise.all(deletePromises)

    willDelete.value = false

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
const isUpdateHousehold = ref(false)

const householdData = ref({})

const updateHousehold = async (data) => {
  isUpdateHousehold.value = true
  householdData.value = data

  const headRef = doc(db, 'residents', data.headId)
  try {
      const snapshot = await getDoc(headRef)
      householdData.value = {
        ...data,
        ...snapshot.data()
      }
  } catch (error) {
    $toast.error('Failed fetching household head ')
  }
}


const formatDate = (date) => {
  const milliseconds = date.seconds * 1000 + Math.floor(date.nanoseconds / 1000000);
  return moment(milliseconds).format('lll');
}
</script>