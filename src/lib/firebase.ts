import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC1DEGLU3FraIDI2QqqSFL3hmdB0odiSD4",
    authDomain: "ramazan-27759.firebaseapp.com",
    projectId: "ramazan-27759",
    storageBucket: "ramazan-27759.firebasestorage.app",
    messagingSenderId: "185596446237",
    appId: "1:185596446237:web:f4922ecec99593a61fe8f4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
