import { database } from '../index';
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

export const addProject = async (request, res) => {
  const req = request as RequestCustom;
  const project = {
    name: req.body.name,
    admin: req.user.handle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    users: [],
  };
  try {
    const data = await database.collection('projects').add(project);
    await database.doc(`/projects/${data.id}`).update({ projectID: data.id });
    return res
      .json({ message: `Project ${data.id} added sucessesfuly ` })
      .status(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'something went wrong!' });
  }
};
export const addUserToProject = async (req, res) => {
  try {
    const data = await database
      .collection('users')
      .where('email', '==', req.body.email)
      .limit(1)
      .get();
    if (data.empty)
      return res.status(400).json({ message: 'User does not exist.' });
    else {
      await database
        .collection('/projects')
        .doc(req.body.pid)
        .update({
          users: admin.firestore.FieldValue.arrayUnion(data.docs[0].data()),
        });
      return res
        .status(200)
        .json({ message: `user ${data.docs[0].id} added sucessesfuly` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
