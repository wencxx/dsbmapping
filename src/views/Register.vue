<template>
    <div class="w-full !h-screen !bg-[#9dde8b] flex items-center justify-center">
        <form @submit.prevent="register" class="bg-[#006769] w-1/3 h-fit rounded-md grid grid-cols-2 gap-5 p-4">
            <h1 class="text-2xl text-white uppercase font-semibold col-span-2 text-center">Register</h1>
            <p v-if="err" class="col-span-2 bg-red-500 pl-2 text-white rounded py-1">{{ err }}</p>
            <div class="w-full flex flex-col gap-y-2">
                <label class="text-white text-lg">Firstname</label>
                <input type="text" class="rounded h-8 pl-2 capitalize" v-model="userData.firstName">
            </div>
            <div class="w-full flex flex-col gap-y-2">
                <label class="text-white text-lg">Lastname</label>
                <input type="text" class="rounded h-8 pl-2 capitalize" v-model="userData.lastName">
            </div>
            <div class="w-full flex flex-col gap-y-2">
                <label class="text-white text-lg">Email</label>
                <input type="email" class="rounded h-8 pl-2" v-model="userData.email">
            </div>
            <div class="w-full flex flex-col gap-y-2">
                <label class="text-white text-lg">Email</label>
                <select class="rounded h-8 pl-2" v-model="userData.role" @change="handleRoleChange">
                    <option value="" disabled>Select role</option>
                    <option value="Staff">BHW</option>
                    <option value="Midwife">Staff</option>
                    <option value="Residents">Residents</option>
                </select>
            </div>
            <div class="w-full flex flex-col gap-y-2">
                <label class="text-white text-lg">Password</label>
                <input type="password" class="rounded h-8 pl-2" v-model="password">
            </div>
            <div class="w-full flex flex-col gap-y-2">
                <label class="text-white text-lg">Confirm Password</label>
                <input type="password" class="rounded h-8 pl-2" v-model="secondPassword">
            </div>
            <div class="col-span-2 flex justify-center">
                <button v-if="registering" class="bg-[#40a578] text-white w-1/2 py-1 rounded-md hover:bg-[#9dde8b] animate-pulse" disabled>Registering</button>
                <button v-else class="bg-[#40a578] text-white w-1/2 py-1 rounded-md hover:bg-[#9dde8b]">Register</button>
            </div>
            <p class="col-span-2 text-center text-white">Already have an  account? <router-link :to="{ name: 'login' }">Login</router-link></p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { db, auth } from '@config/firebaseConfig.js'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()

const secondPassword = ref('')
const password = ref('')

const handleRoleChange = () => {
    if(userData.value.role === 'Residents'){
        userData.value.isAccepted = true
    }else{
        userData.value.isAccepted = false
    }
}

const userData = ref({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    isAccepted: false
})

const err = ref('')
const registering = ref(false)

const userRef = collection(db, 'Users')

const register = async () => {
    err.value = ''
    try {
        registering.value = true

        if(!userData.value.role) return err.value = 'Please select a role'
        if(password.value !== secondPassword.value) return err.value = 'Password doesnt match'

        const userCredential  = await createUserWithEmailAndPassword(auth, userData.value.email, password.value)

        await updateProfile(userCredential.user, {
            displayName: userData.value.firstName
        })

        const snapshot = await addDoc(userRef, {
            ...userData.value,
            userId: userCredential.user.uid
        })


        if(!snapshot.empty){
            router.push('/')
        }
    } catch (error) {
        if (error.code === 'auth/invalid-credential') {
            err.value = 'Invali Credential.';
        }else if(error.code === 'auth/missing-password'){
            err.value = 'Missing password.';
        }else if(error.code === 'auth/email-already-in-use'){
            err.value = 'Email already registered.';
        }else{
            err.value = error.message;
        }
    } finally {
        registering.value = false
    }
}

</script>