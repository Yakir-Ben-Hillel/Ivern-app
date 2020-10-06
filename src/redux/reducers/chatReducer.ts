import { ChatActionTypes } from '../../@types/action-types';
import { Chat, Message } from '../../@types/types';
const chatsReducerDefaultState: {
  chats: Chat[];
  loadingChats: boolean;
  selectedChat: Chat | undefined;
  selectedChatMessages: Message[] | undefined;
  unreadChats: number;
  loadingMessages: boolean;
  open: boolean;
} = {
  chats: [],
  loadingChats: false,
  selectedChat: undefined,
  selectedChatMessages: undefined,
  unreadChats: 0,
  loadingMessages: false,
  open: false,
};
export default (state = chatsReducerDefaultState, action: ChatActionTypes) => {
  switch (action.type) {
    case 'ADD_CHAT':
      return { ...state, chats: [...state.chats, action.chat] };
    case 'SET_CHATS':
      return { ...state, chats: [...action.chats] };
    case 'DELETE_CHAT':
      return {
        ...state,
        chats: state.chats.filter((chat) => chat.cid !== action.cid),
      };
    case 'SET_MESSAGES': {
      if (state.selectedChat) {
        return { ...state, selectedChatMessages: action.messages };
      } else return { ...state };
    }
    case 'ADD_MESSAGE': {
      if (state.selectedChatMessages) {
        const newMessagesList = state.selectedChatMessages;
        newMessagesList.push(action.message);
        return { ...state, selectedChatMessages: newMessagesList };
      } else return { ...state };
    }
    case 'SET_SELECTED_CHAT':
      return { ...state, selectedChat: action.selectedChat };
    case 'SET_UNREAD_CHATS':
      return { ...state, unreadChats: action.unreadChats };
    case 'SET_UNREAD_MESSAGES': {
      const index = state.chats.findIndex((chat) => chat.cid === action.cid);
      if (index !== -1) {
        const newChat = {
          ...state.chats[index],
          unreadMessages: action.unreadMessages,
        };
        const newStateChats = state.chats;
        newStateChats[index] = newChat;
        return { ...state, chats: newStateChats };
      } else return { ...state };
    }
    case 'LOADING_CHATS':
      return { ...state, loadingChats: action.loadingChats };
    case 'LOADING_MESSAGES':
      return { ...state, loadingMessages: action.loadingMessages };
    case 'HANDLE_CHAT_OPEN':
      return { ...state, open: action.open };
    default:
      return state;
  }
};
