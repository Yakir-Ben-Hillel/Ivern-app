import { FBAuth, login, signup } from './utils/sign_methods';
import { getUser, userUpdate } from './utils/user_methods';
import { addProject, addUserToProject } from './utils/project_methods';
import {
  addMission,
  getAllMissionsInProject,
  getMission,
  deleteMission,
} from './utils/missions_methods';
import { changeProfileImage } from './utils/file_upload';
import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
const app = express();
export const database = admin.firestore();
//projects handlers.
app.post('/projects', FBAuth, addProject);
app.post('/projects/user', FBAuth, addUserToProject);
//missions handlers.
app.post('/missions', addMission);
app.get('/missions', getAllMissionsInProject);
app.get('/missions/:missionID', getMission);
app.delete('/missions/:missionID', FBAuth, deleteMission);
//user handlers.
app.post('/login', login);
app.post('/signup', signup);
app.post('/user', FBAuth, userUpdate);
app.get('/user/:uid', getUser);
app.post('/users/image', FBAuth, changeProfileImage);
exports.api = functions.region('europe-west1').https.onRequest(app);
