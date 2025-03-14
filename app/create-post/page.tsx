"use client";
import { Post } from "../types/Post";
import Form from "../components/Home/Form";
import useAuthRedirect from "../session/useAuthRedirect";

const CreatePost = () => {
  useAuthRedirect();
  const defaultPost: Post = {
    id: "",
    title: "",
    location: "",
    image: "",
    date: "",
    time: "",
    desc: "",
    createdAt: Date.now(),
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-6 mt-8 lg:w-[50%] md:w-[50%]">
        <h2 className="text-[30px] font-extrabold text-accent text-center">
          КРЕИРАЈ НАСТАН
        </h2>
        <Form post={defaultPost} />
      </div>
    </div>
  );
};

export default CreatePost;
