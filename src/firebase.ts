import firebase from 'firebase';
const firebaseConfig = {
  apiKey: 'AIzaSyBGuUVnrZYtv3Rmzzgn1M84vYdQu423MlU',
  authDomain: 'ivern-app.firebaseapp.com',
  databaseURL: 'https://ivern-app.firebaseio.com',
  projectId: 'ivern-app',
  storageBucket: 'ivern-app.appspot.com',
  messagingSenderId: '143935856896',
  appId: '1:143935856896:web:f83269334c25501b0c13e5',
  measurementId: 'G-51BPX3L4GF',
};
firebase.initializeApp(firebaseConfig);
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
firebase.auth().useDeviceLanguage();
export { firebase, googleAuthProvider, facebookAuthProvider };
