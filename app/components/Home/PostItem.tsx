import React from "react";
import { Post } from "../../types/Post";
import { Card } from "@/components/common/Card";
import { CiCalendar, CiClock2, CiLocationOn } from "react-icons/ci";

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <Card
      image={{
        src: post.image || "/placeholder-image.jpg",
        alt: post.title,
        className: "object-cover rounded-lg",
        containerClassName: "pt-5 px-5 h-[220px]",
      }}
      className="bg-white border border-gray-200 rounded-lg shadow-md h-auto mb-2 cursor-pointer"
    >
      <div className="">
        <h2 className="text-xl font-bold mb-4 line-clamp-1">{post.title}</h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <CiCalendar className="text-3xl text-gray-500" />
            </div>
            <p className="text-gray-600 capitalize">
              {post.date || "Нема датум"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <CiClock2 className="text-3xl text-gray-500" />
            </div>
            <p className="text-gray-600">{post.time || "Нема време"}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <CiLocationOn className="text-3xl text-gray-500" />
            </div>
            <p className="text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis w-[70%]">
              {post.location}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostItem;
