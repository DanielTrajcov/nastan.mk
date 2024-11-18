import React from "react";
import { HiOutlineLocationMarker, HiOutlineCalendar } from "react-icons/hi";
import { Post } from "../../types/Post";
import { HiOutlineClock, HiOutlineTrash } from "react-icons/hi2";
import Image from "next/image";

interface PostItemProps {
  post: Post;
  showModal?: boolean;
  onDelete?: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, showModal, onDelete }) => {
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const secondsAgo = Math.floor((now - timestamp) / 1000);

    if (secondsAgo < 60) {
      return `пред ${secondsAgo} секунди `;
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return ` пред  ${minutes} минути`;
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `пред ${hours} часа `;
    } else {
      const days = Math.floor(secondsAgo / 86400);
      return `пред ${days} дена `;
    }
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer h-auto mb-2">
      <div className="pt-5 px-5">
        {post.image && (
          <img
            className="rounded-lg w-full h-[320px] object-cover"
            src={post.image}
            alt="PostImage"
          />
        )}
      </div>

      <div className="p-5 ">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-black min-h-16">
          {post.title}
        </h5>
        <div className="flex items-center text-gray-500 gap-2 mb-2">
          <HiOutlineCalendar className="text-[20px]" />
          {post.date}
        </div>
        <div className="flex items-center text-gray-500 gap-2 mb-2">
          <HiOutlineClock className="text-[20px]" />
          {post.time}
        </div>
        <div className="flex items-center text-gray-500 gap-2 mb-2">
          <HiOutlineLocationMarker className="text-[20px]" />
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              post.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
          >
            {post.location}
          </a>
        </div>

        <p className="mb-3 font-normal text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-x">
          {post.desc}
        </p>

        <div className="flex gap-2 mb-3 border p-2 rounded-md bg-gray-200 w-full">
          <HiOutlineClock className="text-[20px]" />
          {post.createdAt ? formatTimeAgo(post.createdAt) : "Непозната дата"}
        </div>

        {showModal && (
          <div className="flex gap-2 py-2">
            {post.userImage && (
              <Image
                src={post.userImage}
                alt="User Profile"
                width={50}
                height={50}
                className="rounded-full"
              />
            )}
            <div className="">
              <h2 className="text-gray-500">Автор</h2>
              <span className="text-xl text-black">{post.userName}</span>
            </div>
          </div>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="mt-3 flex justify-between w-full items-center p-2 text-[20px] font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300"
          >
            Избриши
            <HiOutlineTrash className="text-3xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostItem;
