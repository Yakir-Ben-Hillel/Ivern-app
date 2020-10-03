import { RequestCustom } from './user_methods';
import admin = require('firebase-admin');
const database = admin.firestore();

export const addChat = async (request, res) => {
  try {
    const req = request as RequestCustom;
    const chat = {
      participant1: req.user.uid,
      participant2: req.body.participant2,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    const participant1 = await database
      .doc(`/users/${chat.participant1}`)
      .get();
    const participant2 = await database
      .doc(`/users/${chat.participant2}`)
      .get();
    if (participant1.exists && participant2.exists) {
      const doc = await database.collection('/chats').add(chat);
      await database.doc(`/chats/${doc.id}`).update({ cid: doc.id });
      return res.status(200).json({ data: { ...chat, cid: doc.id } });
    } else
      return res
        .status(400)
        .json({ error: 'One of the users does not exist.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const deleteChat = async (req, res) => {
  try {
    const cid = req.params.cid;
    const chat = await database.doc(`/chats/${cid}`).get();
    if (!chat.exists)
      return res.status(404).json({ error: 'Chat did not found.' });
    else {
      await chat.ref.delete();
      return res.status(200).json({ message: 'Post deleted successfully.' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const getAllUserChats = async (req, res) => {
  try {
    const uid = req.user.uid;
    const docs1 = await database
      .collection('/chats')
      .where('participant1', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    const docs2 = await database
      .collection('/chats')
      .where('participant2', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();
    const chats = [...docs1.docs, ...docs2.docs];
    const unresolved_chats = chats.map(async (chat) => {
      try {
        const data = chat.data();
        let user: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
        uid !== data.participant1
          ? (user = await database.doc(`/users/${data.participant1}`).get())
          : (user = await database.doc(`/users/${data.participant2}`).get());
        const lastText = await database
          .collection(`/chats/${data.cid}/messages`)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();
        const filteredChat = {
          interlocutor: user.data(),
          message: !lastText.empty ? lastText.docs[0].data() : undefined,
          createdAt: data.createdAt,
          cid: data.cid,
        };
        return filteredChat;
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
      }
    });
    const resolved_chats = await Promise.all(unresolved_chats);
    return res.status(200).json({ data: resolved_chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const addMessage = async (req, res) => {
  try {
    const message = {
      sender: req.user.uid,
      receiver: req.body.receiver,
      text: req.body.text,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    const chatRef = await database.doc(`/chats/${req.params.cid}`).get();
    if (!chatRef.exists)
      return res.status(400).json({ error: 'Chat does not exist.' });
    await database.doc(`/chats/${req.params.cid}/messages`).set(message);
    return res.status(200).json({ data: message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const getAllChatMessages = async (req, res) => {
  try {
    const docs = await database
      .collection(`/chats/${req.params.cid}/messages`)
      .orderBy('createdAt', 'desc')
      .get();
    const messages: any[] = [];
    docs.forEach((message) => {
      messages.push(message.data());
    });
    return res.status(200).json({ data: messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
