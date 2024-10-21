"use client";
import { useEffect, useState } from "react";
import GameList from "./components/Home/GameList";
import Hero from "./components/Home/Hero";
import Posts from "./components/Home/Posts";
import SearchBox from "./components/Home/SearchBox";
import app from "./shared/FirebaseConfig";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { Post } from "./types/Post";

export default function Home() {
  const db = getFirestore(app);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [zipCode, setZipCode] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, "posts"));
      const posts: Post[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(posts);
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-9">
      <div className="w-[80%] md:w-[50%] lg:w-[80%]">
        <Hero />

        <SearchBox
          setSearchResults={setSearchResults}
          setZipCode={setZipCode}
        />

        <GameList />

        <Posts
          searchResults={searchResults}
          zipCode={zipCode}
          allPosts={posts}
        />
      </div>
    </div>
  );
}
