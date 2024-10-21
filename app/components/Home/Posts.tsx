import React, { useState } from "react";
import { Post } from "../../types/Post";
import PostItem from "./PostItem";
import PostModal from "./PostModal";

interface PostsProps {
  searchResults: Post[];
  zipCode: string;
  allPosts: Post[];
}

const Posts: React.FC<PostsProps> = ({ searchResults, allPosts }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const displayPosts = searchResults.length > 0 ? searchResults : allPosts;

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
        {displayPosts.length > 0
          ? displayPosts.map((post) => (
              <div key={post.id} onClick={() => handlePostClick(post)}>
                <PostItem post={post} />
              </div>
            ))
          : null}
      </div>

      {selectedPost && (
        <PostModal post={selectedPost} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Posts;
