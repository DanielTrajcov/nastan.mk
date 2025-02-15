"use client";
import { useEffect, useState } from "react";
import Posts from "./components/Home/Posts";
import SearchBox from "./components/Home/SearchBox";
import app from "./shared/firebaseConfig";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Post } from "./types/Post";
import Hero from "./components/Home/Hero";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [zipCode, setZipCode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, "posts"));
        const posts: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center mt-9">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
          <span className="text-6xl p-3 font-bold text-transparent bg-clip-text animate-fill logo">
            Настан.мк
          </span>
        </div>
      )}

      <div className="w-[90%] md:w-[50%] lg:w-[90%]">
        <Hero />
        <SearchBox
          setSearchResults={setSearchResults}
          setZipCode={setZipCode}
        />
        <Posts
          searchResults={searchResults}
          zipCode={zipCode}
          allPosts={posts}
        />
      </div>
    </div>
  );
}
