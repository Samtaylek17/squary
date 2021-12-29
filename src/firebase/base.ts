import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from './config';

const app = firebase.initializeApp(firebaseConfig);

if (window.location.hostname === 'localhost' && process.env.REACT_APP_AUTH_EMULATOR) {
  app.auth().useEmulator('http://localhost:9099');
}

export default app;
