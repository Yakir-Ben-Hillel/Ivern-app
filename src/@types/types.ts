import { firebase } from '../firebase';
export interface AppState {
  userInfo: {
    user: User;
    loading: boolean;
  };
  userPosts: {
    posts: Post[];
    loading: boolean;
  };
  userChats: {
    chats: Chat[];
    loadingChats: boolean;
    loadingMessages: boolean;
    open: boolean;
    selectedChat?: Chat;
  };
}
export interface Area {
  name: string;
  area: string;
  id: number;
}
export interface Game {
  id: number;
  name: string;
  popularity: number;
  rating: number;
  slug: string;
  cover: string;
  artwork: string | null;
}
export interface Post {
  areaName: string;
  cityName: string;
  cityID: string;
  gid: string;
  pid: string;
  uid: string;
  gameName: string;
  cover: string;
  artwork: string | null;
  platform: 'playstation' | 'xbox' | 'switch';
  description: string;
  price: string;
  exchange: boolean;
  sell: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}
export interface User {
  displayName: string;
  email: string;
  imageURL: string;
  city: string;
  phoneNumber: string;
  provider: string;
  uid: string;
  isNew: boolean;
  createdAt: firebase.firestore.Timestamp;
}
export interface Message {
  sender: string;
  receiver: string;
  text: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}
export interface Chat {
  interlocutor: User;
  lastMessage?: Message;
  messages?: Message[];
  cid: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}
