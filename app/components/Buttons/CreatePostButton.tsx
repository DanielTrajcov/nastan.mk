import { useRouter } from "next/navigation";
import React from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const CreatePostButton = () => {
  const router = useRouter();
  return (
    <div>
      <button
        className="text-black"
        onClick={() => router.push("/create-post")}
      >
        <div className="flex gap-2">
          <span className="">Креирај</span>
          <HiOutlinePencilSquare className="text-[25px]" />
        </div>
      </button>
    </div>
  );
};

export default CreatePostButton;
