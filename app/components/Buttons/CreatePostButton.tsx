import { useRouter } from "next/navigation";
import React from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const CreatePostButton = () => {
  const router = useRouter();
  return (
    <div>
      <button
        className="bg-black px-4 py-1.5 text-white rounded-3xl"
        onClick={() => router.push("/create-post")}
      >
        <div className="flex items-center gap-2">
          <span className="">Креирај</span>
          <HiOutlinePencilSquare className="text-[30px] " />
        </div>
      </button>
    </div>
  );
};

export default CreatePostButton;
