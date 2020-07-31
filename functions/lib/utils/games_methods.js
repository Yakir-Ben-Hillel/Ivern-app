"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGamesFunc = exports.updateGames = exports.addGameToDatabase = exports.searchUnfoundGame = exports.getAllGames = exports.searchGameInDatabase = exports.postAllPS4games = exports.database = void 0;
const firebase_1 = require("../firebase");
const admin = require("firebase-admin");
exports.database = admin.firestore();
const axios = require('axios');
exports.postAllPS4games = async (req, res) => {
    try {
        const doc = await axios({
            url: 'https://api-v3.igdb.com/games',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'user-key': firebase_1.IGDB_API_KEY,
            },
            data: 'fields name,cover,slug,popularity,rating;sort rating_count desc;limit 500;where (category = 0)&(rating_count>=30)& ((platforms = [48,6])|(platforms = 48));',
        });
        const batch = exports.database.batch();
        doc.data.forEach((game) => {
            batch.set(exports.database.collection('/games').doc(), game);
        });
        await batch.commit();
        return res.status(200).json({ message: 'Games added successfully' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.searchGameInDatabase = async (req, res) => {
    try {
        const name = req.params.gameName.toLowerCase().replace(/ /g, '-'); //Make the given name a slug.
        const gamesCollectionFromDatabase = await exports.database
            .collection('/games')
            .where('slug', '>=', name)
            .orderBy('slug', 'asc')
            .limit(10)
            .get();
        //Unwanted data is coming as well from the database, filtering required.
        const games = gamesCollectionFromDatabase.docs.filter((game) => game.data().slug.includes(name));
        if (games.length > 0) {
            const gamesData = [];
            games.forEach((game) => {
                gamesData.push(game.data());
            });
            return res.status(200).json({ games: gamesData });
        }
        else
            return res.status(400).json({ message: 'No games has been found.' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.getAllGames = async (req, res) => {
    try {
        const gamesCollections = await exports.database
            .collection('/games')
            .orderBy('rating', 'desc')
            .get();
        const gamesData = [];
        gamesCollections.forEach((game) => {
            gamesData.push(game.data());
        });
        return res.status(200).json({ games: gamesData });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.searchUnfoundGame = async (req, res) => {
    try {
        const doc = await axios({
            url: 'https://api-v3.igdb.com/games',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'user-key': firebase_1.IGDB_API_KEY,
            },
            data: `fields name,cover,slug,popularity,rating;search "${req.params.gameName}";where (category = 0)&(popularity > 1)&((platforms = [48,6])|(platforms = 48));`,
        });
        if (!doc)
            return res
                .status(400)
                .json({ message: 'Game does not found,try with a different name.' });
        else
            return res.status(200).json(doc.data);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.addGameToDatabase = async (req, res) => {
    try {
        const game = {
            id: req.body.id,
            cover: req.body.cover,
            name: req.body.name,
            popularity: req.body.popularity,
            rating: req.body.rating,
            slug: req.body.slug,
        };
        const doc = await exports.database.doc(`/games/${game.id}`).get();
        if (doc.exists)
            return res
                .status(400)
                .json({ message: 'The game already exists in the database!' });
        else {
            const madeGame = await exports.database.collection('/games').add(game);
            return res.status(200).json({
                message: `Game ${madeGame.id} has been added successfully.`,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.updateGames = async (context) => {
    try {
        const doc = await axios({
            url: 'https://api-v3.igdb.com/games',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'user-key': firebase_1.IGDB_API_KEY,
            },
            data: 'fields name,cover,slug,popularity,rating;sort rating_count desc;limit 500;where (category = 0)&(rating_count>=30)& ((platforms = [48,6])|(platforms = 48));',
        });
        const batch = exports.database.batch();
        let counter = 0;
        doc.data.forEach(async (game) => {
            const image = await axios({
                //Getting cover url and making it logo_med.
                url: 'https://api-v3.igdb.com/covers',
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'user-key': firebase_1.IGDB_API_KEY,
                },
                data: `fields url;where id=${game.cover};`,
            });
            const imageURL = image.data[0].url
                .replace('thumb', 'logo_med')
                .substring(2);
            const gameDoc = await exports.database.doc(`/games/${game.id}`).get();
            if (gameDoc.exists)
                batch.update(exports.database.doc(`/games/${game.id}`), Object.assign(Object.assign({}, game), { imageURL }));
            else {
                batch.set(exports.database.collection('/games').doc(), Object.assign(Object.assign({}, game), { imageURL }));
                counter++;
            }
        });
        console.log('Games updated successfully, ' + counter + ' games added.');
        return await batch.commit();
    }
    catch (error) {
        console.log(error);
        return new Error(error);
    }
};
exports.updateGamesFunc = async (req, res) => {
    try {
        const doc = await axios({
            url: 'https://api-v3.igdb.com/games',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'user-key': firebase_1.IGDB_API_KEY,
            },
            data: 'fields name,cover,slug,popularity,rating;sort rating_count desc;limit 500;where (category = 0)&(rating_count>=30)& ((platforms = [48,6])|(platforms = 48));',
        });
        doc.data.forEach(async (game) => {
            const image = await axios({
                //Getting cover url and making it logo_med.
                url: 'https://api-v3.igdb.com/covers',
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'user-key': firebase_1.IGDB_API_KEY,
                },
                data: `fields url;where id=${game.cover};`,
            });
            const imageURL = image.data[0].url
                .replace('thumb', 'logo_med')
                .substring(2);
            const gameDoc = await exports.database
                .collection('/games')
                .where('id', '==', game.id)
                .limit(1)
                .get();
            if (!gameDoc.empty) {
                await exports.database
                    .doc(`/games/${gameDoc.docs[0].id}`)
                    .update(Object.assign(Object.assign({}, game), { imageURL }));
            }
            else {
                await exports.database
                    .collection('/games')
                    .doc()
                    .set(Object.assign(Object.assign({}, game), { imageURL }));
            }
        });
        return res
            .status(200)
            .json({ message: 'update has been made successfully.' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
};
//# sourceMappingURL=games_methods.js.map