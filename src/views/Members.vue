<template>
    <div class="flex flex-col gap-y-10 h-[92dvh] overflow-auto">
        <div class="rounded-md bg-white p-10 shadow">
            <h1 class="font-semibold text-xl">Members Lists</h1>
            <div class="container mx-auto">
                <input type="text" v-model="searchTerm" placeholder="Search..." class="border float-end border-gray-300 rounded pl-2 h-8 mb-4" />

                <div class="min-w-full overflow-x-auto">
                  <table class="w-[180%] border border-gray-300">
                      <thead>
                          <tr class="bg-gray-100">
                            <th class="border border-gray-300 p-2">Household Number</th>
                            <th class="border border-gray-300 p-2">Name</th>
                            <th class="border border-gray-300 p-2">Birthdate</th>
                            <th class="border border-gray-300 p-2">Gender</th>
                            <th class="border border-gray-300 p-2">Medical History</th>
                            <th class="border border-gray-300 p-2">Status</th>
                            <th class="border border-gray-300 p-2">Religion</th>
                            <th class="border border-gray-300 p-2">Immunize</th>
                            <th class="border border-gray-300 p-2">Dewormed</th>
                            <th class="border border-gray-300 p-2">Pregnant</th>
                            <th class="border border-gray-300 p-2">Prenatal</th>
                            <th class="border border-gray-300 p-2">Check-up date</th>
                            <th class="border border-gray-300 p-2">Follow-up date</th>
                            <th class="border border-gray-300 p-2">Family Planning</th>
                            <th class="border border-gray-300 p-2">Vaccines</th>
                            <th class="border border-gray-300 p-2">Relationship to Head</th>
                          </tr>
                      </thead>
                      <tbody v-if="paginatedData.length > 0">
                          <tr
                          v-for="resident in paginatedData"
                          :key="resident.id"
                          class="border border-gray-300 text-center"
                          >
                            <td class="border border-gray-300 p-2">{{ resident.householdNumber }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.firstName }} {{ resident.middleName }} {{ resident.lastName }}</td>
                            <td class="border border-gray-300 p-2">{{ formatDate(resident.birthdate) }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.gender }}</td>
                            <td v-if="resident.medicalHistory.length" class="border border-gray-300 p-2">
                              {{ resident.medicalHistory.join(', ') }}
                            </td>
                            <td v-else class="border border-gray-300 p-2">--</td>
                            <td class="border border-gray-300 p-2">{{ resident.status }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.religion }}</td>
                            <td v-if="resident.immunization?.length" class="border border-gray-300 p-2">
                              {{ resident.immunization.join(', ') }}
                            </td>
                            <td v-else class="border border-gray-300 p-2">--</td>
                            <td class="border border-gray-300 p-2">{{ typeof(resident.isDewormed) === 'string' || typeof(resident.isDewormed) === 'undefined' ? '--' : resident.isDewormed ? 'Yes' : 'No' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.isPregnant || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.prenatal || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ formatDate(resident.preCheckupDate) || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ formatDate(resident.followUpDate) || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.familyPlanning || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.vaccines?.join(', ') || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.relationshipToTheHead || 'Head' }}</td>
                          </tr>
                      </tbody>
                      <tbody v-else>
                          <tr>
                              <td colspan="17" class="py-2 text-center">No residents</td>
                          </tr>
                      </tbody>
                  </table>
                </div>

                <div class="flex justify-end items-center mt-4">
                    <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-300 text-white w-6 h-7  flex items-center justify-center">
                        <Icon icon="weui:arrow-outlined" class="rotate-180" />
                    </button>
                    <span class="bg-gray-300 w-6 h-7 text-white text-center">{{ currentPage -1 }}</span>
                    <span class="bg-blue-500 w-6 h-7 text-white text-center">{{ currentPage }}</span>
                    <span class="bg-gray-300 w-6 h-7 text-white text-center">{{ currentPage + 1 }}</span>
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
import { useDataStore, useAuthStore } from '@store'
import moment from 'moment'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { db } from '@config/firebaseConfig.js'

const $toast = useToast()

const dataStore = useDataStore()

const residents = computed(() => dataStore.residents)
const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 15;

const filteredData = computed(() => {
  return residents.value.filter((item) =>
    item.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) && item.householdNumber === currentUser.value?.householdNumber && item.email !== currentUser.value?.email 
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage).sort((a,b) => (a.householdNumber > b.householdNumber) ? 1 : ((b.householdNumber > a.householdNumber) ? -1 : 0));
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
  if(date) return moment(date).format('ll')

  return
}
</script>