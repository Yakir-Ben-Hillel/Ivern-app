import { ChatActionTypes } from '../../@types/action-types';
import { Chat } from '../../@types/types';
const chatsReducerDefaultState: {
  chats: Chat[];
  loadingChats: boolean;
  loadingMessages: boolean;
  open: boolean;
} = {
  chats: [],
  loadingChats: false,
  loadingMessages: false,
  open: false,
};
export default (state = chatsReducerDefaultState, action: ChatActionTypes) => {
  switch (action.type) {
    case 'ADD_CHAT':
      return { ...state, chats: [...state.chats, action.chat] };
    case 'SET_CHATS':
      return { ...state, chats: action.chats };
    case 'DELETE_CHAT':
      return {
        ...state,
        chats: state.chats.filter((chat) => chat.cid !== action.cid),
      };
    case 'SET_MESSAGES': {
      const index = state.chats.findIndex((chat) => chat.cid === action.cid);
      if (index !== -1) {
        const chat = {
          ...state.chats[index],
          messages: action.messages,
        };
        return { ...state, chats: { ...state.chats, chat } };
      } else return { ...state };
    }
    case 'ADD_MESSAGE': {
      const index = state.chats.findIndex((chat) => chat.cid === action.cid);
      if (index !== -1) {
        const chat = {
          ...state.chats[index],
          messages: [state.chats[index].messages, action.message],
        };
        return { ...state, chats: { ...state.chats, chat } };
      } else return { ...state };
    }
    case 'SET_SELECTED_CHAT':
      return { ...state, selectedChat: action.selectedChat };
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
