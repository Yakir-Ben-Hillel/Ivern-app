"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const sign_methods_1 = require("./utils/sign_methods");
const user_methods_1 = require("./utils/user_methods");
const games_methods_1 = require("./utils/games_methods");
const posts_methods_1 = require("./utils/posts_methods");
const file_upload_1 = require("./utils/file_upload");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
exports.database = admin.firestore();
//projects handlers.
//user endpoints.
app.use(cors({ origin: '*' }));
app.post('/login', sign_methods_1.login);
app.post('/signup', sign_methods_1.signup);
app.post('/user', sign_methods_1.FBAuth, user_methods_1.userUpdate);
app.get('/user/:uid', user_methods_1.getUser);
app.post('/image', file_upload_1.uploadImage);
app.post('/users/image', sign_methods_1.FBAuth, file_upload_1.changeProfileImage);
//Games endpoints.
app.post('/games', games_methods_1.postAllPS4games);
app.post('/games/add', games_methods_1.addGameToDatabase);
app.post('/games/update', games_methods_1.updateGamesFunc);
app.get('/games', games_methods_1.getAllGames);
app.get('/games/:gameName', games_methods_1.searchGameInDatabase);
app.get('/games/api/:gameName', games_methods_1.searchUnfoundGame);
//Posts endpoints.
app.post('/posts/add', sign_methods_1.FBAuth, posts_methods_1.addPost);
app.post('/posts/edit/:pid', sign_methods_1.FBAuth, posts_methods_1.editPost);
app.delete('/posts/delete/:pid', sign_methods_1.FBAuth, posts_methods_1.deletePost);
app.get('/posts/get/:pid', posts_methods_1.getPost);
app.get('/posts/get/:gid', posts_methods_1.getAllGamePosts);
app.get('/posts/get/:uid', posts_methods_1.getAllUserPosts);
app.get('/posts/get', posts_methods_1.getAllPosts);
exports.api = functions.region('europe-west3').https.onRequest(app);
exports.updateGamesEachDay = functions
    .region('europe-west3')
    .pubsub.schedule('0 0 * * *')
    .timeZone('Israel/Tel_Aviv')
    .onRun(games_methods_1.updateGames);
//# sourceMappingURL=index.js.map