import Link from "next/link";
import React from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const CreatePostButton = () => {
  return (
    <div>
      <Link href="/create-post">
        <button className="text-black">
          <div className="flex gap-1">
            <span className="">Креирај</span>
            <HiOutlinePencilSquare className="text-[25px]" />
          </div>
        </button>
      </Link>
    </div>
  );
};

export default CreatePostButton;
