import { database } from '../index';
import admin = require('firebase-admin');
export const addMission = async (req, res) => {
  try {
    const user = await database.doc(`/users/${req.body.uid}`).get();
    const mission = {
      pid: req.body.pid,
      name: req.body.name,
      type: req.body.type,
      content: req.body.content,
      user: user.data(),
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    const data = await database.collection('/missions').add(mission);
    await database
      .collection('/missions')
      .doc(data.id)
      .update({ missionID: data.id });
    return res
      .status(200)
      .json({ message: `mission ${data.id} added successfully.` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const getMission = async (req, res) => {
  try {
    const mission = await database
      .doc(`/missions/${req.params.missionID}`)
      .get();
    if (!mission.exists)
      return res.status(404).json({ error: 'Mission not found.' });
    return res.status(200).json(mission.data());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const deleteMission = async (req, res) => {
  try {
    const missionRef = database
      .collection('/missions')
      .doc(req.params.missionID);
    const mission = await missionRef.get();
    if (!mission.exists)
      return res.status(404).json({ error: 'Mission not found.' });
    if (mission.data()?.uid !== req.user.uid)
      //only the User can delete is own missions.
      return res.status(403).json({ error: 'Unauthorized.' });
    await missionRef.delete();
    return res.status(200).json({ message: 'Mission deleted successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const getAllMissionsInProject = async (req, res) => {
  try {
    const missions: any[] = [];
    const data = await database
      .collection('/missions')
      .where('pid', '==', req.body.pid)
      .get();
    data.docs.forEach((doc) => {
      const actuallyData = doc.data();
      missions.push({
        pid: actuallyData.pid,
        name: actuallyData.name,
        user: actuallyData.user,
        type: actuallyData.type,
        content: actuallyData.content,
        createdAt: actuallyData.createdAt,
      });
    });
    return res.status(200).json(missions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
