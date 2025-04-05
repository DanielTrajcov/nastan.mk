"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "../../types/Post";
import { firestore } from "../../shared/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import PostDisplay from "@/app/components/Home/PostDisplay";

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
        console.log("Fetching post ID:", id);

        const docRef = doc(firestore, "posts", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error("Post not found in database");
        }

        const postData = docSnap.data();
        console.log("Firestore data:", postData);

        // Create the post object ensuring no duplicate id field
        setPost({
          ...postData,
          id: docSnap.id, // This will overwrite any existing id from postData
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
        <p className="mb-4 text-red-500">{error || "The post doesn't exist"}</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Browse All Posts
        </button>
      </div>
    );
  }

  return (
    <main className="p-4">
      <div className="mt-6">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ← Back to Posts
        </button>
      </div>
      <PostDisplay post={post} />
    </main>
  );
};

export default PostDetails;
