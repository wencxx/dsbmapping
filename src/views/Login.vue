<template>
    <div class="w-full !h-screen !bg-[#9dde8b] flex items-center justify-center">
        <form @submit.prevent="login" class="bg-[#006769] w-full max-w-md h-fit rounded-md flex flex-col items-center gap-y-5 p-4">
            <div class="flex flex-col items-center justify-center gap-y-2">
                <img src="../assets/logo.png" alt="logo" class="w-20 aspect-square">
                <h1 class="text-2xl text-white uppercase font-semibold">Welcome</h1>
            </div>
            <p v-if="err" class="text-lg text-white bg-red-500 w-full pl-2 rounded">{{ err }}</p>
            <p v-if="notAccepted" class="text-lg text-white bg-green-500 w-full py-1 pl-2 rounded">Wait for the admin to accept your registration</p>
            <div class="w-full flex flex-col gap-y-2">
                <label class="text-white text-lg">Email</label>
                <input type="email" class="rounded h-8 pl-2" v-model="email">
            </div>
            <div class="w-full flex flex-col gap-y-2">
                <label class="text-white text-lg">Password</label>
                <input type="password" class="rounded h-8 pl-2" v-model="password">
            </div>
            <div class="w-1/3">
                <button v-if="!logginIn" class="bg-[#40a578] text-white w-full py-1 rounded-md hover:bg-[#9dde8b]">Login</button>
                <button v-else class="bg-[#40a578] text-white w-full py-1 rounded-md hover:bg-[#9dde8b] animate-pulse" disabled>Logging In</button>
            </div>
            <p class="text-white">Don't have an account? <router-link :to="{ name: 'register' }">Register</router-link></p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' 
import { auth, db } from '@config/firebaseConfig.js'
import { collection, getDocs, where, query, limit } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthStore } from '@store'

const autStore = useAuthStore()
const router = useRouter()

const err = ref('')
const logginIn = ref(false)
const notAccepted = ref(false)

const email = ref('')
const password = ref('')


const userRef = collection(db, 'Users')

const login = async () => {
    try {
        logginIn.value = true
        notAccepted.value = false
        const credentials = await signInWithEmailAndPassword(auth, email.value, password.value)

        if(credentials.user.uid){

            const q = query(
                userRef,
                where('userId', '==', credentials.user.uid),
                limit(1)
            )

            const snapshot = await getDocs(q) 

             if (snapshot.empty) {
                err.value = 'No matching documents found for the user.'
                return;
            }   



            if(snapshot.docs[0].data().role === 'Admin'){
                autStore.login(credentials.user.accessToken, credentials.user, snapshot.docs[0].data().role)
                router.push('/dashboard')
            }else if(snapshot.docs[0].data().role === 'Staff'){
                if(!snapshot.docs[0].data().isAccepted){
                    notAccepted.value = true
                    return
                }else{
                    autStore.login(credentials.user.accessToken, credentials.user, snapshot.docs[0].data().role)
                    router.push('/residents')
                }
            }else if(snapshot.docs[0].data().role === 'Midwife'){
                if(!snapshot.docs[0].data().isAccepted){
                    notAccepted.value = true
                    return
                }else{
                    autStore.login(credentials.user.accessToken, credentials.user, snapshot.docs[0].data().role)
                    router.push('/residents')
                }
            }else if(snapshot.docs[0].data().role === 'Residents'){
                autStore.login(credentials.user.accessToken, credentials.user, snapshot.docs[0].data().role)
                router.push('/newsfeed')
            }
        }
    } catch (error) {
        console.log(error)
        if (error.code === 'auth/invalid-credential') {
            err.value = 'Invalid Credential.';
        }else if(error.code === 'auth/missing-password'){
            err.value = 'Missing password.';
        }else{
            err.value = 'Something wrong with server.';
        }
    }finally{
        logginIn.value = false
    }
}
</script>