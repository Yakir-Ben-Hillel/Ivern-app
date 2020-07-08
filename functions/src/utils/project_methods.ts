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
    handle: req.user.handle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  try {
    const data = await database.collection('projects').add(project);
    return res
      .json({ message: `Project ${data.id} added sucessesfuly ` })
      .status(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'something went wrong!' });
  }
};
