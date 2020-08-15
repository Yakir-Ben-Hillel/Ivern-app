import { database } from '../index';
import functions = require('firebase-functions');
import express = require('express');
import admin = require('firebase-admin');
export interface RequestCustom extends express.Request {
  rawBody: Function | undefined;
  user: {
    email: string;
    createdAt: admin.firestore.Timestamp;
    handle: string;
    uid: string;
  };
}

export const userUpdate = async (request, res) => {
  const req = request as RequestCustom;
  const userDetails = {
    displayName: req.body.displayName,
    phoneNumber: req.body.phoneNumber,
    imageURL: req.body.imageURL,
  };
  const reducedDetails: {
    displayName: string;
    phoneNumber: string;
    imageURL: string;
    isNew: boolean;
  } = {
    displayName: '',
    phoneNumber: '',
    imageURL: '',
    isNew: false,
  };
  if (userDetails.displayName.trim())
    reducedDetails.displayName = userDetails.displayName;
  if (userDetails.phoneNumber.trim())
    reducedDetails.phoneNumber = userDetails.phoneNumber;
  if (userDetails.imageURL.trim())
    reducedDetails.imageURL = userDetails.imageURL;

  try {
    await database.doc(`users/${req.user.uid}`).update(reducedDetails);
    return res.status(201).json({ message: 'Details updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await database.doc(`/users/${req.params.uid}`).get();
    if (!user.exists)
      return res.status(404).json({ error: 'User does not exist.' });
    return res.status(200).json(user.data());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const userUpdateListener = functions
  .region('europe-west3')
  .firestore.document('/users/{uid}')
  .onUpdate(async (change) => {
    const batch = database.batch();
    let docs = await database
      .collection('/projects')
      .where('users', 'array-contains', change.before.data())
      .get();
    docs.forEach(async (doc) => {
      const data = await database.doc(`/projects/${doc.id}`).get();
      const users: any[] = data.data()?.users;

      const index = users.findIndex(
        (item) => item.uid === change.before.data().uid
      );
      users.splice(index, 1);
      users.splice(index, 0, change.after.data());
      const project = database.doc(`projects/${doc.id}`);
      batch.update(project, {
        users,
      });
    });
    docs = await database
      .collection('/missions')
      .where('user.uid', '==', change.before.data().uid)
      .get();
    docs.forEach((doc) => {
      const mission = database.doc(`/missions/${doc.id}`);
      batch.update(mission, { user: change.after.data() });
    });
    docs = await database
      .collection('/comments')
      .where('user.uid', '==', change.before.data().uid)
      .get();
    docs.forEach((doc) => {
      const comment = database.doc(`/comments/${doc.id}`);
      batch.update(comment, { user: change.after.data() });
    });
    return batch.commit();
  });
