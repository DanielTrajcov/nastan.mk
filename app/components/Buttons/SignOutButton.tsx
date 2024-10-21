import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

const SignOutButton = () => {
  const router = useRouter();
  return (
    <>
      <button className=" px-3 py-2 text-gray-500 border-[1px] rounded-3xl">
        <span
          className="flex items-center"
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
        >
          Одјави се
          <HiArrowLeftOnRectangle className="text-[20px] ml-2" />
        </span>
      </button>
    </>
  );
};

export default SignOutButton;
