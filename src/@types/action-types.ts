import { User, Post, Chat, Message } from './types';

const SET_USER = 'SET_USER';
const UPDATE_USER = 'UPDATE_USER';
const LOADING_USER = 'LOADING_USER';
const SET_POSTS = 'SET_POSTS';
const ADD_POST = 'ADD_POST';
const UPDATE_POST = 'UPDATE_POST';
const DELETE_POST = 'DELETE_POST';
const LOADING_POSTS = 'LOADING_POSTS';
const ADD_CHAT = 'ADD_CHAT';
const SET_CHATS = 'SET_CHATS';
const DELETE_CHAT = 'DELETE_CHAT';
const ADD_MESSAGE = 'ADD_MESSAGE';
const SET_MESSAGES = 'SET_MESSAGES';
const LOADING_MESSAGES = 'LOADING_MESSAGES';
const LOADING_CHATS = 'LOADING_CHATS';
const HANDLE_CHAT_OPEN = 'HANDLE_CHAT_OPEN';
const SET_SELECTED_CHAT = 'SET_SELECTED_CHAT';
const SET_UNREAD_CHATS = 'SET_UNREAD_CHATS';
const SET_UNREAD_MESSAGES = 'SET_UNREAD_MESSAGES';
const SET_NEW_CHAT_MESSAGE = 'SET_NEW_CHAT_MESSAGE';
export interface AddChatAction {
  type: typeof ADD_CHAT;
  chat: Chat;
  new?: boolean;
}
export interface SetChatsAction {
  type: typeof SET_CHATS;
  chats: Chat[];
}
export interface DeleteChatAction {
  type: typeof DELETE_CHAT;
  cid: string;
}
export interface AddMessageAction {
  type: typeof ADD_MESSAGE;
  message: Message;
}
export interface SetSelectedChatAction {
  type: typeof SET_SELECTED_CHAT;
  selectedChat?: Chat;
}
export interface SetMessagesAction {
  type: typeof SET_MESSAGES;
  messages?: Message[];
}
export interface SetUserAction {
  type: typeof SET_USER;
  user: User;
}
export interface LoadingUserAction {
  type: typeof LOADING_USER;
  loading: boolean;
}
export interface LoadingChatsAction {
  type: typeof LOADING_CHATS;
  loadingChats: boolean;
}
export interface LoadingMessagesAction {
  type: typeof LOADING_MESSAGES;
  loadingMessages: boolean;
}
export interface UpdateUserAction {
  type: typeof UPDATE_USER;
  currentData: User;
  data: {
    displayName?: string;
    phoneNumber?: string;
    imageURL?: string;
  };
}
export interface SetPostsAction {
  type: typeof SET_POSTS;
  posts: Post[];
}
export interface AddPostAction {
  type: typeof ADD_POST;
  post: Post;
}
export interface UpdatePostAction {
  type: typeof UPDATE_POST;
  post: Post;
}
export interface DeletePostAction {
  type: typeof DELETE_POST;
  pid: string;
}
export interface LoadingPostsAction {
  type: typeof LOADING_POSTS;
  loading: boolean;
}
export interface HandleChatOpenAction {
  type: typeof HANDLE_CHAT_OPEN;
  open: boolean;
}
export interface SetUnreadChatsAction {
  type: typeof SET_UNREAD_CHATS;
  unreadChats: number;
}
export interface SetUnreadMessagesAction {
  type: typeof SET_UNREAD_MESSAGES;
  unreadMessages: number;
  cid: string;
}
export interface SetNewChatText {
  type: typeof SET_NEW_CHAT_MESSAGE;
  text?: string;
  imageURL?: string;
}
export type AuthActionTypes =
  | SetUserAction
  | UpdateUserAction
  | LoadingUserAction;
export type PostsActionTypes =
  | AddPostAction
  | UpdatePostAction
  | DeletePostAction
  | SetPostsAction
  | LoadingPostsAction;
export type ChatActionTypes =
  | AddChatAction
  | SetChatsAction
  | DeleteChatAction
  | AddMessageAction
  | SetMessagesAction
  | SetUnreadChatsAction
  | SetUnreadMessagesAction
  | SetSelectedChatAction
  | SetNewChatText
  | LoadingChatsAction
  | LoadingMessagesAction
  | HandleChatOpenAction;
