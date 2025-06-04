"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "../../types/Post";
import { firestore } from "../../shared/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import PostDisplay from "@/app/components/Home/PostDisplay";
import { CiCircleChevLeft } from "react-icons/ci";
import PostSkeleton from "@/app/components/Skeletons/PostSkeleton";

const PostDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing post ID");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const docRef = doc(firestore, "posts", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("Постот не е пронајден");
        }

        const postData = docSnap.data();
        setPost({
          ...postData,
          id: docSnap.id,
        } as Post);
      } catch (err) {
        console.error("Firebase error:", err);
        setError(err instanceof Error ? err.message : "Failed to load post");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PostSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 hover:text-accent transition-colors"
      >
        <CiCircleChevLeft className="text-2xl" />
        <span>Назад</span>
      </button>
      {post && <PostDisplay post={post} />}
    </div>
  );
};

export default PostDetails;
