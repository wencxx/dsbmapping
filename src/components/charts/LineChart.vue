<template>
    <div>
        <Line :data="data" :options="options" />
    </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { defineProps, watchEffect, ref } from 'vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: Object
})

const medical = ref([])
const count = ref([])

const data = ref({
  labels: medical.value,
  datasets: [
    {
      backgroundColor: '#2563eb',
      data: count.value
    }
  ]
})

const options = {
  responsive: true,
  plugins: {
    legend: {
        display: false
    }
  }
}

watchEffect(() => {
  medical.value = []
  count.value = []

  Object.entries(props.data).forEach(([key, value]) => {
    medical.value.push(key)
    count.value.push(value)
  })

  data.value = {
  labels: medical.value,
  datasets: [
    {
      backgroundColor: '#2563eb',
      data: count.value
    }
  ]
}
})
</script>