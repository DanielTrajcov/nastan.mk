import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter hook
import { Post } from "../../types/Post";
import PostItem from "./PostItem";

interface PostsProps {
  searchResults: Post[];
  allPosts: Post[];
  zipCode: string;
}

const Posts: React.FC<PostsProps> = ({ searchResults, allPosts }) => {
  const router = useRouter(); // Initialize the router

  const displayPosts = searchResults.length > 0 ? searchResults : allPosts;

  const handlePostClick = (post: Post) => {
    // Navigate to the new post details page
    router.push(`/post/${post.id}`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-5">
        {displayPosts.length > 0
          ? displayPosts.map((post) => (
              <div key={post.id} onClick={() => handlePostClick(post)}>
                <PostItem post={post} />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default Posts;
