import { Post } from "../../types/Post";
import Image from "next/image";
import { CiCalendar, CiClock2, CiLocationOn } from "react-icons/ci";
import defaultImage from "../../../public/Images/default-user.svg";

interface PostDisplayProps {
  post: Post;
}

const PostDisplay: React.FC<PostDisplayProps> = ({ post }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left column - contains both image containers */}
        <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col gap-4">
          {/* Main Image container */}
          <div className="p-2 shadow-lg rounded-2xl">
            {post.image && (
              <Image
                className="rounded-2xl w-full h-auto aspect-square object-cover"
                width={1200}
                height={800}
                src={post.image}
                alt="PostImage"
              />
            )}
          </div>

          {/* User Image container */}
          <div className="bg-white flex gap-2 items-center p-4 shadow-lg rounded-2xl">
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
            <div className="flex flex-col items center justify-center">
              <h2 className="font-light leading-none">Автор</h2>
              <span className="text-xl text-black">{post.userName}</span>
            </div>
          </div>
        </div>

        {/* Right column - text content */}
        <div className="w-full md:w-[60%] lg:w-[65%]">
          <h1 className="font-bold text-2xl p-2">{post.title}</h1>
          <div className="flex flex-row items-center p-2">
            <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
              <CiCalendar className="text-accent text-4xl" />
            </div>
            <p className="p-2 font-light">{post.date}</p>
          </div>
          <div className="flex flex-row items-center p-2">
            <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
              <CiClock2 className="text-accent text-4xl" />
            </div>
            <p className="p-2 font-light">{post.time}</p>
          </div>
          <div className="flex items-center p-2">
            <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
              <CiLocationOn className="text-accent text-4xl" />
            </div>
            <div className="p-2 font-light hover:text-accent transition-colors">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  post.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {post.location}
              </a>
            </div>
          </div>
          <p className="p-2">{post.desc}</p>
        </div>
      </div>
    </>
  );
};

export default PostDisplay;
