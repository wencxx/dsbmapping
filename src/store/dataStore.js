import { defineStore } from "pinia";
import { db } from '@config/firebaseConfig.js'; 
import { collection, onSnapshot } from 'firebase/firestore'

const useDataStore = defineStore('dataStore', {
    state: () => ({
        households: [],
        residents: []
    }),
    getters: {
        totalHouseholds(state) {
            return state.households.length
        },
        totalResidents(state) {
            return state.residents.length
        },
        totalSenior(state) {
            const currentDate = new Date()
            const seniors = state.residents.filter(resident => {
                if (resident.birthdate) {
                    const birthDate = new Date(resident.birthdate)
                    const age = currentDate.getFullYear() - birthDate.getFullYear()
                    const monthDiff = currentDate.getMonth() - birthDate.getMonth()
                    return age > 60 || (age === 60 && monthDiff >= 0)
                }
                return false;
            });
            return seniors.length;
        },
        totalWithMedical(state) {
            const resident = state.residents.filter(resident => resident.medicalHistory.length > 0);
            return resident.length;
        },
        groupedByYear(state){
            const grouped = {}

            state.residents.forEach(resident => {
                if (resident.addedAt) {
                    const year = new Date(resident.addedAt.seconds * 1000).getFullYear()
                    
                    if (!grouped[year]) {
                        grouped[year] = 0
                    }
                    grouped[year]++
                }
            })

            return grouped
        },
        groupedByMedical(state){
            const grouped = {};

            state.residents.forEach(resident => {
                if(resident.medicalHistory){
                    resident.medicalHistory.forEach(medical => {
                        if(!grouped[medical]){
                            grouped[medical] = 0
                        }
                        grouped[medical]++
                    })
                }
            });

            return grouped;
        },
    },  
    actions: {
        async getHouseholds() {
            const householdRef = collection(db, 'households');
            try {
                this.households = []
                onSnapshot(
                    householdRef,
                    (snapshot) => {
                        this.households = []
                        
                        snapshot.forEach(doc => {
                            this.households.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        });
                        this.getResidents()
                    }
                );
            } catch (error) {
                console.log(error)
            }
        },
        async getResidents() {
            const residentsRef = collection(db, 'residents')

            try {
                this.residents = [];
                onSnapshot(
                    residentsRef,
                    (snapshot) => {
                        this.residents = []; 
                        
                        snapshot.forEach(doc => {
                            this.residents.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        });
                    }
                );
            } catch (error) {
                console.log(error)
            }
        },
    }
});

export default useDataStore;
