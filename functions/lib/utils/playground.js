"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAllPS4games = exports.database = void 0;
const admin = require("firebase-admin");
exports.database = admin.firestore();
const axios = require('axios');
const API_KEY = '828450d3fb41b178bf9e7837550c4ae2';
exports.postAllPS4games = async (req, res) => {
    try {
        const doc = await axios({
            url: 'https://api-v3.igdb.com/games',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'user-key': API_KEY,
            },
            data: 'fields name,cover,slug,popularity,rating;sort rating_count desc;limit 500;where (category = 0)&(rating_count>=30)& ((platforms = [48,6])|(platforms = 48));',
        });
        const batch = exports.database.batch();
        console.log(doc.data);
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
//# sourceMappingURL=playground.js.map