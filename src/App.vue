<template>
  <div class="flex w-screen">
      <Sidebar v-if="isAuth && role !== 'Resident'" />
      <div class="w-full" :class="{'w-[95dvw]': isAuth &&  role !== 'Resident'}">
        <Header v-if="isAuth" class="h-[8dvh] bg-white shadow-lg" />
        <router-view class="bg-gray-200/85 h-[92dvh] py-14 px-48" />
      </div>
  </div>
</template>

<script setup>
import Sidebar from '@components/Sidebar.vue'
import Header from '@components/Header.vue'
import { useAuthStore } from '@store'
import { computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'

const authStore = useAuthStore()

const isAuth = computed(() => authStore.isAuth)

const role = computed(() => authStore.role)

const listenForAuthChanges = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            isAuthenticated.value = true;
            console.log('User is signed in:', user);
        } else {
            isAuthenticated.value = false;
            console.log('User is signed out');
        }
    });

    return unsubscribe;
};


</script>