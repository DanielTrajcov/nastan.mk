"use client";
import { useEffect, useState } from "react";
import Posts from "./components/Home/Posts";
import SearchBox from "./components/Home/SearchBox";
import { app } from "./shared/firebaseConfig";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
} from "firebase/firestore";
import { Post } from "./types/Post";
import Hero from "./components/Home/Hero";
import PostItemSkeleton from "./components/Skeletons/PostItemSkeleton";

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
        const querySnapshot = await getDocs(
          query(collection(db, "posts"), orderBy("createdAt", "desc"))
        );
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
      <div className="w-[95%] md:w-[95%] lg:w-[95%]">
        <Hero />
        <SearchBox
          setSearchResults={setSearchResults}
          setZipCode={setZipCode}
        />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
            {[...Array(6)].map((_, index) => (
              <PostItemSkeleton key={index} />
            ))}
          </div>
        ) : (
          <Posts
            searchResults={searchResults}
            zipCode={zipCode}
            allPosts={posts}
          />
        )}
      </div>
    </div>
  );
}
