import admin = require('firebase-admin');
export const database = admin.firestore();

const axios = require('axios');
export const postAllPS4games = async (req, res) => {
  try {
    let address = `https://api.rawg.io/api/games?exclude_additions=true&platforms=18&&stores=3`;
    const games: { id: string; name: string; rating: string }[] = [];
    while (address !== null) {
      // eslint-disable-next-line no-loop-func
      const doc = await axios.get(address);
      doc.data.results.forEach((game) => {
        if (
          game.rating > 3.0 &&
          !game.genres.some((genre) => genre.slug === 'indie') &&
          !game.platforms.some(
            (plat) =>
              plat.platform.slug ===
              ('ios' || 'android' || 'ps-vita' || 'nintendo-3ds')
          )
        ) {
          console.log({ id: game.id, name: game.name, rating: game.rating });
          games.push({ id: game.id, name: game.name, rating: game.rating });
        }
      });
      address = doc.data.next;
    }
    const obj = { content: games };
    const response = await database.collection('games').add(obj);
    return res
      .status(200)
      .json({ message: `list of games ${response.id} added successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
