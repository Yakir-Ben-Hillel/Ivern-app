"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.changeProfileImage = void 0;
const index_1 = require("../index");
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const admin = require("firebase-admin");
const axios = require('axios');
exports.changeProfileImage = async (request, res) => {
    try {
        const req = request;
        const doc = await axios({
            url: 'http://localhost:5000/ivern-app/europe-west3/api/image',
            method: 'POST',
            headers: req.headers,
        });
        if (doc.success === true) {
            const imageURL = doc.imageURL;
            await index_1.database.doc(`users/${req.user.uid}`).update({ imageURL });
            return res.status(201).json({ message: 'Image uploaded successfully.' });
        }
        else {
            return res
                .status(500)
                .json({ error: 'File upload was corrupted, please try again.' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
};
exports.uploadImage = async (request, res) => {
    const req = request;
    let isValid = true;
    let imageFileName;
    let imageToBeUploaded;
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
            const imageExtension = filename.split('.')[filename.split('.').length - 1];
            imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
            const filepath = path.join(os.tmpdir(), imageFileName);
            imageToBeUploaded = { filepath, mimetype };
            file.pipe(fs.createWriteStream(filepath));
        }
        else
            isValid = false;
    });
    busboy.on('finish', async () => {
        try {
            if (isValid === false)
                throw new Error('Bad input type.');
            await admin
                .storage()
                .bucket()
                .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype,
                    },
                },
            });
            const imageURL = `https://firebasestorage.googleapis.com/v0/b/ivern-app.appspot.com/o/${imageFileName}?alt=media`;
            return res.json({
                message: 'Image uploaded successfully',
                imageURL,
                success: true,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.code, success: false });
        }
    });
    busboy.end();
    // busboy.end(req.rawBody);
};
//# sourceMappingURL=file_upload.js.map