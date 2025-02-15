import Link from "next/link";
import React from "react";

const LogoButton = () => {
  return (
    <>
      <Link href="/">
        <p className="text-2xl sm:text-2xl lg:text-4xl font-extrabold cursor-pointer logo">
          Настан<span className="text-accent font-semibold">.мк</span>
        </p>
      </Link>
    </>
  );
};

export default LogoButton;
