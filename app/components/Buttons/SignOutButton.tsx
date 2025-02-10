import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

const SignOutButton = () => {
  const router = useRouter();
  return (
    <>
      <button
        className=" px-3 py-2 text-gray-500 border-[1px] rounded-3xl"
        onClick={async () => {
          await signOut();
          router.push("/");
        }}
      >
        <div className="flex items-center gap-2">
          <span className="">Одјави се</span>
          <HiArrowLeftOnRectangle className="text-[30px]" />
        </div>
      </button>
    </>
  );
};

export default SignOutButton;
