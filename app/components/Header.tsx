"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import SignInButton from "./Buttons/SignInButton";
import SignOutButton from "./Buttons/SignOutButton";
import CreatePostButton from "./Buttons/CreatePostButton";
import { HiBars3 } from "react-icons/hi2";
import { useRouter } from "next/navigation";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isNavOpen, setNavOpen] = useState(false);
  const toggleNav = () => setNavOpen(!isNavOpen);
  return (
    <nav className="bg-white text-black shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
        <p
          className="text-4xl font-extrabold cursor-pointer"
          onClick={() => router.push("/")}
        >
          Настан<span className="text-blue-500 font-semibold">.мк</span>
        </p>
        <button
          type="button"
          className=" text-4xl text-gray-900 rounded-lg md:hidden"
          aria-expanded={isNavOpen}
          onClick={toggleNav}
        >
          <HiBars3 />
        </button>
        <div
          className={`${
            isNavOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
        >
          <ul className="flex items-center justify-between flex-col md:flex-row py-10 md:p-2 gap-4">
            <li className="">
              <CreatePostButton />
            </li>
            <li>
              {session?.user?.image ? (
                <div className="flex items-center">
                  <button
                    className="px-3 py-2 text-gray-500 border-[1px] rounded-3xl border-r-0 rounded-r-none"
                    onClick={() => router.push("/profile")}
                  >
                    Профил
                  </button>
                  <Image
                    src={session.user.image}
                    width={42}
                    height={42}
                    alt="UserImage"
                    className=" cursor-pointer border-[1px] rounded-3xl border-l-0 rounded-l-none "
                  />
                </div>
              ) : null}
            </li>
            <li>{!session ? <SignInButton /> : <SignOutButton />}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
