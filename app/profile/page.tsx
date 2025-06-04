"use client";
import React, { useEffect, useState, useCallback } from "react";
import { app, auth } from "../shared/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import PostItem from "../components/Home/PostItem";
import { Post } from "../types/Post";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

const Profile = () => {
  const [userPost, setUserPost] = useState<Post[]>([]);
  const db = getFirestore(app);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const getUserPost = useCallback(async () => {
    if (user?.email) {
      const q = query(
        collection(db, "posts"),
        where("email", "==", user.email)
      );

      const querySnapshot = await getDocs(q);
      const newPosts: Post[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Post;
        newPosts.push({ ...data, id: doc.id });
      });

      setUserPost(newPosts);
    }
  }, [db, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    getUserPost();
  }, [user, getUserPost, router]);

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center min-h-screen p-6">
      <div className="w-full">
        <h2 className="text-[30px] font-extrabold text-accent text-center">
          Профил
        </h2>

        {userPost.length === 0 ? (
          <p className="text-center text-gray-500 mt-8 text-lg">
            Немате креирано настани
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mt-5">
            {userPost.map((item) => (
              <div key={item.id}>
                <PostItem
                  post={item}
                  seeMore={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
