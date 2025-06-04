import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Post } from "../../types/Post";
import defaultImage from "../../../public/Images/default-user.svg";
import {
  CiCalendar,
  CiCircleMore,
  CiClock2,
  CiLocationOn,
} from "react-icons/ci";
import { formatMacedonianDate } from "../../utils/dateUtils";
import { useRouter } from "next/navigation";

interface PostItemProps {
  post: Post;
  showModal?: boolean;
  seeMore?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ post, showModal, seeMore }) => {
  const router = useRouter();
  const [displayDate, setDisplayDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formattedDate = formatMacedonianDate(now); // Use the utility function
    setDisplayDate(formattedDate);
  }, []);

  const handlePostClick = (post: Post) => {
    router.push(`/post/${post.id}`);
  };

  return (
    <div className=" bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer h-auto mb-2">
      <div className="pt-5 px-5">
        {post.image && (
          <Image
            className="rounded-lg w-full h-[320px] object-cover"
            width={1200}
            height={320}
            src={post.image}
            alt="PostImage"
          />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center text-gray-500 gap-2 min-h-16">
          <h5 className="mb-2 text-2xl font-bold text-black whitespace-normal overflow-hidden min-h-16">
            {post.title}
          </h5>
        </div>
        <div className="flex items-center font-light gap-2 mb-2">
          <CiCalendar className="text-3xl" />
          <p className="capitalize">{post.date || displayDate}</p>
        </div>
        <div className="flex items-center font-light gap-2 mb-2">
          <CiClock2 className="text-3xl" />
          <p>{post.time}</p>
        </div>
        <div className="flex items-center font-light gap-2 mb-2">
          <CiLocationOn className="text-3xl" />
          <p className="whitespace-nowrap overflow-hidden text-ellipsis w-[70%]">
            {post.location}
          </p>
        </div>
        {/* <div className="flex gap-2 border p-2 rounded-md bg-gray-200 w-full font-light">
          <CiClock2 className="text-2xl" />
          {post.createdAt ? formatTimeAgo(post.createdAt) : "Непозната дата"}
        </div> */}
        {showModal && (
          <div className="flex gap-2 py-2">
            {post.userImage ? (
              <Image
                src={post.userImage}
                alt="User Profile"
                width={50}
                height={50}
                className="rounded-full"
              />
            ) : (
              <Image
                src={defaultImage}
                alt="Default User Profile"
                width={50}
                height={50}
                className="rounded-full"
              />
            )}
            <div>
              <h2 className="text-gray-500">Автор</h2>
              <span className="text-xl text-black">{post.userName}</span>
            </div>
          </div>
        )}

        {seeMore && (
          <button
            onClick={() => handlePostClick(post)}
            className="bg-gray-200 px-2 flex gap-2 py-2 w-full justify-center transition-colors border border-gray-300 rounded-lg"
          >
            Види повеќе
            <CiCircleMore className="text-2xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostItem;
