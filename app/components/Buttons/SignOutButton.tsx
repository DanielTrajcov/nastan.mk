import { signOut } from "firebase/auth";
import { auth } from "../../shared/firebaseConfig";
import Link from "next/link";
import React from "react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

const SignOutButton = () => {
  const handleSignOut = () => signOut(auth);

  return (
    <>
      <Link href="/">
        <button
          className="text-black"
          onClick={handleSignOut}
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
