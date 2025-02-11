"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import SignInButton from "./Buttons/SignInButton";
import SignOutButton from "./Buttons/SignOutButton";
import CreatePostButton from "./Buttons/CreatePostButton";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <nav className="bg-white text-black shadow-md relative w-full top-0 z-50">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-3 relative">
        <p
          className="text-4xl font-semibold cursor-pointer logo"
          onClick={() => router.push("/")}
        >
          Настан<span className="text-accent font-semibold">.мк</span>
        </p>
        <button
          type="button"
          className="text-4xl text-gray-900 md:hidden"
          aria-expanded={isNavOpen}
          onClick={() => setNavOpen(true)}
        >
          <HiBars3 />
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isNavOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setNavOpen(false)}
              />
              {/* Sliding Menu */}
              <motion.div
                className="fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg z-50 flex flex-col items-center justify-center gap-6 py-16"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                
                <button
                  className="absolute top-2 right-2 text-4xl text-gray-900"
                  onClick={() => setNavOpen(false)}
                >
                  <HiXMark />
                </button>
                <button
                  onClick={() => {
                    setNavOpen(false);
                    router.push("/create-post");
                  }}
                >
                  <CreatePostButton />
                </button>
                {session?.user?.image && (
                  <div className="flex items-center">
                    <button
                      className="px-3 py-2 text-gray-500 border-[1px] rounded-3xl border-r-0 rounded-r-none"
                      onClick={() => {
                        setNavOpen(false);
                        router.push("/profile");
                      }}
                    >
                      Профил
                    </button>
                    <Image
                      src={session.user.image}
                      width={42}
                      height={42}
                      alt="UserImage"
                      className="cursor-pointer border-[1px] rounded-3xl border-l-0 rounded-l-none"
                    />
                  </div>
                )}
                {!session ? <SignInButton /> : <SignOutButton />}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <CreatePostButton />
          {session?.user?.image && (
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
                className="cursor-pointer border-[1px] rounded-3xl border-l-0 rounded-l-none"
              />
            </div>
          )}
          {!session ? <SignInButton /> : <SignOutButton />}
        </div>
      </div>
    </nav>
  );
}

export default Header;
