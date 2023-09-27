import firebase from "firebase/compat/app";
// Other libraries might need to also be prefixed with "compat":
import "firebase/compat/auth";
import "firebase/compat/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBo4shD400hs9zWfqeecduLIhRchHnPdn8",
    authDomain: "clone-e6dc1.firebaseapp.com",
    projectId: "clone-e6dc1",
    storageBucket: "clone-e6dc1.appspot.com",
    messagingSenderId: "204051253155",
    appId: "1:204051253155:web:f4028105a0549242107c16",
    measurementId: "G-MN6BRYW956"
  };
  const firebaseApp=firebase.initializeApp(firebaseConfig);
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  export {db,auth};
