"use client";
import { useEffect } from "react";
import { useState } from "react";
import { doc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { app, firestore } from "../../shared/firebaseConfig";
import { Post } from "../../types/Post";
import useAuthRedirect from "../../session/useAuthRedirect";
import { toast } from "react-hot-toast";
import Image from "next/image";
import {
  CiCalendar,
  CiCircleCheck,
  CiCircleRemove,
  CiClock2,
  CiEdit,
  CiLocationOn,
  CiTrash,
} from "react-icons/ci";
import defaultImage from "../../../public/Images/default-user.svg";
import { formatMacedonianDate } from "@/app/utils/dateUtils";
import { useRouter } from "next/navigation";
import { DateSelector, TimeSelector } from "./DatePicker";
import FileUpload from "../FileUpload";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

type Props = {
  post: Post;
};

const PostDisplay = ({ post }: Props) => {
  const { session, status } = useAuthRedirect();
  const [isOwner, setIsOwner] = useState(false);
  const [actionCount, setActionCount] = useState(0);
  const [lastActionTime, setLastActionTime] = useState(0);
  const userEmail = session?.user?.email;
  const db = getFirestore(app);
  const router = useRouter();
  const storage = getStorage(app);

  // Add back the state declarations
  const [date, setDate] = useState<Date | null>(() => {
    if (!post.date) return null;
    try {
      const parsedDate = new Date(post.date);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    } catch {
      return null;
    }
  });
  const [time, setTime] = useState<string>(post.time || "");
  const [editingFields, setEditingFields] = useState({
    title: false,
    date: false,
    time: false,
    location: false,
    desc: false,
    image: false,
  });

  // Add local state for post data
  const [localPost, setLocalPost] = useState<Post>(post);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [editedPost, setEditedPost] = useState<Post>({ ...localPost });

  // Update local state when prop changes
  useEffect(() => {
    setLocalPost(post);
    setEditedPost({ ...post });
  }, [post]);

  useEffect(() => {
    setIsOwner(status === "authenticated" && userEmail === post.email);
  }, [status, userEmail, post.email]);

  const checkRateLimit = () => {
    const now = Date.now();
    if (now - lastActionTime < 1000) { // 1 second cooldown
      if (actionCount >= 3) { // Max 3 actions per second
        toast.error("Too many actions. Please wait a moment.");
        return false;
      }
      setActionCount(prev => prev + 1);
    } else {
      setActionCount(1);
    }
    setLastActionTime(now);
    return true;
  };

  const toggleField = (field: keyof typeof editingFields) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    setEditedPost((prev) => ({
      ...prev,
      time: newTime || undefined,
    }));
  };

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    try {
      setEditedPost((prev) => ({
        ...prev,
        date: newDate ? formatMacedonianDate(newDate) : undefined,
      }));
    } catch (error) {
      console.error("Error formatting date:", error);
      toast.error("Грешка при форматирање на датумот");
    }
  };

  const handleSaveField = async (field: keyof typeof editingFields) => {
    if (!editedPost.id || !isOwner || !checkRateLimit()) return;

    try {
      // Create a type-safe update object
      const updateData: Partial<Post> & { lastModified: number } = {
        lastModified: Date.now()
      };

      // Handle each field type appropriately
      switch (field) {
        case 'title':
        case 'desc':
        case 'location':
          updateData[field] = editedPost[field]?.toString().trim();
          break;
        case 'date':
        case 'time':
        case 'image':
          updateData[field] = editedPost[field];
          break;
        default:
          break;
      }

      await updateDoc(doc(db, "posts", editedPost.id), updateData);
      // Update local state immediately
      setLocalPost(prev => ({ ...prev, ...updateData }));
      toast.success("Промените се зачувани!");
      toggleField(field);
    } catch (error) {
      console.error(`Error updating ${String(field)}:`, error);
      toast.error("Грешка при зачувување на промените");
    }
  };

  const handleDelete = async () => {
    if (!isOwner || !checkRateLimit()) return;

    toast((t) => (
      <div>
        <p>Дали сакате да го избришете овој пост?</p>
        <div className="flex space-x-4 py-4">
          <button
            className="text-white p-2 rounded-lg bg-red-500 w-[50%]"
            onClick={async () => {
              try {
              const postRef = doc(firestore, "posts", post.id!);
              await deleteDoc(postRef);
              toast.dismiss(t.id);
              toast.success("Постот е избришан!");
              router.push("/");
              } catch (error) {
                console.error("Error deleting post:", error);
                toast.error("Грешка при бришење на постот.");
              }
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
    ));
  };

  const handleFileSelect = async (file: File) => {
    if (!isOwner || !checkRateLimit()) return;

    try {
      const storageRef = ref(storage, "posts/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
          toast.error("Грешка при прикачување на сликата");
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const updateData: Partial<Post> & { lastModified: number } = {
              image: downloadURL,
              lastModified: Date.now(),
            };
            await updateDoc(doc(db, "posts", post.id!), updateData);
            // Update local state immediately
            setLocalPost(prev => ({ ...prev, ...updateData }));
            setEditedPost(prev => ({ ...prev, ...updateData }));
            toast.success("Сликата е успешно променета!");
            toggleField('image');
          } catch (error) {
            console.error("Error updating image URL:", error);
            toast.error("Грешка при зачувување на сликата");
          }
        }
      );
    } catch (error) {
      console.error("Error handling file:", error);
      toast.error("Грешка при обработка на сликата");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left column - contains both image containers */}
        <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col gap-4">
          {/* Main Image container */}
          <div className="relative p-2 shadow-lg rounded-2xl">
            {localPost.image && (
              <>
              <Image
                className="rounded-2xl w-full h-auto aspect-square object-cover"
                width={1200}
                height={800}
                  src={localPost.image}
                alt="PostImage"
              />
                {isOwner && (
                  <button
                    onClick={() => toggleField('image')}
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                  >
                    <CiEdit className="text-2xl text-accent" />
                  </button>
                )}
              </>
            )}
            {editingFields.image && isOwner && (
              <div className="mt-4">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  currentImage={localPost.image}
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-accent h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-sm text-center mt-1">
                      {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => toggleField('image')}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <CiCircleRemove className="text-2xl" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Image container */}
          <div className="bg-white flex gap-2 items-center p-4 shadow-lg rounded-2xl">
            {localPost.userImage ? (
              <Image
                src={localPost.userImage}
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
              <span className="text-xl text-black">{localPost.userName}</span>
            </div>
          </div>
        </div>

        {/* Right column - text content */}
        <div className="w-full md:w-[60%] lg:w-[65%]">
          {/* Title */}
          <div className="relative">
            {editingFields.title ? (
              <div className="flex gap-2">
            <input
              type="text"
              name="title"
              value={editedPost.title}
              onChange={handleChange}
              maxLength={28}
                  className="input-default flex-1"
                />
                <button
                  onClick={() => handleSaveField('title')}
                  className="p-2 text-accent hover:text-accent-dark"
                >
                  <CiCircleCheck className="text-2xl" />
                </button>
                <button
                  onClick={() => toggleField('title')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <CiCircleRemove className="text-2xl" />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <h5 className="mb-2 text-2xl font-bold text-black whitespace-normal overflow-hidden min-h-16 flex-1">
                  {localPost.title}
            </h5>
                {isOwner && (
                  <button
                    onClick={() => toggleField('title')}
                    className="p-2 transition-all"
                  >
                    <CiEdit className="text-2xl text-accent" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="relative">
            {editingFields.date ? (
              <div className="flex items-center gap-2">
            <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
                  <CiCalendar className="text-accent text-4xl w-14" />
            </div>
                <div className="flex-1">
                <DateSelector
                  date={date}
                    setDate={handleDateChange}
                  />
                </div>
                <button
                  onClick={() => handleSaveField('date')}
                  className="p-2 text-accent hover:text-accent-dark"
                >
                  <CiCircleCheck className="text-2xl" />
                </button>
                <button
                  onClick={() => toggleField('date')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <CiCircleRemove className="text-2xl" />
                </button>
              </div>
            ) : (
              <div className="flex items-center py-2 gap-2">
                <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
                  <CiCalendar className="text-accent text-4xl w-14" />
                </div>
                <p className="capitalize font-light flex-1">
                  {localPost.date || "Нема датум"}
                </p>
                {isOwner && (
                  <button
                    onClick={() => toggleField('date')}
                    className="p-2 transition-all"
                  >
                    <CiEdit className="text-2xl text-accent" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Time */}
          <div className="relative">
            {editingFields.time ? (
              <div className="flex items-center gap-2">
            <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
                  <CiClock2 className="text-accent text-4xl w-14" />
            </div>
                <div className="flex-1">
                <TimeSelector
                    time={time}
                    setTime={handleTimeChange}
                  />
                </div>
                <button
                  onClick={() => handleSaveField('time')}
                  className="p-2 text-accent hover:text-accent-dark"
                >
                  <CiCircleCheck className="text-2xl" />
                </button>
                <button
                  onClick={() => toggleField('time')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <CiCircleRemove className="text-2xl" />
                </button>
              </div>
            ) : (
              <div className="flex items-center py-2 gap-2">
                <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
                  <CiClock2 className="text-accent text-4xl w-14" />
                </div>
                <p className="font-light flex-1">{localPost.time || "Нема време"}</p>
                {isOwner && (
                  <button
                    onClick={() => toggleField('time')}
                    className="p-2 transition-all"
                  >
                    <CiEdit className="text-2xl text-accent" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="relative">
            <div className="flex items-center py-2 gap-2">
              <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
                <CiLocationOn className="text-accent text-4xl w-14" />
              </div>
              <div className="py-2 gap-2 font-light hover:text-accent transition-colors flex-1">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(localPost.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {localPost.location}
                </a>
                {localPost.latitude && localPost.longitude && (
                  <p className="text-sm text-gray-500 mt-1">
                    Координати: {localPost.latitude.toFixed(4)}, {localPost.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="relative mt-4">
            {editingFields.desc ? (
              <div className="flex gap-2">
                <textarea
                  name="desc"
                  value={editedPost.desc}
                  onChange={handleChange}
                  className="input-default min-h-[120px] flex-1"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSaveField('desc')}
                    className="p-2 text-accent hover:text-accent-dark"
                  >
                    <CiCircleCheck className="text-2xl" />
                  </button>
                  <button
                    onClick={() => toggleField('desc')}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <CiCircleRemove className="text-2xl" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex">
                <p className="py-2 gap-2 flex-1">{localPost.desc}</p>
                {isOwner && (
                  <button
                    onClick={() => toggleField('desc')}
                    className="p-2 transition-all"
                  >
                    <CiEdit className="text-2xl text-accent" />
                  </button>
                )}
            </div>
            )}
          </div>

          {/* Delete button */}
          {isOwner && (
            <div className="mt-4">
              <button
                onClick={handleDelete}
                className="px-6 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full"
              >
                <div className="flex justify-center gap-2">
                  <p>Избриши</p>
                  <CiTrash className="text-2xl" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PostDisplay;
