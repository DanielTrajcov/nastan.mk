export interface Post {
    id: string;
    title: string;
    desc: string;
    date?: string;
    time?: string;
    location: string;
    zip?: string;
    latitude?: number;
    longitude?: number;
    image: string;
    userImage?: string;
    userName?: string;
    email?: string;
    game?: string;
    createdAt?: number;
    lastModified?: number;
} 