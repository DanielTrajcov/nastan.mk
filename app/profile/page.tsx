"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import { app } from "../shared/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  doc,
  deleteDoc,
} from "firebase/firestore";
import PostItem from "../components/Home/PostItem";
import { Post } from "../types/Post";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { data: session, status } = useSession();
  const [userPost, setUserPost] = useState<Post[]>([]);
  const db = getFirestore(app);
  const router = useRouter();

  const getUserPost = useCallback(async () => {
    if (session?.user?.email) {
      const q = query(
        collection(db, "posts"),
        where("email", "==", session.user.email)
      );

      const querySnapshot = await getDocs(q);
      const newPosts: Post[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Post;
        newPosts.push({ ...data, id: doc.id });
      });

      setUserPost(newPosts);
    }
  }, [db, session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (session?.user?.email) {
      getUserPost();
    }
  }, [session, status, getUserPost, router]);

  const handleEdit = (postId: string) => {
    router.push(`/edit/${postId}`);
  };

  const deletePost = async (postId: string) => {
    toast(
      (t) => (
        <div className="">
          <p>Дали сакате да го избришете овој пост?</p>
          <div className="flex space-x-4 py-4">
            <button
              className=" text-white p-2 rounded-lg bg-accent border-b-2 w-[50%] "
              onClick={async () => {
                const postRef = doc(db, "posts", postId);
                await deleteDoc(postRef);
                setUserPost(userPost.filter((post) => post.id !== postId));
                toast.dismiss(t.id);
              }}
            >
              Да
            </button>
            <button
              className="bg-gray-300 text-black p-2 rounded-lg w-[50%]"
              onClick={() => toast.dismiss(t.id)}
            >
              Не
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  if (status === "loading") {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
            {userPost.map((item) => (
              <div key={item.id}>
                <PostItem
                  post={item}
                  onDelete={() => deletePost(item.id)}
                  onEdit={() => handleEdit(item.id)}
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
