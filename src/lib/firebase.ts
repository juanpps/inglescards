import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyByexviIPtcfnuFE8mNLEnRUSz-Op_QK7E",
    authDomain: "ingles-cards.firebaseapp.com",
    projectId: "ingles-cards",
    storageBucket: "ingles-cards.firebasestorage.app",
    messagingSenderId: "763577233454",
    appId: "1:763577233454:web:d7a4dac338f273b997afbf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
