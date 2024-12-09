<template>
  <div class="flex flex-col gap-y-10">
    <div class="rounded-md bg-white p-10 shadow">
      <div class="flex items-center justify-between mb-2">
        <h1 class="font-semibold text-xl">Medical Reports</h1>
        <div class="flex gap-x-2">
          <button class="bg-blue-500 px-3 text-white rounded" v-print="'#medicalReports'">Print</button>
          <download-csv
            :data="paginatedData" name="medicalreports.csv" class="bg-green-500 px-3 text-white rounded cursor-pointer">
            Download Data
          </download-csv>
        </div>
      </div>
      <div class="container mx-auto">
        <!-- <input
          type="text"
          v-model="searchTerm"
          placeholder="Search..."
          class="border float-end border-gray-300 rounded pl-2 h-8 mb-4"
        /> -->

        <table class="min-w-full border border-gray-300" id="medicalReports">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 p-2 uppercase">Disease</th>
              <th class="border border-gray-300 p-2 uppercase">Resident with Disease</th>
            </tr>
          </thead>
          <tbody v-if="paginatedData.length">
            <tr
              v-for="([key, value], index) in paginatedData"
              :key="index"
              class="border border-gray-300 text-center"
            >
              <td class="border border-gray-300 p-2">{{ key }}</td>
              <td class="border border-gray-300 p-2 cursor-pointer" @click="showResidentsData(key, 'disease')">{{ value }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="2" class="py-2 text-center">No data to show</td>
            </tr>
          </tbody>
        </table>

        <!-- <div class="flex justify-end items-center mt-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="bg-gray-300 text-white w-6 h-7 flex items-center justify-center"
          >
            <Icon icon="weui:arrow-outlined" class="rotate-180" />
          </button>
          <span class="bg-blue-500 w-6 h-7 text-white text-center">{{ currentPage }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="bg-gray-300 text-white w-6 h-7 flex items-center justify-center"
          >
            <Icon icon="weui:arrow-outlined" />
          </button>
        </div> -->

        <div class="flex items-center justify-between mb-2 mt-20">
          <h1 class="font-semibold text-xl">Reports on Vaccinated Children (0-59 months)</h1>
          <div class="flex gap-x-2">
            <button class="bg-blue-500 px-3 text-white rounded" v-print="'#vaccinatedReports'">Print</button>
            <download-csv
              :data="Object.entries(immunization).map(([key, value]) => ({ immunization: key, Immunize_Childrens: value }))" name="medicalreports.csv" class="bg-green-500 px-3 text-white rounded cursor-pointer">
              Download Data
            </download-csv>
          </div>
        </div>
        <table class="min-w-full border border-gray-300" id="vaccinatedReports">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 p-2 uppercase">Immunization</th>
              <th class="border border-gray-300 p-2 uppercase">Immunize Childrens</th>
            </tr>
          </thead>
          <tbody v-if="Object.keys(immunization)?.length">
            <tr
              v-for="(value, key, index) in immunization"
              :key="index"
              class="border border-gray-300 text-center"
            >
              <td class="border border-gray-300 p-2">{{ key }}</td>
              <td class="border border-gray-300 p-2 cursor-pointer" @click="showResidentsData(key, 'immunizations')">{{ value }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="2" class="py-2 text-center">No data to show</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <showResidents v-if="showModal" :disease="diseaseToShow" :type="typeToShow" @closeModal="showModal = false" />
  </div>
</template>

<script setup>
import showResidents from '@components/showResidents.vue'
import { ref, computed } from 'vue';
import { useDataStore } from '@store';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();
const dataStore = useDataStore();

const diseases = computed(() => dataStore.groupedByMedical);
const immunization = computed(() => dataStore.groupedByImmunization);


const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(100);

// Filter diseases based on search term
const filteredData = computed(() => {
  return Object.entries(diseases.value).filter(([key]) =>
    key.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredData.value.slice(start, start + itemsPerPage.value);
});


// show modal
const showModal = ref(false)
const diseaseToShow = ref('')
const typeToShow = ref('')

const showResidentsData = (disease, type) => {
  diseaseToShow.value = disease
  typeToShow.value = type
  showModal.value = true
}

</script>
