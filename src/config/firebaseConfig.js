import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCq_dxQcntCFbbL61So_q5hKIJm9uaDDIc",
  authDomain: "dsbmapping-eb417.firebaseapp.com",
  projectId: "dsbmapping-eb417",
  storageBucket: "dsbmapping-eb417.appspot.com",
  messagingSenderId: "859114295994",
  appId: "1:859114295994:web:8b74f7bb6bf7eae369e883",
  measurementId: "G-77YP7MHEBP"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export {
    db,
    auth
}