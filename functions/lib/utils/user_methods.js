"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateListener = exports.getUser = exports.userUpdate = void 0;
const index_1 = require("../index");
const functions = require("firebase-functions");
exports.userUpdate = async (request, res) => {
    const req = request;
    const userDetails = {
        fullName: req.body.fullName,
        location: req.body.location,
    };
    const reducedDetails = {
        fullName: null,
        location: null,
    };
    if (!isEmpty(userDetails.fullName.trim()))
        reducedDetails.fullName = userDetails.fullName;
    if (!isEmpty(userDetails.location.trim()))
        reducedDetails.location = userDetails.location;
    try {
        await index_1.database.doc(`users/${req.user.handle}`).update(reducedDetails);
        return res.status(201).json({ message: 'Details added successfully.' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
exports.getUser = async (req, res) => {
    try {
        const user = await index_1.database.doc(`/users/${req.params.uid}`).get();
        if (!user.exists)
            return res.status(404).json({ error: 'User does not exist.' });
        return res.status(200).json(user.data());
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.code });
    }
};
exports.userUpdateListener = functions
    .region('europe-west3')
    .firestore.document('/users/{uid}')
    .onUpdate(async (change) => {
    const batch = index_1.database.batch();
    let docs = await index_1.database
        .collection('/projects')
        .where('users', 'array-contains', change.before.data())
        .get();
    docs.forEach(async (doc) => {
        var _a;
        const data = await index_1.database.doc(`/projects/${doc.id}`).get();
        const users = (_a = data.data()) === null || _a === void 0 ? void 0 : _a.users;
        const index = users.findIndex((item) => item.uid === change.before.data().uid);
        users.splice(index, 1);
        users.splice(index, 0, change.after.data());
        const project = index_1.database.doc(`projects/${doc.id}`);
        batch.update(project, {
            users,
        });
    });
    docs = await index_1.database
        .collection('/missions')
        .where('user.uid', '==', change.before.data().uid)
        .get();
    docs.forEach((doc) => {
        const mission = index_1.database.doc(`/missions/${doc.id}`);
        batch.update(mission, { user: change.after.data() });
    });
    docs = await index_1.database
        .collection('/comments')
        .where('user.uid', '==', change.before.data().uid)
        .get();
    docs.forEach((doc) => {
        const comment = index_1.database.doc(`/comments/${doc.id}`);
        batch.update(comment, { user: change.after.data() });
    });
    return batch.commit();
});
//# sourceMappingURL=user_methods.js.map