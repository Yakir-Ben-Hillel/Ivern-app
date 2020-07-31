"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToProject = exports.addProject = void 0;
const index_1 = require("../index");
const admin = require("firebase-admin");
exports.addProject = async (request, res) => {
    const req = request;
    const project = {
        name: req.body.name,
        admin: req.user.handle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
        users: [],
    };
    try {
        const data = await index_1.database.collection('projects').add(project);
        await index_1.database.doc(`/projects/${data.id}`).update({ projectID: data.id });
        return res
            .json({ message: `Project ${data.id} added sucessesfuly ` })
            .status(200);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'something went wrong!' });
    }
};
exports.addUserToProject = async (request, res) => {
    try {
        const req = request;
        const data = await index_1.database
            .collection('users')
            .where('uid', '==', req.user.uid)
            .limit(1)
            .get();
        if (data.empty)
            return res.status(400).json({ message: 'User does not exist.' });
        else {
            await index_1.database
                .collection('/projects')
                .doc(req.body.pid)
                .update({
                users: admin.firestore.FieldValue.arrayUnion(data.docs[0].data()),
            });
            return res
                .status(200)
                .json({ message: `user ${data.docs[0].id} added sucessesfuly` });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
//# sourceMappingURL=project_methods.js.map