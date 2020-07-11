import { database } from '../index';
import { RequestCustom } from './project_methods';
export const addMission = async (request, res) => {
  try {
    const req = request as RequestCustom;
    const pid = req.body.pid;
    const project = await database.collection('/projects').doc(pid).get();
    const users: any[] = project.data()?.users;
    const index = users.findIndex(
      (userIndex) => userIndex.uid === req.user.uid
    );
    if (index === -1) return res.status(403).json({ error: 'Unauthorized' });

    const user = await database.doc(`/users/${req.user.uid}`).get();
    const mission = {
      pid: req.body.pid,
      name: req.body.name,
      type: req.body.type,
      content: req.body.content,
      user: user.data(),
      createdAt: new Date().toISOString(),
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
export const isUserInProjectAuth = async (req, res, next) => {
  try {
    const mission = await database
      .collection('/missions')
      .doc(req.params.missionID)
      .get();
    if (!mission.exists)
      return res.status(404).json({ error: 'Mission not found.' });
    //Only users associated with the project can delete missions in it.
    const pid = mission.data()?.pid;
    const project = await database.collection('/projects').doc(pid).get();
    const users: any[] = project.data()?.users;
    const index = users.findIndex((user) => user.uid === req.user.uid);
    if (index === -1) return res.status(403).json({ error: 'Unauthorized' });
    else return next();
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
    const batch = database.batch();
    const comments = await database
      .collection('/comments')
      .where('missionID', '==', req.params.missionID)
      .get();
    comments.forEach((comment) => {
      batch.delete(comment.ref);
    });
    batch.delete(missionRef);
    await batch.commit();
    return res
      .status(200)
      .json({
        message: 'Mission and all his comments has been deleted successfully.',
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const getAllMissionsInProject = async (req, res) => {
  try {
    const pid = req.body.pid;
    const project = await database.collection('/projects').doc(pid).get();
    const users: any[] = project.data()?.users;
    const index = users.findIndex(
      (userIndex) => userIndex.uid === req.user.uid
    );
    if (index === -1) return res.status(403).json({ error: 'Unauthorized' });

    const missions: any[] = [];
    const data = await database
      .collection('/missions')
      .where('pid', '==', pid)
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
export const addCommentToMission = async (request, res) => {
  const req = request as RequestCustom;
  try {
    if (req.body.comment.trim() === '')
      return res.status(400).json({ error: 'Comment can not be empty.' });
    const userWhoCommented = await database.doc(`/users/${req.user.uid}`).get();
    const mission = await database
      .doc(`/missions/${req.params.missionID}`)
      .get();
    if (!mission.exists)
      return res.status(404).json({ error: 'Mission does not exists.' });
    const comment = {
      comment: req.body.comment,
      missionID: req.params.missionID,
      pid: mission.data()?.pid,
      user: userWhoCommented.data(),
      createdAt: new Date().toISOString(),
    };
    const doc = await database.collection('/comments').add(comment);
    await database.doc(`/comments/${doc.id}`).update({ commentID: doc.id });
    return res
      .status(200)
      .json({ message: `Comment ${doc.id} added successfully.` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const getAllCommentsInMission = async (req, res) => {
  try {
    const comments: any = [];
    const data = await database
      .collection('/comments')
      .where('missionID', '==', req.params.missionID)
      .get();
    data.docs.forEach((doc) => {
      const docData = doc.data();
      comments.push({
        comment: docData.comment,
        missionID: docData.missionID,
        user: docData.user,
        createdAt: docData.createdAt,
      });
    });
    return res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const deleteComment = async (request, res) => {
  const req = request as RequestCustom;
  try {
    const missionRef = database
      .collection('/missions')
      .doc(req.params.missionID);
    const mission = await missionRef.get();
    if (!mission.exists)
      return res.status(404).json({ error: 'Mission not found.' });
    const commentRef = database
      .collection('/comments')
      .doc(req.params.commentID);
    const comment = await commentRef.get();
    if (!comment.exists)
      return res.status(404).json({ error: 'Comment not found.' });
    if (comment.data()?.missionID !== req.params.missionID)
      return res.status(400).json({
        error: 'Trying to delete a comment from a different mission.',
      });
    await commentRef.delete();
    return res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
