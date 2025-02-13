"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import SignInButton from "./Buttons/SignInButton";
import SignOutButton from "./Buttons/SignOutButton";
import CreatePostButton from "./Buttons/CreatePostButton";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import LogoButton from "./Buttons/LogoButton";
import ProfileButton from "./Buttons/ProfileButton";
import RegisterButton from "./Buttons/RegisterButton";

function Header() {
  const { data: session } = useSession();
  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <nav className="bg-white text-black shadow-md relative w-full top-0 z-50">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-3 relative">
        <LogoButton />
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
                className="fixed inset-0 bg-black/60 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setNavOpen(false)}
              />
              {/* Sliding Menu */}
              <motion.div
                className="fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg z-50 flex flex-col items-center justify-center gap-2 py-16"
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
                <button className="absolute top-2 left-2">
                  <LogoButton />
                </button>
                {!session ? (
                  <>
                    <SignInButton />
                    <RegisterButton />
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setNavOpen(false);
                      }}
                    >
                      <CreatePostButton />
                    </button>
                    <button
                      onClick={() => {
                        setNavOpen(false);
                      }}
                    >
                      <ProfileButton />
                    </button>
                    <SignOutButton />
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {session?.user?.image && (
            <div className="flex items-center gap-2">
              <CreatePostButton />
              <ProfileButton />
            </div>
          )}
          {!session ? (
            <>
              <SignInButton />
              <RegisterButton />
            </>
          ) : (
            <SignOutButton />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
