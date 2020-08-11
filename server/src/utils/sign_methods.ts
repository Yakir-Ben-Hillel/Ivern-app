import { firebase } from '../firebase';
import admin = require('firebase-admin');
admin.initializeApp();
const database = admin.firestore();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const FBAuth = async (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found.');
    return res.status(403).json({ error: 'Unauthorized.' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    const data = await database
      .collection('users')
      .where('uid', '==', req.user.uid)
      .limit(1)
      .get();
    req.user.handle = data.docs[0].data().handle;
    return next();
  } catch (error) {
    console.error('Error while verifying token', error);
    res.status(403).json(error);
  }
};
export const login = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);
    const token = await data.user?.getIdToken();
    return res.json({ token });
  } catch (error) {
    console.log(error);
    if (error.code === 'auth/wrong-password') {
      return res.status(403).json({ password: 'The password is incorrect.' });
    } else if (error.code === 'auth/user-not-found') {
      return res
        .status(403)
        .json({ email: 'The user has not been found, please signup.' });
    } else if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ email: 'The email address is invalid.' });
    } else return res.status(500).json({ general: 'Something went wrong!' });
  }
};
export const signupWithGoogle = async (req, res) => {
  const newUser = {
    email: req.body.email,
    displayName: req.body.displayName,
    phoneNumber: req.body.phoneNumber,
    imageURL: req.body.imageURL,
    uid: req.body.uid,
    provider: 'Google',
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  try {
    const doc = await database.doc(`/users/${newUser.uid}`).get();
    if (doc.exists) {
      await database.doc(`/users/${newUser.uid}`).update({
        displayName: newUser.displayName,
        imageURL: newUser.imageURL,
        phoneNumber: newUser.phoneNumber,
      });
      return res.status(200).json({ newUser });
    } else {
      await database.doc(`/users/${newUser.uid}`).set(newUser);
      return res.status(201).json({ newUser });
    }
  } catch (error) {
    console.error(error);
  }
};
export const signup = async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  const doc = await database.doc(`/users/${newUser.email}`).get();
  if (doc.exists)
    return res.status(400).json({ handle: 'This user already exists' });
  try {
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);
    const uid = data.user?.uid;
    const token = await data.user?.getIdToken();
    const userCredentials = {
      email: newUser.email,
      createdAt: newUser.createdAt,
      imageURL:
        'https://firebasestorage.googleapis.com/v0/b/ivern-app.appspot.com/o/no-img.png?alt=media',
      provider: 'EmailAndPassword',
      uid,
    };
    await database.doc(`/users/${uid}`).set(userCredentials);
    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({ email: 'Email is already is use.' });
    } else if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ email: 'The email address is invalid.' });
    } else if (error.code === 'auth/weak-password') {
      return res
        .status(400)
        .json({ password: 'Password should be at least 6 characters' });
    } else {
      return res
        .status(500)
        .json({ general: 'Something went wrong, please try again.' });
    }
  }
};
