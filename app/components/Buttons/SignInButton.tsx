import React from "react";
import { signIn } from "next-auth/react";

const SignInButton = () => {
  return (
    <>
      <button className="text-black">
        <span onClick={() => signIn()}>
        Најави се
        </span>
      </button>
    </>
  );
};

export default SignInButton;
