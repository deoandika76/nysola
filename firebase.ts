// firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCeCIq29L6vgE83reeqAh68Wd01jCF2BmA",
  authDomain: "nysola-62660.firebaseapp.com",
  projectId: "nysola-62660",
  storageBucket: "nysola-62660.appspot.com",
  messagingSenderId: "18232862863",
  appId: "1:18232862863:web:928cafcdf115e6d258a8fa"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Export firestore database
export const db = getFirestore(app);