<template>
    <div class="flex flex-col gap-y-10 h-[92dvh] overflow-auto">
        <div class="self-end">
            <button  v-if="role !== 'Midwife'" class="bg-slate-800 text-white px-3 py-2 rounded-md text-lg hover:bg-slate-900 flex items-center gap-x-1" @click="addResident">
                <Icon icon="ic:sharp-person-add" class="text-xl" />
                Add Resident
            </button>
        </div>
        <div class="rounded-md bg-white p-10 shadow">
            <h1 class="font-semibold text-xl">Resident Lists</h1>
            <div class="container mx-auto">
                <input type="text" v-model="searchTerm" placeholder="Search..." class="border float-end border-gray-300 rounded pl-2 h-8 mb-4" />

                <div class="min-w-full overflow-x-auto">
                  <table class="w-[190%] border border-gray-300">
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
                            <th class="border border-gray-300 p-2">Date Taken</th>
                            <th class="border border-gray-300 p-2">Follow-up Date</th>
                            <th class="border border-gray-300 p-2">Dewormed</th>
                            <th class="border border-gray-300 p-2">Pregnant</th>
                            <th class="border border-gray-300 p-2">Prenatal</th>
                            <th class="border border-gray-300 p-2">Check-up date</th>
                            <th class="border border-gray-300 p-2">Follow-up date</th>
                            <th class="border border-gray-300 p-2">Family Planning</th>
                            <th class="border border-gray-300 p-2">Vaccines</th>
                            <th class="border border-gray-300 p-2">Relationship to Head</th>
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
                            <td class="border border-gray-300 p-2">
                              <div>
                                <p v-if="resident.bcgDate">BCG: {{ resident.bcgDate }}</p>
                                <p v-if="resident.hepaDate">HEPA B: {{ resident.hepaDate }}</p>
                                <p v-if="resident.dptDate">DPT-Hepa B-HiB: {{ resident.dptDate }}</p>
                                <p v-if="resident.opvDate">OPV: {{ resident.opvDate }}</p>
                                <p v-if="resident.ipvDate">IPV: {{ resident.ipvDate }}</p>
                                <p v-if="resident.pcvDate">PCV: {{ resident.pcvDate }}</p>
                                <p v-if="resident.mmrDate">MMR: {{ resident.mmrDate }}</p>
                              </div>
                            </td>
                            <td class="border border-gray-300 p-2">
                              <div>
                                <p v-if="resident.bcgFollowup">BCG: {{ resident.bcgFollowup }}</p>
                                <p v-if="resident.hepaFollowup">HEPA B: {{ resident.hepaFollowup }}</p>
                                <p v-if="resident.dptFollowup">DPT-Hepa B-HiB: {{ resident.dptFollowup }}</p>
                                <p v-if="resident.opvFollowup">OPV: {{ resident.opvFollowup }}</p>
                                <p v-if="resident.ipvFollowup">IPV: {{ resident.ipvFollowup }}</p>
                                <p v-if="resident.pcvFollowup">PCV: {{ resident.pcvFollowup }}</p>
                                <p v-if="resident.mmrFollowup">MMR: {{ resident.mmrFollowup }}</p>
                              </div>
                            </td>
                            <td class="border border-gray-300 p-2">{{ typeof(resident.isDewormed) === 'string' || typeof(resident.isDewormed) === 'undefined' ? '--' : resident.isDewormed ? 'Yes' : 'No' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.isPregnant || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.prenatal || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ formatDate(resident.preCheckupDate) || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ formatDate(resident.followUpDate) || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.familyPlanning || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.vaccines?.join(', ') || '--' }}</td>
                            <td class="border border-gray-300 p-2">{{ resident.relationshipToTheHead || 'Head' }}</td>
                            <td>
                              <div v-if="role === 'Admin' || role === 'Staff'" class="flex items-center justify-center">
                                  <button @click="updateResident(resident)">
                                      <Icon icon="mdi:pencil" class="text-green-500 text-xl" />
                                  </button>
                                  <button @click="showDeleteModal(resident.id)">
                                      <Icon icon="mdi:trash" class="text-red-500 text-xl" />
                                  </button>
                              </div>
                              <div v-if="role === 'Midwife'" class="flex items-center justify-center">
                                  <button @click="showEditModal(resident)">
                                      <Icon icon="mdi:pencil" class="text-green-500 text-xl" />
                                  </button>
                              </div>
                            </td>
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

        <!-- add resident form component -->
        <AddResident v-if="isAddResident" @click.self="isAddResident = false" @closeModal="isAddResident = false" />
        <UpdateResident v-if="isUpdateResident" @click.self="isUpdateResident = false" @closeModal="isUpdateResident = false" :residentData="residentData" />

        <!-- modal for deletion -->
        <div v-if="willDelete" @click.self="willDelete = false" class="fixed top-0 left-0 w-screen h-screen bg-black/10 flex items-center justify-center">
            <div class="bg-white rounded-xl shadow p-10 flex flex-col items-center justify-center">
              <Icon icon="mdi:warning" class="text-orange-500 text-[100px]" />
              <h1 class="font-medium text-xl">Proceed with the deletion?</h1>
              <div class="mt-5 w-full flex justify-center gap-x-5">
                  <button class="w-1/3 bg-green-500 text-white rounded" @click="willDelete = false">No</button>
                  <button class="w-1/3 bg-red-500 text-white rounded" @click="removeResident">Yes</button>
              </div>
            </div>
        </div>

        <!-- edit medical for midwife -->
        <staffEditMedical v-if="showModal" :residentData="residentDataToEdit" @closeModal="showModal = false" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AddResident from '@components/AddResident.vue'
import UpdateResident from '@components/UpdateResident.vue'
import staffEditMedical from '../components/staffEditMedical.vue';
import { useDataStore, useAuthStore } from '@store'
import moment from 'moment'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { db } from '@config/firebaseConfig.js'
import { doc, deleteDoc } from 'firebase/firestore'

const $toast = useToast()

const dataStore = useDataStore()

const residents = computed(() => dataStore.residents)
const authStore = useAuthStore()
const role = computed(() => authStore.role)

// remove resident
const willDelete = ref(false)
const residentToBeDeleted = ref('')

const showDeleteModal = (id) => {
  willDelete.value = true
  residentToBeDeleted.value = id
}

const removeResident = async () => {
  const docRef = doc(db, 'residents', residentToBeDeleted.value)
  try {
    await deleteDoc(docRef)
    willDelete.value = false
    $toast.success('Deleted resident successfully')
  } catch (error) {
    $toast.error('Failed to delete resident')
  }
}

const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 15;

const filteredData = computed(() => {
  return residents.value.filter((item) =>
    item.firstName.toLowerCase().includes(searchTerm.value.toLowerCase())
  ).sort((a,b) => (a.householdNumber > b.householdNumber) ? 1 : ((b.householdNumber > a.householdNumber) ? -1 : 0))
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

// update resident
const residentData = ref({})

const isUpdateResident = ref(false)
const updateResident = (data) => {
  residentData.value = data
  isUpdateResident.value = true
}

// format date
const formatDate = (date) => {
  if(date) return moment(date).format('ll')

  return
}


// edit medical of resident for midwife only
const residentDataToEdit = ref({})
const showModal = ref(false)


const showEditModal = (residentData) => {
  residentDataToEdit.value = residentData
  showModal.value = true
}
</script>