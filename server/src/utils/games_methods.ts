import { IGDB_API_KEY } from '../firebase';
import admin = require('firebase-admin');
const axios = require('axios');
const database = admin.firestore();
export const postAllGames = async (req, res) => {
  try {
    let offset = 0;
    let stop = false;
    let counter = 0;
    let batch = database.batch();
    while (!stop) {
      const doc = await axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': IGDB_API_KEY,
        },
        data: `fields name,cover,artworks,slug,popularity,rating,platforms;sort rating_count desc;offset ${offset};limit 250;where (category = 0)&(rating_count>=20)& (platforms = (48,49,130));`,
      });
      if (doc.data.length !== 0) {
        // eslint-disable-next-line no-loop-func
        const docs = doc.data.map(async (game) => {
          try {
            let artwork: number | string | null = null;
            if (game.artworks) {
              artwork = game.artworks[game.artworks.length - 1];
            }
            const platforms: string[] = [];
            game.platforms.forEach((platform: number) => {
              if (platform === 48) platforms.push('playstation');
              else if (platform === 49) platforms.push('xbox');
              else if (platform === 160) platforms.push('switch');
            });
            const savedGame = {
              id: game.id,
              name: game.name,
              slug: game.slug,
              popularity: game.popularity,
              rating: game.rating,
              cover: game.cover,
              platforms,
              artwork,
            };
            counter = counter + 1;
            return batch.set(database.collection('/games').doc(), savedGame);
          } catch (error) {
            console.log(error);
            return new Error(error);
          }
        });
        await Promise.all(docs);
        await batch.commit();
        batch = database.batch();
        offset += 250;
      } else stop = true;
    }
    return res
      .status(200)
      .json({ message: 'Games added successfully', counter });
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
export const getAllGames = async (req, res) => {
  try {
    const gamesCollections = await database
      .collection('/games')
      .orderBy('rating', 'desc')
      .get();
    const gamesData = gamesCollections.docs.map((game) => {
      return game.data();
    });
    return res.status(200).json({ games: gamesData });
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
      data: `fields name,cover,artworks,slug,popularity,rating,platforms;search "${req.params.gameName}";where (category = 0)&((platforms = [48,6])|(platforms = 48));`,
    });
    if (doc.data) {
      const gameDoc = doc.data[0];
      const platforms: string[] = [];
      gameDoc.platforms.forEach((platform: number) => {
        if (platform === 48) platforms.push('playstation');
        else if (platform === 49) platforms.push('xbox');
        else if (platform === 160) platforms.push('switch');
      });
      let artwork: number | string | null = null;
      if (gameDoc.artworks) {
        artwork = gameDoc.artworks[gameDoc.artworks.length - 1];
        const artworkDoc = await axios({
          url: 'https://api-v3.igdb.com/artworks',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'user-key': IGDB_API_KEY,
          },
          data: `fields image_id;where id=${artwork};`,
        });
        artwork = `https://images.igdb.com/igdb/image/upload/t_1080p/${artworkDoc.data[0].image_id}.jpg`;
      }

      const image = await axios({
        //Getting cover url and making it logo_med.
        url: 'https://api-v3.igdb.com/covers',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': IGDB_API_KEY,
        },
        data: `fields url;where id=${gameDoc.cover};`,
      });
      const cover: string =
        'https://' +
        image.data[0].url.replace('thumb', 'logo_med').substring(2);

      const savedGame = {
        id: gameDoc.id,
        name: gameDoc.name,
        slug: gameDoc.slug,
        popularity: gameDoc.popularity ? gameDoc.popularity : 0,
        rating: gameDoc.rating ? gameDoc.rating : 0,
        artwork,
        cover,
        platforms,
      };
      const docRef = database.collection('/games').doc();
      await docRef.set(savedGame);
      const game = (await docRef.get()).data();
      return res.status(200).json({ data: game });
    } else
      return res
        .status(400)
        .json({ message: 'Game does not found,try with a different name.' });
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
      return res.status(200).json({
        message: `Game ${madeGame.id} has been added successfully.`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export const updateGames = async (context) => {
  try {
    let offset = 0;
    let stop = false;
    let counter = 0;
    let batch = database.batch();
    while (!stop) {
      const doc = await axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': IGDB_API_KEY,
        },
        data: `fields name,cover,artworks,slug,popularity,rating,platforms;sort rating_count desc;offset ${offset};limit 250;where (category = 0)&(rating_count>=20)& (platforms = (48,49,130));`,
      });
      if (doc.data.length > 0) {
        // eslint-disable-next-line no-loop-func
        const docs = doc.data.map(async (game) => {
          let artwork: number | string | null = null;
          if (game.artworks) {
            artwork = game.artworks[game.artworks.length - 1];
          }
          const platforms: string[] = [];
          game.platforms.forEach((platform: number) => {
            if (platform === 48) platforms.push('playstation');
            else if (platform === 49) platforms.push('xbox');
            else if (platform === 160) platforms.push('switch');
          });

          const savedGame = {
            id: game.id,
            name: game.name,
            slug: game.slug,
            popularity: game.popularity ? game.popularity : 0,
            rating: game.rating,
            cover: game.cover,
            artwork,
            platforms,
          };

          const gameDoc = await database
            .collection(`/games`)
            .where('id', '==', savedGame.id)
            .limit(1)
            .get();
          if (!gameDoc.empty)
            return batch.update(
              database.doc(`/games/${gameDoc.docs[0].id}`),
              savedGame
            );
          else {
            counter++;
            return batch.set(database.collection('/games').doc(), savedGame);
          }
        });
        await Promise.all(docs);
        await batch.commit();
        batch = database.batch();
        offset += 250;
      } else stop = true;
    }
    await axios({
      url: 'https://europe-west3-ivern-app.cloudfunctions.net/api/games/covers',
      method: 'POST',
    });
    await axios({
      url:
        'https://europe-west3-ivern-app.cloudfunctions.net/api/games/artworks',
      method: 'POST',
    });
    return 'Games updated successfully, ' + counter + ' games added.';
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};
export const updateArtworks = async (req, res) => {
  try {
    const games = await database.collection('/games').get();
    const docs = games.docs.map(async (game) => {
      try {
        const gameData = game.data();
        if (gameData.artwork && typeof gameData.artwork === 'number') {
          const artworkDoc = await axios({
            url: 'https://api-v3.igdb.com/artworks',
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'user-key': IGDB_API_KEY,
            },
            data: `fields image_id;where id=${gameData.artwork};`,
          });
          const artwork = `https://images.igdb.com/igdb/image/upload/t_1080p/${artworkDoc.data[0].image_id}.jpg`;
          return await game.ref.update({ artwork });
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    });
    await Promise.all(docs);
    return res.status(200).json({ message: 'Artworks updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const updateCovers = async (req, res) => {
  try {
    const games = await database.collection('/games').get();
    const docs = games.docs.map(async (game) => {
      try {
        const gameData = game.data();
        if (typeof gameData.cover === 'number') {
          const image = await axios({
            //Getting cover url and making it logo_med.
            url: 'https://api-v3.igdb.com/covers',
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'user-key': IGDB_API_KEY,
            },
            data: `fields url;where id=${gameData.cover};`,
          });
          const cover: string =
            'https://' +
            image.data[0].url.replace('thumb', 'logo_med').substring(2);
          return await game.ref.update({ cover });
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    });
    await Promise.all(docs);
    return res.status(200).json({ message: 'Covers updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const manualUpdateGames = async (req, res) => {
  try {
    let offset = 0;
    let stop = false;
    let batch = database.batch();
    while (!stop) {
      const doc = await axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': IGDB_API_KEY,
        },
        data: `fields name,cover,artworks,slug,popularity,rating,platforms;sort rating_count desc;offset ${offset};limit 250;where (category = 0)&(rating_count>=10)& (platforms = (48,49,130));`,
      });
      if (doc.data.length > 0) {
        // eslint-disable-next-line no-loop-func
        const docs: any[] = doc.data.map(async (game) => {
          let artwork: number | string | null = null;
          if (game.artworks) {
            artwork = game.artworks[game.artworks.length - 1];
          }
          const platforms: string[] = [];
          game.platforms.forEach((platform: number) => {
            if (platform === 48) platforms.push('playstation');
            else if (platform === 49) platforms.push('xbox');
            else if (platform === 160) platforms.push('switch');
          });
          const savedGame = {
            id: game.id,
            name: game.name,
            slug: game.slug,
            popularity: game.popularity ? game.popularity : 0,
            rating: game.rating,
            cover: game.cover,
            artwork,
            platforms,
          };

          const gameDoc = await database
            .collection(`/games`)
            .where('id', '==', savedGame.id)
            .limit(1)
            .get();

          if (!gameDoc.empty) {
            return batch.update(
              database.doc(`/games/${gameDoc.docs[0].id}`),
              savedGame
            );
          } else {
            return batch.set(database.collection('/games').doc(), savedGame);
          }
        });
        await Promise.all(docs);
        await batch.commit();
        batch = database.batch();
        offset += 250;
      } else stop = true;
    }
    await axios({
      url: 'https://europe-west3-ivern-app.cloudfunctions.net/api/games/covers',
      method: 'POST',
    });
    await axios({
      url:
        'https://europe-west3-ivern-app.cloudfunctions.net/api/games/artworks',
      method: 'POST',
    });
    return res
      .status(200)
      .json({ message: 'update has been made successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
