import { IGDB_API_KEY } from '../firebase';
import { RequestCustom } from './project_methods';
import admin = require('firebase-admin');
export const database = admin.firestore();

const axios = require('axios');
export const postAllPS4games = async (req, res) => {
  try {
    const doc = await axios({
      url: 'https://api-v3.igdb.com/games',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'user-key': IGDB_API_KEY,
      },
      data:
        'fields name,cover,slug,popularity,rating;sort rating_count desc;limit 500;where (category = 0)&(rating_count>=30)& ((platforms = [48,6])|(platforms = 48));',
    });
    const batch = database.batch();
    doc.data.forEach((game) => {
      batch.set(database.collection('/games').doc(), game);
    });
    await batch.commit();
    return res.status(200).json({ message: 'Games added successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const searchGameInDatabase = async (req, res) => {
  try {
    const name = req.params.gameName.toLowerCase().replace(/ /g, '-'); //Make the given name a slug.
    const gamesCollectionFromDatabase = await database
      .collection('/games')
      .where('slug', '>=', name)
      .orderBy('slug', 'asc')
      .limit(10)
      .get();
    //Unwanted data is coming as well from the database, filtering required.
    const games = gamesCollectionFromDatabase.docs.filter((game) =>
      game.data().slug.includes(name)
    );
    if (games.length > 0) {
      const gamesData: any[] = [];
      games.forEach((game) => {
        gamesData.push(game.data());
      });
      return res.status(200).json({ games: gamesData });
    } else return res.status(400).json({ message: 'No games has been found.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const searchUnfoundGame = async (req, res) => {
  try {
    const doc = await axios({
      url: 'https://api-v3.igdb.com/games',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'user-key': IGDB_API_KEY,
      },
      data: `fields name,cover,slug,popularity,rating;search "${req.params.gameName}";where (category = 0)&(popularity > 1)&((platforms = [48,6])|(platforms = 48));`,
    });
    if (!doc)
      return res
        .status(400)
        .json({ message: 'Game does not found,try with a different name.' });
    else return res.status(200).json(doc.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const addGameToDatabase = async (req, res) => {
  try {
    const game = {
      id: req.body.id,
      cover: req.body.cover,
      name: req.body.name,
      popularity: req.body.popularity,
      rating: req.body.rating,
      slug: req.body.slug,
    };
    const doc = await database.doc(`/games/${game.id}`).get();
    if (doc.exists)
      return res
        .status(400)
        .json({ message: 'The game already exists in the database!' });
    else {
      const madeGame = await database.collection('/games').add(game);
      return res
        .status(200)
        .json({ message: `Game ${madeGame.id} has been added successfully.` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
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
    let post = {
      gid: req.body.gid,
      uid: req.user.uid,
      platform: req.body.platform,
      exchange: req.body.exchange,
      sell: req.body.sell,
      price: req.body.price,
      imageURL: req.body.imageURL,
      createdAt: new Date().toISOString(),
    };
    if (post.imageURL === null) {
      const image = await axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': IGDB_API_KEY,
        },
        data: `fields url;where id=${req.body.gid};`,
      });
      const imageURL = image.url.replace('thumb', 'logo_med');
      post.imageURL = imageURL;
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
    return res.status(200).json({ posts: posts.docs });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
