<template>
    <div class="flex flex-col gap-y-10 h-[92dvh] overflow-auto">
        <div class="rounded-md bg-white p-10 shadow">
            <h1 class="font-semibold text-xl">Staffs Lists</h1>
            <div class="container mx-auto">
                <input type="text" v-model="searchTerm" placeholder="Search..." class="border float-end border-gray-300 rounded pl-2 h-8 mb-4" />

                <table class="min-w-full border border-gray-300">
                    <thead>
                        <tr class="bg-gray-100">
                          <th class="border w-1/5 border-gray-300 p-2">Name</th>
                          <th class="border w-2/5 border-gray-300 p-2">Email</th>
                          <th class="border w-1/5 border-gray-300 p-2">Accepted</th>
                          <th class="border w-1/5 border-gray-300 p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="paginatedData.length > 0">
                        <tr
                        v-for="staff in paginatedData"
                        :key="staff.id"
                        class="border border-gray-300 text-center"
                        >
                          <td class="border border-gray-300 p-2 capitalize">{{ staff.firstName + ' ' + staff.lastName }}</td>
                          <td class="border border-gray-300 p-2 capitalize">{{ staff.email }}</td>
                          <td class="border border-gray-300 p-2 capitalize">
                            <button class="bg-green-500 w-3/4 py-1 text-white rounded capitalize" :class="{ 'bg-red-500': !staff.isAccepted }">{{ staff.isAccepted }}</button>
                          </td>
                          <td>
                            <div class="flex items-center justify-center">
                                <button v-if="!staff.isAccepted" @click="acceptStaff(staff.id)">
                                    <Icon icon="mdi:check" class="text-green-500 text-2xl" />
                                </button>
                                <button @click="deleteStaff(staff.id)">
                                    <Icon icon="mdi:trash" class="text-red-500 text-2xl" />
                                </button>
                            </div>
                          </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="8" class="py-2 text-center">No staffs to show</td>
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
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDataStore } from '@store'
import moment from 'moment'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { db } from '../config/firebaseConfig'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'

const $toast = useToast()

const dataStore = useDataStore()

const staffs = computed(() => dataStore.staffs)

const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredData = computed(() => {
  return staffs.value.filter((item) =>
    item.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    item.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.value.toLowerCase())
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

// format date
const formatDate = (date) => {
  return moment(date).format('ll')
}

// accept staff
const acceptStaff = async (staffId) => {
  try {
    await updateDoc(doc(db, 'Users', staffId), {
      isAccepted: true
    })

    $toast.success('Accepted user successfully')
  } catch (error) {
    $toast.error('Error accepting user')
  }
}

// accept staff
const deleteStaff = async (staffId) => {
  try {
    await deleteDoc(doc(db, 'Users', staffId))

    $toast.success('Deleted user successfully')
  } catch (error) {
    $toast.error('Error deleting user')
  }
}

</script>