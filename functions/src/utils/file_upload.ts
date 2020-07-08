import { RequestCustom } from './project_methods';
import { database } from '../index';
import Busboy = require('busboy');
import path = require('path');
import os = require('os');
import fs = require('fs');
import admin = require('firebase-admin');

export const changeProfileImage = async (request, res) => {
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
      await database.doc(`users/${req.user.handle}`).update({ imageURL });
      return res.json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.code });
    }
  });

  busboy.end(req.rawBody);
};
