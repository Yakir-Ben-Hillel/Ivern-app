import { FBAuth, login, signup, signupWithGoogle } from './utils/sign_methods';
import { getUser, userUpdate } from './utils/user_methods';
import {
  postAllGames,
  searchUnfoundGame,
  searchGameInDatabase,
  addGameToDatabase,
  updateGames,
  getAllGames,
  updateArtworks,
  updateCovers,
  manualUpdateGames,
} from './utils/games_methods';
import {
  addPost,
  getPost,
  editPost,
  deletePost,
  getAllGamePosts,
  getAllUserPosts,
  getAllPosts,
  getCustomPostsRequest,
  getAllPlatformPosts,
} from './utils/posts_methods';
import { changeProfileImage, uploadImage } from './utils/file_upload';
import {
  addChat,
  addMessage,
  chatMessagesHasBeenRead,
  deleteChat,
  deleteEmptyChats,
  getAllChatMessages,
  getAllUserChats,
  getChat,
} from './utils/chat_methods';
import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import cors = require('cors');
const app = express();
export const database = admin.firestore();
//projects handlers.
app.use(cors());
//user endpoints.
app.get('/user/:uid', getUser);
app.post('/login', login);
app.post('/signup', signup);
app.post('/signup/google', signupWithGoogle);
app.post('/user', FBAuth, userUpdate);
app.post('/image', uploadImage);
app.post('/users/image', FBAuth, changeProfileImage);
//Games endpoints.
app.get('/games', getAllGames);
app.get('/games/:gameName', searchGameInDatabase);
app.get('/games/api/:gameName', searchUnfoundGame);
app.post('/games', postAllGames);
app.post('/games/artworks', updateArtworks);
app.post('/games/covers', updateCovers);
app.post('/games/add', addGameToDatabase);
app.post('/games/update', manualUpdateGames);
//Posts endpoints.
app.get('/posts/get', getAllPosts);
app.get('/posts/get/platform/:platform', getAllPlatformPosts);
app.get('/posts/get/custom', getCustomPostsRequest);
app.get('/posts/get/one/:pid', getPost);
app.get('/posts/get/game/:gid', getAllGamePosts);
app.get('/posts/get/user/:uid', getAllUserPosts);
app.post('/posts/add', FBAuth, addPost);
app.post('/posts/edit/:pid', FBAuth, editPost);
app.delete('/posts/delete/:pid', FBAuth, deletePost);
//Chat endpoints.
app.get('/chat/user', FBAuth, getAllUserChats);
app.get('/chat/:cid', FBAuth, getChat);
app.get('/chat/messages/get/:cid', FBAuth, getAllChatMessages);
app.post('/chat', FBAuth, addChat);
app.post('/chat/reset/:cid', FBAuth, chatMessagesHasBeenRead);
app.post('/chat/messages/add/:cid', FBAuth, addMessage);
app.delete('/chat/delete/:cid', FBAuth, deleteChat);
exports.api = functions.region('europe-west3').https.onRequest(app);
exports.updateGamesEachDay = functions
  .region('europe-west3')
  .pubsub.schedule('0 0 * * *')
  .onRun(updateGames);
exports.deleteEmptyChats = functions
  .region('europe-west3')
  .pubsub.schedule('0 * * * *')
  .onRun(deleteEmptyChats);
