// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
apiKey: "AIzaSyDMaPmS2Zr738HNtOjqjikFmfltNoOw3z0",
  authDomain: "mern-blog-8e1d3.firebaseapp.com",
  projectId: "mern-blog-8e1d3",
  storageBucket: "mern-blog-8e1d3.appspot.com",
  messagingSenderId: "298823818899",
  appId: "1:298823818899:web:ad162aded6306f69acf766"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);