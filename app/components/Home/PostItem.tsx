import React, { useState, useEffect } from "react";
import { HiMiniPencilSquare, HiOutlineTrash } from "react-icons/hi2";
import Image from "next/image";
import { Post } from "../../types/Post";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import { app } from "../../shared/firebaseConfig";
import { toast } from "react-hot-toast";
import defaultImage from "../../../public/Images/default-user.svg";
import { CiCalendar, CiClock2, CiLocationOn } from "react-icons/ci";
import { formatMacedonianDate } from "../../utils/dateUtils";

interface PostItemProps {
  post: Post;
  showModal?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  showModal,
  onDelete,
  onEdit,
}) => {
  const db = getFirestore(app);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState<Post>({ ...post });
  const [displayDate, setDisplayDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formattedDate = formatMacedonianDate(now); // Use the utility function
    setDisplayDate(formattedDate);
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const secondsAgo = Math.floor((now - timestamp) / 1000);

    if (secondsAgo < 60) return `пред ${secondsAgo} секунди`;
    if (secondsAgo < 3600) return `пред ${Math.floor(secondsAgo / 60)} минути`;
    if (secondsAgo < 86400) return `пред ${Math.floor(secondsAgo / 3600)} часа`;
    return `пред ${Math.floor(secondsAgo / 86400)} дена`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));

    if (name === "date") {
      const mkDate = formatMacedonianDate(new Date(value)); // Use the utility function
      setDisplayDate(mkDate);
    }
  };

  const saveEdit = async () => {
    if (!editedPost.id) return;

    try {
      await updateDoc(doc(db, "posts", editedPost.id), {
        title: editedPost.title,
        date: displayDate,
        time: editedPost.time,
        location: editedPost.location,
        desc: editedPost.desc,
      });
      toast.success("Постот е успешно изменет!");
      setIsEditing(false);
    } catch {
      toast.error("Грешка при ажурирање на постот.");
    }
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
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editedPost.title}
              onChange={handleChange}
              maxLength={28}
              className="border p-2 rounded-md w-full"
            />
          ) : (
            <h5 className="mb-2 text-2xl font-bold text-black whitespace-normal overflow-hidden min-h-16">
              {post.title}
            </h5>
          )}
        </div>

        <div className="flex items-center font-light gap-2 mb-2">
          <CiCalendar className="text-3xl" />
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="date"
                name="date"
                value={editedPost.date}
                onChange={handleChange}
                className="border p-1 rounded-md"
              />
            </div>
          ) : (
            post.date || displayDate
          )}
        </div>

        <div className="flex items-center font-light gap-2 mb-2">
          <CiClock2 className="text-3xl" />
          {isEditing ? (
            <input
              type="time"
              name="time"
              value={editedPost.time}
              onChange={handleChange}
              className="border p-1 rounded-md"
            />
          ) : (
            post.time
          )}
        </div>

        <div className="flex items-center font-light gap-2 mb-2">
          <CiLocationOn className="text-3xl" />
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={editedPost.location}
              onChange={handleChange}
              className="border p-1 rounded-md"
            />
          ) : (
            <p className="whitespace-nowrap overflow-hidden text-ellipsis w-[70%]">
              {post.location}
            </p>
          )}
        </div>

        <p className="mb-3 font-light whitespace-nowrap overflow-hidden text-ellipsis max-w-x">
          {isEditing ? (
            <input
              type="text"
              name="desc"
              value={editedPost.desc}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
            />
          ) : (
            post.desc
          )}
        </p>

        <div className="flex gap-2 border p-2 rounded-md bg-gray-200 w-full font-light">
          <CiClock2 className="text-2xl" />
          {post.createdAt ? formatTimeAgo(post.createdAt) : "Непозната дата"}
        </div>

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

        {!isEditing && onDelete && (
          <button
            onClick={onDelete}
            className="mt-3 flex justify-between w-full items-center p-2 text-[20px] font-medium text-center text-gray rounded-md border-gray-500 border-b-2"
          >
            Избриши
            <HiOutlineTrash className="text-3xl text-red-500" />
          </button>
        )}

        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={saveEdit}
              className="mt-3 flex-1 p-2 text-[20px] font-medium text-center text-black rounded-md border-gray-500 border-b-2"
            >
              Зачувај
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="mt-3 flex-1 p-2 text-[20px] font-medium text-center text-black rounded-md border-gray-500 border-b-2"
            >
              Откажи
            </button>
          </div>
        ) : (
          onEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-3 flex justify-between w-full items-center p-2 text-[20px] font-medium text-center text-black rounded-md border-gray-500 border-b-2"
            >
              Измени
              <HiMiniPencilSquare className="text-3xl text-green-500" />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default PostItem;
