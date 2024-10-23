// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDhDH5z4aIHtgQpuc7_i3BAqfd-eqyRMg4",
    authDomain: "appointment-scheduler-58a23.firebaseapp.com",
    projectId: "appointment-scheduler-58a23",
    storageBucket: "appointment-scheduler-58a23.appspot.com",
    messagingSenderId: "670781803574",
    appId: "1:670781803574:web:ee4d6779a9410d77b5dc97",
    measurementId: "G-07HH9528RE"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);