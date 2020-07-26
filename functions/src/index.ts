import { FBAuth, login, signup } from './utils/sign_methods';
import { getUser, userUpdate } from './utils/user_methods';
import {
  postAllPS4games,
  searchUnfoundGame,
  searchGameInDatabase,
  addGameToDatabase,
  updateGames,
  getAllGames,
  updateGamesFunc,
} from './utils/games_methods';
import {
  addPost,
  getPost,
  editPost,
  deletePost,
  getAllGamePosts,
  getAllUserPosts,
  getAllPosts,
} from './utils/posts_methods';
import { changeProfileImage, uploadImage } from './utils/file_upload';
import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import cors = require('cors');
const app = express();
export const database = admin.firestore();
//projects handlers.
//user endpoints.
app.use(cors({ origin: '*' }));
app.post('/login', login);
app.post('/signup', signup);
app.post('/user', FBAuth, userUpdate);
app.get('/user/:uid', getUser);
app.post('/image', uploadImage);
app.post('/users/image', FBAuth, changeProfileImage);
//Games endpoints.
app.post('/games', postAllPS4games);
app.post('/games/add', addGameToDatabase);
app.post('/games/update', updateGamesFunc);
app.get('/games', getAllGames);
app.get('/games/:gameName', searchGameInDatabase);
app.get('/games/api/:gameName', searchUnfoundGame);
//Posts endpoints.
app.post('/posts/add', FBAuth, addPost);
app.post('/posts/edit/:pid', FBAuth, editPost);
app.delete('/posts/delete/:pid', FBAuth, deletePost);
app.get('/posts/get/:pid', getPost);
app.get('/posts/get/:gid', getAllGamePosts);
app.get('/posts/get/:uid', getAllUserPosts);
app.get('/posts/get', getAllPosts);
exports.api = functions.region('europe-west3').https.onRequest(app);
exports.updateGamesEachDay = functions
  .region('europe-west3')
  .pubsub.schedule('0 0 * * *')
  .timeZone('Israel/Tel_Aviv')
  .onRun(updateGames);
