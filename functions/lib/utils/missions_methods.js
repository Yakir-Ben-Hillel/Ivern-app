"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.getAllCommentsInMission = exports.addCommentToMission = exports.getAllMissionsInProject = exports.deleteMission = exports.isUserInProjectAuth = exports.getMission = exports.addMission = void 0;
const index_1 = require("../index");
exports.addMission = async (request, res) => {
    var _a;
    try {
        const req = request;
        const pid = req.body.pid;
        const project = await index_1.database.collection('/projects').doc(pid).get();
        const users = (_a = project.data()) === null || _a === void 0 ? void 0 : _a.users;
        const index = users.findIndex((userIndex) => userIndex.uid === req.user.uid);
        if (index === -1)
            return res.status(403).json({ error: 'Unauthorized' });
        const user = await index_1.database.doc(`/users/${req.user.uid}`).get();
        const mission = {
            pid: req.body.pid,
            name: req.body.name,
            type: req.body.type,
            content: req.body.content,
            user: user.data(),
            createdAt: new Date().toISOString(),
        };
        const data = await index_1.database.collection('/missions').add(mission);
        await index_1.database
            .collection('/missions')
            .doc(data.id)
            .update({ missionID: data.id });
        return res
            .status(200)
            .json({ message: `mission ${data.id} added successfully.` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
exports.getMission = async (req, res) => {
    try {
        const mission = await index_1.database
            .doc(`/missions/${req.params.missionID}`)
            .get();
        if (!mission.exists)
            return res.status(404).json({ error: 'Mission not found.' });
        return res.status(200).json(mission.data());
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
exports.isUserInProjectAuth = async (req, res, next) => {
    var _a, _b;
    try {
        const mission = await index_1.database
            .collection('/missions')
            .doc(req.params.missionID)
            .get();
        if (!mission.exists)
            return res.status(404).json({ error: 'Mission not found.' });
        //Only users associated with the project can delete missions in it.
        const pid = (_a = mission.data()) === null || _a === void 0 ? void 0 : _a.pid;
        const project = await index_1.database.collection('/projects').doc(pid).get();
        const users = (_b = project.data()) === null || _b === void 0 ? void 0 : _b.users;
        const index = users.findIndex((user) => user.uid === req.user.uid);
        if (index === -1)
            return res.status(403).json({ error: 'Unauthorized' });
        else
            return next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
exports.deleteMission = async (req, res) => {
    try {
        const missionRef = index_1.database
            .collection('/missions')
            .doc(req.params.missionID);
        const mission = await missionRef.get();
        if (!mission.exists)
            return res.status(404).json({ error: 'Mission not found.' });
        const batch = index_1.database.batch();
        const comments = await index_1.database
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
exports.getAllMissionsInProject = async (req, res) => {
    var _a;
    try {
        const pid = req.body.pid;
        const project = await index_1.database.collection('/projects').doc(pid).get();
        const users = (_a = project.data()) === null || _a === void 0 ? void 0 : _a.users;
        const index = users.findIndex((userIndex) => userIndex.uid === req.user.uid);
        if (index === -1)
            return res.status(403).json({ error: 'Unauthorized' });
        const missions = [];
        const data = await index_1.database
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
exports.addCommentToMission = async (request, res) => {
    var _a;
    const req = request;
    try {
        if (req.body.comment.trim() === '')
            return res.status(400).json({ error: 'Comment can not be empty.' });
        const userWhoCommented = await index_1.database.doc(`/users/${req.user.uid}`).get();
        const mission = await index_1.database
            .doc(`/missions/${req.params.missionID}`)
            .get();
        if (!mission.exists)
            return res.status(404).json({ error: 'Mission does not exists.' });
        const comment = {
            comment: req.body.comment,
            missionID: req.params.missionID,
            pid: (_a = mission.data()) === null || _a === void 0 ? void 0 : _a.pid,
            user: userWhoCommented.data(),
            createdAt: new Date().toISOString(),
        };
        const doc = await index_1.database.collection('/comments').add(comment);
        await index_1.database.doc(`/comments/${doc.id}`).update({ commentID: doc.id });
        return res
            .status(200)
            .json({ message: `Comment ${doc.id} added successfully.` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
exports.getAllCommentsInMission = async (req, res) => {
    try {
        const comments = [];
        const data = await index_1.database
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
exports.deleteComment = async (request, res) => {
    var _a;
    const req = request;
    try {
        const missionRef = index_1.database
            .collection('/missions')
            .doc(req.params.missionID);
        const mission = await missionRef.get();
        if (!mission.exists)
            return res.status(404).json({ error: 'Mission not found.' });
        const commentRef = index_1.database
            .collection('/comments')
            .doc(req.params.commentID);
        const comment = await commentRef.get();
        if (!comment.exists)
            return res.status(404).json({ error: 'Comment not found.' });
        if (((_a = comment.data()) === null || _a === void 0 ? void 0 : _a.missionID) !== req.params.missionID)
            return res.status(400).json({
                error: 'Trying to delete a comment from a different mission.',
            });
        await commentRef.delete();
        return res.status(200).json({ message: 'Comment deleted successfully.' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
//# sourceMappingURL=missions_methods.js.map