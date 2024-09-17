import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwzEQBIh0H8PwTKk-3Spwf8sIjWq57748",
  authDomain: "aiecom.firebaseapp.com",
  projectId: "aiecom",
  storageBucket: "aiecom.appspot.com",
  messagingSenderId: "1033893733428",
  appId: "1:1033893733428:web:a484ad818a05a1cea5d661",
  measurementId: "G-CZHZ6C7QR7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }; 


// You may not need analytics in this module, but if you do, you can export it as well
// export { app, db, auth, analytics };


//_firebase__WEBPACK_IMPORTED_MODULE_1__.auth.signInWithEmailAndPassword is not a function

