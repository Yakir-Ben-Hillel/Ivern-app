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
  SetUnreadChatsAction,
  SetUnreadMessagesAction,
  SetNewChatText,
} from '../../@types/action-types';
import { AppState, Chat, Message } from '../../@types/types';
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
    dispatch(setUnreadChats(res.data.data.unreadChats));
    dispatch(loadingChats(false));
    return dispatch(setChats(res.data.data.chats));
  };
};
export const setChats = (chats: Chat[]): SetChatsAction => {
  return {
    type: 'SET_CHATS',
    chats,
  };
};
export const startAddNewExistingChat = (cid: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const chatRes = await axios.get(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/chat/${cid}`,
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(addNewChat(chatRes.data));
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
    return dispatch(addNewChat(chatMakeRes.data));
  };
};
const addNewChat = (chat: Chat): AddChatAction => {
  return {
    type: 'ADD_CHAT',
    new: true,
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
    dispatch(loadingMessages(true));
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const messagesRes = await axios.get(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/chat/messages/get/${cid}`,
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(setMessages(messagesRes.data.data));
  };
};
export const setMessages = (messages?: Message[]): SetMessagesAction => {
  return {
    type: 'SET_MESSAGES',
    messages,
  };
};
export const startAddMessage = (
  receiver: string,
  text: string,
  cid: string,
  imageURL?: string
) => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => AppState
  ) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const messageRes = await axios.post(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/chat/messages/add/${cid}`,
      {
        receiver,
        text,
        imageURL,
      },
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    const state = getState();
    const index = state.userChats.chats.findIndex((chat) => chat.cid === cid);
    const chats = state.userChats.chats;
    chats[index].lastMessage = messageRes.data.data;
    dispatch(setChats(chats));
    return dispatch(addMessage(messageRes.data.data));
  };
};
export const startResetUnreadMessages = (cid: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    await axios.post(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/chat/reset/${cid}`,
      {},
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(setUnreadMessages(0, cid));
  };
};

export const setSelectedChat = (chat?: Chat): SetSelectedChatAction => {
  return {
    type: 'SET_SELECTED_CHAT',
    selectedChat: chat,
  };
};
export const addMessage = (message: Message): AddMessageAction => {
  return {
    type: 'ADD_MESSAGE',
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
export const setUnreadChats = (unreadChats: number): SetUnreadChatsAction => {
  return {
    type: 'SET_UNREAD_CHATS',
    unreadChats,
  };
};
export const setNewChatText = (
  data:
    | {
        text: string;
        imageURL: string;
      }
    | undefined
): SetNewChatText => {
  return {
    type: 'SET_NEW_CHAT_MESSAGE',
    text: data?.text,
    imageURL: data?.imageURL,
  };
};
export const setUnreadMessages = (
  unreadMessages: number,
  cid: string
): SetUnreadMessagesAction => {
  return {
    type: 'SET_UNREAD_MESSAGES',
    unreadMessages,
    cid,
  };
};
