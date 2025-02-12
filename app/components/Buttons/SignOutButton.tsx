import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

const SignOutButton = () => {
  const router = useRouter();
  return (
    <>
      <button
        className="text-black"
        onClick={async () => {
          await signOut();
          router.push("/");
        }}
      >
        <div className="flex gap-2">
          <span>Одјави се</span>
          <HiArrowLeftOnRectangle className="text-[25px]" />
        </div>
      </button>
    </>
  );
};

export default SignOutButton;
