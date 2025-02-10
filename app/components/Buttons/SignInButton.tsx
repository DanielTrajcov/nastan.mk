import React from "react";
import { signIn } from "next-auth/react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

const SignInButton = () => {
  return (
    <>
      <button className="px-3 py-2 text-gray-500 border-[1px] rounded-3xl">
        <span className="flex items-center" onClick={() => signIn()}>
          Најави се
          <HiArrowLeftOnRectangle className="text-[30px] ml-2" />
        </span>
      </button>
    </>
  );
};

export default SignInButton;
