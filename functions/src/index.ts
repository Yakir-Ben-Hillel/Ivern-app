import { FBAuth, login, signup } from './utils/sign_methods';
import { getUser, userUpdate, userUpdateListener } from './utils/user_methods';
import { addProject, addUserToProject } from './utils/project_methods';
import {
  postAllPS4games,
  searchUnfoundGame,
  searchGameInDatabase,
} from './utils/games_methods';
import {
  isUserInProjectAuth,
  addMission,
  getAllMissionsInProject,
  getMission,
  deleteMission,
  addCommentToMission,
  getAllCommentsInMission,
  deleteComment,
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
app.post('/missions', FBAuth, addMission);
app.post(
  '/missions/:missionID/comment',
  FBAuth,
  isUserInProjectAuth,
  addCommentToMission
);
app.get('/missions/:missionID/comment', getAllCommentsInMission);
app.delete(
  '/missions/:missionID/comment/:commentID',
  FBAuth,
  isUserInProjectAuth,
  deleteComment
);
app.get('/missions', FBAuth, getAllMissionsInProject);
app.get('/missions/:missionID', getMission);
app.delete('/missions/:missionID', FBAuth, isUserInProjectAuth, deleteMission);
//user handlers.
app.post('/login', login);
app.post('/signup', signup);
app.post('/user', FBAuth, userUpdate);
app.get('/user/:uid', getUser);
app.post('/users/image', FBAuth, changeProfileImage);
app.post('/games', postAllPS4games);
app.get('/games/:gameName', searchGameInDatabase);
app.get('/games/api/:gameName', searchUnfoundGame);
exports.api = functions.region('europe-west3').https.onRequest(app);
exports.onUserUpdate = userUpdateListener;
