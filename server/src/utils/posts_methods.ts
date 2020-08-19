import { RequestCustom } from './user_methods';
import { database } from './games_methods';
import { IGDB_API_KEY } from '../firebase';
const axios = require('axios');
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
      gid: req.body.gid,
      uid: req.user.uid,
      platform: req.body.platform,
      exchange: req.body.exchange,
      sell: req.body.sell,
      price: req.body.price,
      imageURL: req.body.imageURL,
      area: req.body.area,
      createdAt: new Date().toISOString(),
      gameName: null,
      artwork: null,
    };
    if ((!post.sell && !post.exchange) || post.price <= 0)
      return res.status(400).json({ error: 'Bad input.' });
    //Getting cover id from the API.
    if (post.imageURL === null) {
      const game = await database.doc(`games/${req.body.gid}`).get();
      if (!game.exists)
        res
          .status(400)
          .json({ error: 'The game does not exists in the database.' });
      const image = await axios({
        //Getting cover url and making it logo_med.
        url: 'https://api-v3.igdb.com/covers',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'user-key': IGDB_API_KEY,
        },
        data: `fields url;where id=${game.data()?.cover};`,
      });
      const imageURL: string = image.data[0].url
        .replace('thumb', 'logo_med')
        .substring(2);
      post.imageURL = imageURL;
      post.gameName = game.data()?.name;
      post.artwork = game.data()?.artwork;
    }
    const doc = await database.collection('/posts').add(post);
    await database.doc(`/posts/${doc.id}`).update({ pid: doc.id });
    return res
      .status(200)
      .json({ message: `Post ${doc.id} added successfully.` });
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
      imageURL: req.body.imageURL,
      createdAt: new Date().toISOString(),
    };
    const post = await database.doc(`/posts/${req.body.pid}`).get();
    if (!post.exists)
      return res.status(404).json({ error: 'Post did not found.' });
    else if (post.data()?.uid !== req.user.uid)
      return res.status(403).json({ error: 'Unauthorized.' });
    else {
      await post.ref.update(updateData);
      return res.status(200).json({ message: 'Post updated successfully.' });
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
      posts.forEach((doc) => {
        data.push(doc.data());
      });
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
      return res.status(404).json({ message: 'The game has no posts' });
    else {
      const data: any[] = [];
      posts.forEach(async (doc) => {
        let artwork: string | null = null;
        if (doc.data().artwork !== null) {
          const artworkDoc = await axios({
            //Getting cover url and making it logo_med.
            url: 'https://api-v3.igdb.com/artworks',
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'user-key': IGDB_API_KEY,
            },
            data: `fields image_id;where id=${doc.data()?.artwork};`,
          });
          artwork = `https://images.igdb.com/igdb/image/upload/t_1080p/${artworkDoc.data.image_id}.jpg`;
        }
        data.push({ ...doc.data(), artwork });
      });
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
