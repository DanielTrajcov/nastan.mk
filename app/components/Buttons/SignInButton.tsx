import React, { useState } from "react";
import SignInModal from "../Home/SignInModal";

const SignInButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <button className="text-black">
        <span onClick={openModal}>Најави се</span>
      </button>
      <SignInModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default SignInButton;
