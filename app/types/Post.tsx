export interface Post {
  id: string;
  title: string;
  location: string;
  image: string;
  date?: string; // Optional
  time?: string; // Optional
  desc?: string; // Optional
  createdAt?: number; // Optional
  userImage?: string; // Optional
  userName?: string; // Optional
}
