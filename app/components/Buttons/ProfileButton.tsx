import Link from "next/link";
import React from "react";
import { HiMiniUserCircle } from "react-icons/hi2";

const ProfileButton = () => {
  return (
    <div>
      <Link href="/profile">
        <button className="text-black">
          <div className="flex gap-1">
            <span className="">Профил</span>
            <HiMiniUserCircle className="text-[25px]" />
          </div>
        </button>
      </Link>
    </div>
  );
};

export default ProfileButton;
