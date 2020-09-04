import { RequestCustom } from './user_methods';
import admin = require('firebase-admin');
const database = admin.firestore();
export const getPost = async (req, res) => {
  try {
    const post = await database.doc(`/posts/${req.params.pid}`).get();
    if (!post.exists)
      return res.status(404).json({ error: 'Post did not found' });
    else return res.status(200).json({ post: post.data() });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const addPost = async (request, res) => {
  try {
    const req = request as RequestCustom;
    const post = {
      gameName: req.body.gameName,
      gid: req.body.gid,
      uid: req.user.uid,
      description: req.body.description,
      platform: req.body.platform,
      exchange: req.body.exchange,
      sell: req.body.sell,
      price: req.body.price,
      cover: req.body.cover,
      artwork: req.body.artwork,
      area: req.body.area,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    if (
      (!post.sell && !post.exchange) ||
      post.platform === '' ||
      post.description === '' ||
      post.price <= 0
    )
      return res.status(400).json({ error: 'Bad input.' });
    const doc = await database.collection('/posts').add(post);
    await database.doc(`/posts/${doc.id}`).update({ pid: doc.id });
    return res
      .status(200)
      .json({ message: `Post ${doc.id} added successfully.`, data: post });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const deletePost = async (request, res) => {
  try {
    const req = request as RequestCustom;
    const post = await database.doc(`/posts/${req.body.pid}`).get();
    if (!post.exists)
      return res.status(404).json({ error: 'Post did not found.' });
    else if (post.data()?.uid !== req.user.uid)
      return res.status(403).json({ error: 'Unauthorized.' });
    else {
      await post.ref.delete();
      return res.status(200).json({ message: 'Post deleted successfully.' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const editPost = async (request, res) => {
  try {
    const req = request as RequestCustom;
    const updateData = {
      exchange: req.body.exchange,
      sell: req.body.sell,
      price: req.body.price,
      platform: req.body.platform,
      area: req.body.area,
      cover: req.body.cover,
    };
    const post = await database.doc(`/posts/${req.body.pid}`).get();
    if (!post.exists)
      return res.status(404).json({ error: 'Post did not found.' });
    else if (post.data()?.uid !== req.user.uid)
      return res.status(403).json({ error: 'Unauthorized.' });
    else {
      await post.ref.update(updateData);
      return res
        .status(200)
        .json({ message: 'Post updated successfully.', post: post.data() });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getAllGamePosts = async (req, res) => {
  try {
    const posts = await database
      .collection('/posts')
      .where('gid', '==', req.params.gid)
      .get();
    if (posts.empty)
      return res.status(404).json({ message: 'The game has no posts' });
    else {
      const data: any[] = [];
      posts.forEach((doc) => data.push(doc.data()));
      return res.status(200).json({ posts: data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getAllUserPosts = async (req, res) => {
  try {
    const posts = await database
      .collection('/posts')
      .where('uid', '==', req.params.uid)
      .get();
    if (posts.empty)
      return res.status(404).json({ message: 'The user has no posts' });
    else {
      const data: any[] = [];
      console.log(posts.docs.length);
      posts.docs.forEach((doc) => data.push(doc.data()));
      return res.status(200).json({ posts: data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await database
      .collection('/posts')
      .orderBy('createdAt', 'desc')
      .get();
    if (posts.empty)
      return res.status(404).json({ error: 'There are no posts.' });
    else {
      const data: any[] = [];
      posts.forEach((doc) => {
        data.push(doc.data());
      });
      return res.status(200).json({ posts: data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const getCustomPostsRequest = async (req, res) => {
  try {
    const requestedGames = req.query.games;
    const requestedArea = req.query.areas;
    if (requestedGames && requestedArea) {
      let docsRef: any;
      if (Array.isArray(requestedGames)) {
        docsRef = database
          .collection('/posts')
          .where('gid', 'in', requestedGames)
          .where('area', '==', requestedArea);
      } else {
        docsRef = database
          .collection('/posts')
          .where('gid', '==', requestedGames)
          .where('area', '==', requestedArea);
      }
      const postsRef = await docsRef.get();
      const posts: any[] = [];
      postsRef.docs.forEach((post) => {
        posts.push(post.data());
      });
      return res.status(200).json({ posts });
    } else
      return res
        .status(400)
        .json({ error: 'Games or Area are not specified.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
