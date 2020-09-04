import { firebase } from '../firebase';
export interface AppState {
  auth: {
    user: User;
    loading: boolean;
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
  area: string;
  gid: string;
  pid: string;
  uid: string;
  gameName: string;
  cover: string;
  artwork: string | null;
  platform: string;
  description: string;
  price: number;
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
