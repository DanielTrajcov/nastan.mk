import Link from "next/link";
import React from "react";

const LogoButton = () => {
  return (
    <>
      <Link href="/">
        <p className="text-4xl font-semibold cursor-pointer logo">
          Настан<span className="text-accent font-semibold">.мк</span>
        </p>
      </Link>
    </>
  );
};

export default LogoButton;
