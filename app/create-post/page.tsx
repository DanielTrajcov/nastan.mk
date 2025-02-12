"use client";
import { useSession } from "next-auth/react";
import { Post } from "../types/Post";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Form from "../components/Home/Form";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const { data: session } = useSession();
  const router = useRouter();

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

  useEffect(() => {
    if (!session) {
      router.push("/");
      toast.error("Најавете се за да креирате настан!");
    }
  }, [session, router]);

  return (
    <div className="flex justify-center items-center">
      <div className="p-6 mt-8 lg:w-[5%] md:w-[50%]">
        <h2 className="text-[30px] font-extrabold text-accent text-center">
          КРЕИРАЈ НАСТАН
        </h2>
        <Form post={defaultPost} />
      </div>
    </div>
  );
};

export default CreatePost;
