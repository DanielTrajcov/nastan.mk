import React, { useState } from "react";
import SignInModal from "../User/SignInModal";
import RegisterModal from "../User/RegisterModal";

const SignInButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Sign-in modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // Register modal state

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openRegisterModal = () => {
    setIsModalOpen(false); // Close the Sign-In modal
    setIsRegisterModalOpen(true); // Open the Register modal
  };
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openSignInModal = () => {
    setIsRegisterModalOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Sign In Button */}
      <button className="text-white border border-accent bg-accent p-2 rounded-xl">
        <span onClick={openModal}>Најави се</span>
      </button>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        openRegisterModal={openRegisterModal} // Open Register Modal from SignInModal
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        closeModal={closeRegisterModal}
        openSignInModal={openSignInModal}
      />
    </>
  );
};

export default SignInButton;
