"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.getAllUserPosts = exports.getAllGamePosts = exports.editPost = exports.deletePost = exports.addPost = exports.getPost = void 0;
const games_methods_1 = require("./games_methods");
const firebase_1 = require("../firebase");
const axios = require('axios');
exports.getPost = async (req, res) => {
    try {
        const post = await games_methods_1.database.doc(`/posts/${req.params.pid}`).get();
        if (!post.exists)
            return res.status(404).json({ error: 'Post did not found' });
        else
            return res.status(200).json({ post: post.data() });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.addPost = async (request, res) => {
    var _a, _b;
    try {
        const req = request;
        const post = {
            gid: req.body.gid,
            uid: req.user.uid,
            platform: req.body.platform,
            exchange: req.body.exchange,
            sell: req.body.sell,
            price: req.body.price,
            imageURL: req.body.imageURL,
            createdAt: new Date().toISOString(),
            gameName: null,
        };
        if ((!post.sell && !post.exchange) || post.price <= 0)
            return res.status(400).json({ error: 'Bad input.' });
        //Getting cover id from the API.
        if (post.imageURL === null) {
            const game = await games_methods_1.database.doc(`games/${req.body.gid}`).get();
            if (!game.exists)
                res
                    .status(400)
                    .json({ error: 'The game does not exists in the database.' });
            const image = await axios({
                //Getting cover url and making it logo_med.
                url: 'https://api-v3.igdb.com/covers',
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'user-key': firebase_1.IGDB_API_KEY,
                },
                data: `fields url;where id=${(_a = game.data()) === null || _a === void 0 ? void 0 : _a.cover};`,
            });
            const imageURL = image.data[0].url
                .replace('thumb', 'logo_med')
                .substring(2);
            post.imageURL = imageURL;
            post.gameName = (_b = game.data()) === null || _b === void 0 ? void 0 : _b.name;
        }
        const doc = await games_methods_1.database.collection('/posts').add(post);
        await games_methods_1.database.doc(`/posts/${doc.id}`).update({ pid: doc.id });
        return res
            .status(200)
            .json({ message: `Post ${doc.id} added successfully.` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.deletePost = async (request, res) => {
    var _a;
    try {
        const req = request;
        const post = await games_methods_1.database.doc(`/posts/${req.body.pid}`).get();
        if (!post.exists)
            return res.status(404).json({ error: 'Post did not found.' });
        else if (((_a = post.data()) === null || _a === void 0 ? void 0 : _a.uid) !== req.user.uid)
            return res.status(403).json({ error: 'Unauthorized.' });
        else {
            await post.ref.delete();
            return res.status(200).json({ message: 'Post deleted successfully.' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.editPost = async (request, res) => {
    var _a;
    try {
        const req = request;
        const updateData = {
            exchange: req.body.exchange,
            sell: req.body.sell,
            price: req.body.price,
            imageURL: req.body.imageURL,
            createdAt: new Date().toISOString(),
        };
        const post = await games_methods_1.database.doc(`/posts/${req.body.pid}`).get();
        if (!post.exists)
            return res.status(404).json({ error: 'Post did not found.' });
        else if (((_a = post.data()) === null || _a === void 0 ? void 0 : _a.uid) !== req.user.uid)
            return res.status(403).json({ error: 'Unauthorized.' });
        else {
            await post.ref.update(updateData);
            return res.status(200).json({ message: 'Post updated successfully.' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.getAllGamePosts = async (req, res) => {
    try {
        const posts = await games_methods_1.database
            .collection('/posts')
            .where('gid', '==', req.params.gid)
            .get();
        if (posts.empty)
            return res.status(404).json({ message: 'The game has no posts' });
        else {
            const data = [];
            posts.forEach((doc) => {
                data.push(doc.data());
            });
            return res.status(200).json({ posts: data });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.getAllUserPosts = async (req, res) => {
    try {
        const posts = await games_methods_1.database
            .collection('/posts')
            .where('uid', '==', req.params.uid)
            .get();
        if (posts.empty)
            return res.status(404).json({ message: 'The game has no posts' });
        else {
            const data = [];
            posts.forEach((doc) => {
                data.push(doc.data());
            });
            return res.status(200).json({ posts: data });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await games_methods_1.database
            .collection('/posts')
            .orderBy('createdAt', 'desc')
            .get();
        if (posts.empty)
            return res.status(404).json({ error: 'There are no posts.' });
        else {
            const data = [];
            posts.forEach((doc) => {
                data.push(doc.data());
            });
            return res.status(200).json({ posts: data });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
};
//# sourceMappingURL=posts_methods.js.map