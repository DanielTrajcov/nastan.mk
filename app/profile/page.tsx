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
import PostItemSkeleton from "../components/Skeletons/PostItemSkeleton";

const Profile = () => {
  const [userPost, setUserPost] = useState<Post[]>([]);
  const db = getFirestore(app);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserPost = useCallback(
    async (userEmail: string) => {
      try {
        const q = query(
          collection(db, "posts"),
          where("email", "==", userEmail)
        );

        const querySnapshot = await getDocs(q);
        const newPosts: Post[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Post;
          newPosts.push({ ...data, id: doc.id });
        });

        setUserPost(newPosts);
      } catch (err) {
        setError("Error fetching posts");
        console.error("Error fetching posts:", err);
      }
    },
    [db]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.email) {
        getUserPost(currentUser.email);
      }
    });
    return unsubscribe;
  }, [getUserPost]);

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl">
          <div className="mb-8 text-center">
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, index) => (
              <PostItemSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center min-h-screen p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex justify-center min-h-screen p-6">
      <div className="w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="text-[30px] font-extrabold text-accent">Профил</h2>
          <p className="text-gray-600 mt-2">{user.email}</p>
        </div>

        {userPost.length === 0 ? (
          <p className="text-center text-gray-500 mt-8 text-lg">
            Немате креирано настани
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mt-5">
            {userPost.map((item) => (
              <div key={item.id}>
                <PostItem post={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
