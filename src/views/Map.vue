<template>
    <div class="!p-0">
        <l-map class="!w-full !h-full" ref="map" v-model:zoom="zoom" :center="[10.5555, 123.2683]">
            <l-tile-layer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                layer-type="base"
                name="OpenStreetMap"
            ></l-tile-layer>
            <l-marker v-for="household in households" :key="household.id" :lat-lng="[household.lat, household.lng]">
                <l-popup>
                    <div>
                        <h3><span class="font-bold">Household Numbers:</span> {{ household.householdNumber }}</h3>
                        <h3><span class="font-bold">Head:</span> {{ household.head }}</h3>
                        <h3><span class="font-bold">Residents:</span> {{ countResidentByHousehold(household.householdNumber) }}</h3>
                    </div>
                </l-popup>
            </l-marker>
        </l-map>
    </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { computed, ref } from 'vue';
import { useDataStore } from '@store'

const dataStore = useDataStore()

const households = computed(() => dataStore.households)
const residents = computed(() => dataStore.residents)


const countResidentByHousehold = (householdNumber) => {
    const resident = residents.value.filter(resident => resident.householdNumber === householdNumber)

    return resident.length
}

const zoom = ref(13);
</script>
