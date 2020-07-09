import { database } from '../index';
import admin = require('firebase-admin');
export const addMission = async (req, res) => {
  const mission = {
    pid: req.body.pid,
    name: req.body.name,
    type: req.body.type,
    content: req.body.content,
    uid: req.body.uid,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  try {
    const data = await database.collection('/missions').add(mission);
    await database
      .collection('/missions')
      .doc(data.id)
      .update({ missionID: data.id });
    return res
      .status(200)
      .json({ message: `mission ${data.id} added successfully.` });
  } catch (error) {
    return res.status(500).json({ error: error.code });
  }
};
