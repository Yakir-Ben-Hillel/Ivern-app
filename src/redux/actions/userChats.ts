import axios from 'axios';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  SetChatsAction,
  SetMessagesAction,
  AddChatAction,
  AddMessageAction,
  DeleteChatAction,
  LoadingChatsAction,
  LoadingMessagesAction,
  HandleChatOpenAction,
  SetSelectedChatAction,
} from '../../@types/action-types';
import { Chat, Message } from '../../@types/types';
import { firebase } from '../../firebase';

export const startSetChats = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadingChats(true));
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const res = await axios.get(
      'https://europe-west3-ivern-app.cloudfunctions.net/api/chat/user',
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    console.log(res.data);
    dispatch(loadingChats(false));
    return dispatch(setChats(res.data.data));
  };
};
const setChats = (chats: Chat[]): SetChatsAction => {
  return {
    type: 'SET_CHATS',
    chats,
  };
};
export const startAddNewChat = (interlocutorUID: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const interlocutorRes = await axios.get(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/user/${interlocutorUID}`
    );
    const chatMakeRes = await axios.post(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/chat`,
      {
        participant2: interlocutorRes.data.uid,
      },
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(addNewChat(chatMakeRes.data.data));
  };
};
const addNewChat = (chat: Chat): AddChatAction => {
  return {
    type: 'ADD_CHAT',
    chat,
  };
};
export const startDeleteChat = (cid: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    await axios.delete(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/chat/delete/${cid}`,
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(deleteChat(cid));
  };
};
const deleteChat = (cid: string): DeleteChatAction => {
  return {
    type: 'DELETE_CHAT',
    cid,
  };
};
export const startSetMessages = (cid: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const messagesRes = await axios.get(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/chat/messages/get/${cid}`,
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(setMessages(messagesRes.data, cid));
  };
};
const setMessages = (messages: Message[], cid: string): SetMessagesAction => {
  return {
    type: 'SET_MESSAGES',
    cid,
    messages,
  };
};
export const startAddMessage = (
  receiver: string,
  text: string,
  cid: string
) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const messageRes = await axios.post(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/chat/messages/add/${cid}`,
      {
        receiver,
        text,
      },
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(addMessage(messageRes.data, cid));
  };
};
export const setSelectedChat = (chat?: Chat): SetSelectedChatAction => {
  return {
    type: 'SET_SELECTED_CHAT',
    selectedChat: chat,
  };
};
const addMessage = (message: Message, cid: string): AddMessageAction => {
  return {
    type: 'ADD_MESSAGE',
    cid,
    message,
  };
};
export const loadingChats = (loadingChats: boolean): LoadingChatsAction => {
  return {
    type: 'LOADING_CHATS',
    loadingChats,
  };
};
export const loadingMessages = (
  loadingMessages: boolean
): LoadingMessagesAction => {
  return {
    type: 'LOADING_MESSAGES',
    loadingMessages,
  };
};
export const handleChatOpen = (open: boolean): HandleChatOpenAction => {
  return {
    type: 'HANDLE_CHAT_OPEN',
    open,
  };
};
