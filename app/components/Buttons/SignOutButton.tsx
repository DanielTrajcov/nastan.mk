import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

const SignOutButton = () => {
  return (
    <>
      <Link href="/">
        <button
          className="text-black"
          onClick={async () => {
            await signOut();
          }}
        >
          <div className="flex gap-1">
            <span>Одјави се</span>
            <HiArrowLeftOnRectangle className="text-[25px]" />
          </div>
        </button>
      </Link>
    </>
  );
};

export default SignOutButton;
