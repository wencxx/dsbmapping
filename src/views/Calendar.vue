<template>
  <div class="flex flex-col gap-y-10 content pb-10">
    <FullCalendar :options="calendarOptions" class="!h-full" />
    <!-- Modal to show details -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-5 rounded shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Events on {{ moment(selectedDate).format('ll') }}</h2>
        <ul>
          <li v-for="(ann, index) in filteredAnnouncements" :key="index">
            <p><strong>Title:</strong> {{ ann.title }}</p>
            <p><strong>Description:</strong> {{ ann.description }}</p>
          </li>
        </ul>
        <button @click="closeModal" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useDataStore } from '../store'
import moment from 'moment'

const dataStore = useDataStore()

const announcements = computed(() => dataStore.announcements)

const mappedAnnouncements = computed(() => {
  return announcements.value.map(ann => ({
    date: ann.when?.split('T')[0],
    title: ann.title,
    description: ann.description
  }))
})

const showModal = ref(false)
const selectedDate = ref('')
const filteredAnnouncements = ref([])

const handleDateClick = (arg) => {
  selectedDate.value = arg.dateStr
  filteredAnnouncements.value = announcements.value.filter(
    ann => ann.when.split('T')[0] === arg.dateStr
  )

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  dateClick: handleDateClick,
  events: mappedAnnouncements
})
</script>