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
