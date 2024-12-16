import { defineStore } from "pinia";
import { db } from '@config/firebaseConfig.js'; 
import { collection, onSnapshot, query, where, or } from 'firebase/firestore'

const useDataStore = defineStore('dataStore', {
    state: () => ({
        households: [],
        announcements: [],
        staffs: [],
        residents: [],
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
        groupedByImmunization(state){
            const grouped = {};

            state.residents.forEach(resident => {
                if(resident.immunization){
                    resident.immunization.forEach(immunize => {
                        if(!grouped[immunize]){
                            grouped[immunize] = 0
                        }
                        grouped[immunize]++
                    })
                }
            });

            return grouped;
        },
        groupedByDeworming(state) {
            const grouped = {
                dewormed: 0,
                notDewormed: 0,
            };
        
            const currentYear = new Date().getFullYear();
        
            state.residents.forEach(resident => {
                if (resident.birthdate) {
                    const birthYear = new Date(resident.birthdate).getFullYear();
                    const age = currentYear - birthYear;
        
                    if (age >= 2 && age <= 6) {
                        if (resident.isDewormed) {
                            grouped.dewormed++;
                        } else {
                            grouped.notDewormed++;
                        }
                    }
                }
            });
        
            return grouped;
        },
        groupedByfamilyPlanning(state){
            const grouped = {};

            state.residents.forEach(resident => {
                if(resident.familyPlanning){
                    if(!grouped[resident.familyPlanning]){
                        grouped[resident.familyPlanning] = 0
                    }
                    grouped[resident.familyPlanning]++
                }
            });

            return grouped;
        },
        groupedByPregnancy(state) {
            const grouped = {
                pregnant: 0,
                notPregnant: 0,
            };
        
            state.residents.forEach(resident => {
                if (resident.isPregnant === 'Yes') {
                    grouped.pregnant++;
                } else if (resident.isPregnant === 'No') {
                    grouped.notPregnant++;
                }
            });
        
            return grouped;
        },
    },  
    actions: {
        async getHouseholds() {
            const householdRef = collection(db, 'households');
            try {
                this.staffs = []
                const q = 
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
                        this.getStaffs()
                        this.getAnnouncements()
                    }
                );
            } catch (error) {
                console.log(error)
            }
        },
        async getStaffs() {
            const residentsRef = collection(db, 'Users')

            try {
                this.staffs = [];
                const q = query(
                    residentsRef,
                    or(
                        where('role', '==', 'Staff'),
                        where('role', '==', 'Midwife'),
                    )
                )
                onSnapshot(
                    q,
                    (snapshot) => {
                        this.staffs = []; 
                        
                        snapshot.forEach(doc => {
                            this.staffs.push({
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
        async getAnnouncements() {
            const announcements = collection(db, 'announcements')

            try {
                this.residents = [];
                onSnapshot(
                    announcements,
                    (snapshot) => {
                        this.announcements = []; 
                        
                        snapshot.forEach(doc => {
                            this.announcements.push({
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
