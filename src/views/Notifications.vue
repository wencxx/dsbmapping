<template>
    <div class="flex flex-col gap-y-10 h-[92dvh] overflow-auto">
        <div class="rounded-md bg-white p-10 shadow space-y-2">
            <h1 class="font-semibold text-xl mb-4">Notifications</h1>
            <div v-for="resident in filteredData" :key="resident.name" class="bg-gray-200 rounded p-3">
              <p>
                This is a gentle reminder for <span class="font-medium capitalize">{{ resident.name }}</span> to visit the health office. Please see the details below:<br>
                Purpose of Visit: <span class="font-medium capitalize">{{ resident.checkupType }}</span><br>
                Date: <span class="font-medium">{{ resident.dates.join(', ')  }}</span>
              </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

const filteredData = computed(() => {
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; 
  const currentDate = new Date();

  return residents.value
    .filter((item) => {
      const followUpDate = new Date(item.followUpDate);
      const preCheckupDate = new Date(item.preCheckupDate);

      const isFollowUpClose = Math.abs(followUpDate - currentDate) <= oneWeekInMs;
      const isPreCheckupClose = Math.abs(preCheckupDate - currentDate) <= oneWeekInMs;

      return (
        item.householdNumber === currentUser.value?.householdNumber &&
        item.email !== currentUser.value?.email &&
        (isFollowUpClose || isPreCheckupClose)
      );
    })
    .map((item) => {
      const followUpDate = new Date(item.followUpDate);
      const preCheckupDate = new Date(item.preCheckupDate);

      // Determine the closest checkup type
      const daysToFollowUp = Math.abs(followUpDate - currentDate);
      const daysToPreCheckup = Math.abs(preCheckupDate - currentDate);

      const checkupType =
        daysToFollowUp <= daysToPreCheckup ? "Vaccine follow-up" : "Prenatal checkup";

      return {
        name: item.firstName + ' ' + item.middleName + ' ' + item.lastName,
        dates: [item.followUpDate, item.preCheckupDate],
        checkupType,
      };
    });
});



</script>