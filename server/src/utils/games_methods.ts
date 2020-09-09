import { IGDB_API_KEY } from '../firebase';
import admin = require('firebase-admin');
const axios = require('axios');
const database = admin.firestore();
export const postAllGames = async (req, res) => {
  try {
    let offset = 0;
    let stop = false;
    while (!stop) {
      const doc = await axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': IGDB_API_KEY,
        },
        data: `fields name,cover,artworks,slug,popularity,rating,platforms;sort rating_count desc;offset ${offset};limit 500;where (category = 0)&(rating_count>=20)& (platforms = (48,49,130));`,
      });
      if (doc.data.length !== 0) {
        doc.data.forEach(async (game) => {
          const resGame = await database.doc(`/games/${game.id}`).get();
          if (!resGame.exists) {
            let artwork: number | string | null = null;
            if (game.artworks) {
              artwork = game.artworks[game.artworks.length - 1];
            }
            const image = await axios({
              //Getting cover url and making it logo_med.
              url: 'https://api-v3.igdb.com/covers',
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'user-key': IGDB_API_KEY,
              },
              data: `fields url;where id=${game.cover};`,
            });
            const cover: string =
              'https://' +
              image.data[0].url.replace('thumb', 'logo_med').substring(2);
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
              cover,
              platforms,
              artwork,
            };
            await database.collection('/games').doc().set(savedGame);
          }
        });
        offset += 500;
      } else stop = true;
    }
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
export const getAllGames = async (req, res) => {
  try {
    const gamesCollections = await database
      .collection('/games')
      .orderBy('rating', 'desc')
      .get();
    const gamesData: any[] = [];
    gamesCollections.forEach((game) => {
      gamesData.push(game.data());
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
    const batch = database.batch();
    while (!stop) {
      const doc = await axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': IGDB_API_KEY,
        },
        data: `fields name,cover,artworks,slug,popularity,rating,platforms;sort rating_count desc;offset ${offset};limit 500;where (category = 0)&(rating_count>=20)& (platforms = (48,49,130));`,
      });
      if (doc.data.length > 0) {
        // eslint-disable-next-line no-loop-func
        doc.data.forEach(async (game) => {
          let artwork: number | string | null = null;
          if (game.artworks) {
            artwork = game.artworks[game.artworks.length - 1];
          }
          if (artwork) {
            const artworkDoc = await axios({
              //Getting cover url and making it logo_med.
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
            artwork,
            platforms,
          };

          const gameDoc = await database.doc(`/games/${game.id}`).get();
          if (gameDoc.exists)
            batch.update(database.doc(`/games/${game.id}`), savedGame);
          else {
            batch.set(database.collection('/games').doc(), savedGame);
            counter++;
          }
        });
        offset += 500;
      } else stop = true;
    }
    console.log('Games updated successfully, ' + counter + ' games added.');
    return await batch.commit();
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};
export const updateArtworks = async (req, res) => {
  try {
    const games = await database.collection('/games').get();
    games.docs.forEach(async (game) => {
      try {
        const gameData = game.data();
        if (gameData.artwork) {
          const artworkDoc = await axios({
            //Getting cover url and making it logo_med.
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
    return res.status(200).json({ message: 'Artworks updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const updateGamesFunc = async (req, res) => {
  try {
    let offset = 0;
    let stop = false;
    while (!stop) {
      const doc = await axios({
        url: 'https://api-v3.igdb.com/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'user-key': IGDB_API_KEY,
        },
        data: `fields name,cover,artworks,slug,popularity,rating,platforms;sort rating_count desc;offset ${offset};limit 500;where (category = 0)&(rating_count>=20)& (platforms = (48,49,130));`,
      });
      if (doc.data.length > 0) {
        doc.data.forEach(async (game) => {
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
          const image = await axios({
            //Getting cover url and making it logo_med.
            url: 'https://api-v3.igdb.com/covers',
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'user-key': IGDB_API_KEY,
            },
            data: `fields url;where id=${game.cover};`,
          });
          const cover: string =
            'https://' +
            image.data[0].url.replace('thumb', 'logo_med').substring(2);
          if (artwork) {
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
          const savedGame = {
            id: game.id,
            name: game.name,
            slug: game.slug,
            popularity: game.popularity,
            rating: game.rating,
            cover: cover,
            artwork: artwork,
          };

          const gameDoc = await database
            .collection('/games')
            .where('id', '==', game.id)
            .limit(1)
            .get();
          if (!gameDoc.empty) {
            await database
              .doc(`/games/${gameDoc.docs[0].id}`)
              .update(savedGame);
          } else {
            await database.collection('/games').doc().set(savedGame);
          }
        });
        offset += 500;
      } else stop = true;
    }
    return res
      .status(200)
      .json({ message: 'update has been made successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
