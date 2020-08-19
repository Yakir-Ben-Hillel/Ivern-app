export interface AppState {
  auth: {
    user: firebase.User;
  };
}
export interface Area {
  name: string;
  area: string;
  id: number;
}
export interface Game {
  cover: number;
  id: number;
  name: string;
  popularity: number;
  rating: number;
  slug: string;
  imageURL: string;
}
export interface Post {
  area: string;
  gid: string;
  pid: string;
  uid: string;
  gameName: string;
  imageURL: string;
  artwork: string | null;
  platform: string;
  description: string;
  price: number;
  exchange: boolean;
  sell: boolean;
  createdAt: Date;
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
  createdAt: Date;
}
