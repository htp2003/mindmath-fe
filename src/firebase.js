// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBUkgbxce0RtfT2JwNBhGJ4drQVyH7Hw4Q",
  authDomain: "mindmath-1b75c.firebaseapp.com",
  projectId: "mindmath-1b75c",
  storageBucket: "mindmath-1b75c.appspot.com",
  messagingSenderId: "359209386764",
  appId: "1:359209386764:web:927cbf700515069dfb3f29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };