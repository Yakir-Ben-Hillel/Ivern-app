import { RequestCustom } from './user_methods';
import { EventContext } from 'firebase-functions';
import admin = require('firebase-admin');
const database = admin.firestore();

export const addChat = async (request, res) => {
  try {
    const req = request as RequestCustom;
    const participants = [req.user.uid, req.body.participant2];
    const unreadMessages = [0, 0];
    const chat = {
      participants,
      unreadMessages,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    const participant1 = await database
      .doc(`/users/${chat.participants[0]}`)
      .get();
    const participant2 = await database
      .doc(`/users/${chat.participants[1]}`)
      .get();
    if (participant1.exists && participant2.exists) {
      const doc = await database.collection('/chats').add(chat);
      await database.doc(`/chats/${doc.id}`).update({ cid: doc.id });
      const data = (await database.doc(`/chats/${doc.id}`).get()).data();
      let interlocutor: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
      if (data) {
        if (req.user.uid !== data.participants[0]) {
          interlocutor = participant1;
        } else {
          interlocutor = participant2;
        }
        const filteredChat = {
          interlocutor: interlocutor.data(),
          lastMessage: undefined,
          createdAt: data.createdAt,
          cid: data.cid,
          unreadMessages: 0,
        };
        return res.status(200).json({ ...filteredChat });
      } else return res.status(500).json({ message: 'Database error' });
    } else
      return res
        .status(400)
        .json({ error: 'One of the users does not exist.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const getChat = async (req, res) => {
  try {
    const chat = await database.doc(`/chats/${req.params.cid}`).get();
    const data = chat.data();
    if (!chat.exists || !data)
      return res.status(400).json({ error: 'Chat does not exist.' });
    let interlocutor: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
    let unreadMessages: number;
    if (req.user.uid !== data.participants[0]) {
      //Participant1 is the interlocutor.
      interlocutor = await database.doc(`/users/${data.participants[0]}`).get();
      unreadMessages = data.unreadMessages[1];
    } else {
      interlocutor = await database.doc(`/users/${data.participants[1]}`).get();
      unreadMessages = data.unreadMessages[0];
    }
    const lastText = await database
      .collection(`/chats/${data.cid}/messages`)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    const filteredChat = {
      interlocutor: interlocutor.data(),
      lastMessage: !lastText.empty ? lastText.docs[0].data() : undefined,
      createdAt: data.createdAt,
      cid: data.cid,
      unreadMessages,
    };
    return res.status(200).json({ ...filteredChat });
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
export const deleteEmptyChats = async (context: EventContext) => {
  try {
    const batch = database.batch();
    const collection = await database.collection('/chats').get();
    const array = collection.docs.map(async (chat) => {
      const messages = await database
        .collection(`/chats/${chat.id}/messages`)
        .get();
      if (messages.empty) return batch.delete(chat.ref);
      else return;
    });
    await Promise.all(array);
    return await batch.commit();
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};
export const chatMessagesHasBeenRead = async (req, res) => {
  try {
    const chat = await database.doc(`/chats/${req.params.cid}`).get();
    if (!chat.exists)
      return res.status(400).json({ error: 'Chat does not exist.' });
    const data = chat.data();
    const participants = data?.participants;
    let unreadMessages: number[];
    if (participants[0] === req.user.uid)
      unreadMessages = [0, data?.unreadMessages[1]];
    else unreadMessages = [data?.unreadMessages[0], 0];

    await chat.ref.update({
      unreadMessages,
    });

    return res
      .status(200)
      .json({ message: 'Messages have been read successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const getAllUserChats = async (req, res) => {
  try {
    const uid = req.user.uid;
    const chats = await database
      .collection('/chats')
      .where('participants', 'array-contains', uid)
      .orderBy('lastMessage.createdAt', 'desc')
      .get();
    let counter = 0;
    const unresolved_chats = chats.docs.map(async (chat) => {
      try {
        const data = chat.data();
        let interlocutor: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
        let unreadMessages = 0;
        if (uid !== data.participants[0]) {
          interlocutor = await database
            .doc(`/users/${data.participants[0]}`)
            .get();
          unreadMessages = data.unreadMessages[1];
        } else {
          interlocutor = await database
            .doc(`/users/${data.participants[1]}`)
            .get();
          unreadMessages = data.unreadMessages[0];
        }
        const lastText = data.lastMessage;
        if (unreadMessages > 0) counter++;
        return {
          interlocutor: interlocutor.data(),
          lastMessage: lastText ? lastText : undefined,
          createdAt: data.createdAt,
          cid: data.cid,
          unreadMessages,
        };
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
      }
    });
    const resolved_chats = await Promise.all(unresolved_chats);
    return res
      .status(200)
      .json({ data: { chats: resolved_chats, unreadChats: counter } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
export const addMessage = async (req, res) => {
  try {
    let message;
    if (req.body.imageURL)
      message = {
        sender: req.user.uid,
        receiver: req.body.receiver,
        text: req.body.text,
        imageURL: req.body.imageURL,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      };
    else
      message = {
        sender: req.user.uid,
        receiver: req.body.receiver,
        text: req.body.text,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      };
    const chat = await database.doc(`/chats/${req.params.cid}`).get();
    if (!chat.exists)
      return res.status(400).json({ error: 'Chat does not exist.' });
    const data = chat.data();

    await database
      .collection(`/chats/${req.params.cid}/messages`)
      .doc()
      .set(message);
    let unreadMessages: number[];
    if (data?.participants[0] === req.body.receiver) {
      unreadMessages = [data?.unreadMessages[0] + 1, data?.unreadMessages[1]];
    } else {
      unreadMessages = [data?.unreadMessages[0], data?.unreadMessages[1] + 1];
    }

    await chat.ref.update({
      unreadMessages,
      lastMessage: message,
    });
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
      .orderBy('createdAt', 'asc')
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
export const resetUserUnreadMessages = async (req, res) => {
  try {
    const chat = await database.doc(`/chats/${req.params.cid}`).get();
    if (!chat.exists)
      return res.status(400).json({ error: 'Chat does not exist.' });
    const data = chat.data();

    const array = data?.participants;
    if (array[0].uid === req.body.receiver)
      array[0] = {
        uid: array[0].uid,
        unreadMessages: 0,
      };
    else
      array[1] = {
        uid: array[1].uid,
        unreadMessages: 0,
      };
    await chat.ref.update({
      participants: array,
    });
    return res.status(200).json({ message: 'unreadMessages has been reset.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
