<template>
    <div>
        <Bar
            id="my-chart-id"
            :options="chartOptions"
            :data="chartData"
        />
    </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { defineProps, ref, watchEffect } from 'vue'

const props = defineProps({
    data: Object
})

const year = ref([])
const count = ref([])

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        }
    }
}

const chartData = ref({
    labels: year.value,
    datasets: [{ 
        data: count.value,
        backgroundColor: '#2563eb'
    }]
})

watchEffect(() => {
    year.value = [] 
    count.value = []

    Object.entries(props.data).forEach(([key, value]) => {
        year.value.push(key) 
        count.value.push(value)
    })

    chartData.value = {
        labels: year.value,
        datasets: [{ 
            data: count.value,
            backgroundColor: '#2563eb'
        }]
    }
})

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
</script>
