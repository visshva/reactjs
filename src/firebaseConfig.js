import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBaVIzAP6mtFuZXKmwgO0Gaw7Y_RS5v9dw",
                        authDomain: "fir-login-37ebb.firebaseapp.com",
                        projectId: "fir-login-37ebb",
                        storageBucket: "fir-login-37ebb.appspot.com",
                        messagingSenderId: "169821260014",
                        appId: "1:169821260014:web:db5701cfe0ccc7eee9cbff",
                        measurementId: "G-JX0SPJ066J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
