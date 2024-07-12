import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC4-wpT5L00RgwoPG9OEKUdX5Vd6xvh_Z4",
  authDomain: "pwa-react-node-93ce4.firebaseapp.com",
  projectId: "pwa-react-node-93ce4",
  storageBucket: "pwa-react-node-93ce4.appspot.com",
  messagingSenderId: "382342668321",
  appId: "1:382342668321:web:8c87639291c154b63a4360",
  measurementId: "G-PR64QJ8KVZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };


