import { RequestCustom } from './project_methods';
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
      url: 'http://localhost:5000/ivern-app/europe-west3/api/image',
      method: 'POST',
      headers: req.headers,
    });
    if (doc.success === true) {
      const imageURL = doc.imageURL;
      await database.doc(`users/${req.user.uid}`).update({ imageURL });
      return res.status(201).json({ message: 'Image uploaded successfully.' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const uploadImage = async (request, res) => {
  console.log('im here 1');
  const req = request as RequestCustom;
  let isValid = true;
  let imageFileName;
  console.log('im here before that');
  let imageToBeUploaded: { filepath: string; mimetype: string };
  console.log('im here after that!');
  const busboy = new Busboy({ headers: req.headers });
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log('im here 2');
    if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
      const imageExtension = filename.split('.')[
        filename.split('.').length - 1
      ];
      imageFileName = `${Math.round(
        Math.random() * 100000000000
      )}.${imageExtension}`;
      console.log('im here 3');
      console.log(os.tmpdir());
      const filepath = path.join(os.tmpdir(), imageFileName);
      console.log(filepath);
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
      return res.status(500).json({ error: error.code, success: false });
    }
  });

  busboy.end(() => req.rawBody);
};
