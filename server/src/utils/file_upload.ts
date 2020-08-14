import { RequestCustom } from './user_methods';
import { database } from '../index';
import Busboy = require('busboy');
import path = require('path');
import os = require('os');
import fs = require('fs');
import admin = require('firebase-admin');
const axios = require('axios');
export const changeProfileImage = async (request, res) => {
  try {
    const req = request as RequestCustom;
    const doc = await axios({
      url: 'https://europe-west3-ivern-app.cloudfunctions.net/api/image',
      method: 'POST',
      headers: req.headers,
    });

    if (doc.success === true) {
      const imageURL = doc.imageURL;
      await database.doc(`users/${req.user.uid}`).update({ imageURL });
      return res.status(201).json({ message: 'Image uploaded successfully.' });
    } else {
      return res
        .status(500)
        .json({ error: 'File upload was corrupted, please try again.' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const uploadImage = async (request, res) => {
  const req = request as RequestCustom;
  let isValid = true;
  let imageFileName;
  let imageToBeUploaded: { filepath: string; mimetype: string };
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
      const imageExtension = filename.split('.')[
        filename.split('.').length - 1
      ];
      imageFileName = `${Math.round(
        Math.random() * 100000000000
      )}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    } else isValid = false;
  });

  busboy.on('finish', async () => {
    try {
      if (isValid === false) throw new Error('Bad input type.');
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
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error, success: false, rawBody: req.rawBody });
    }
  });
  if (req.rawBody) busboy.end(req.rawBody);
  else busboy.end();
};
