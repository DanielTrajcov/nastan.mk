import React, { useState } from "react";
import RegisterModal from "../User/RegisterModal";
import SignInModal from "../User/SignInModal";

const RegisterButton = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openSignInModal = () => {
    setIsRegisterModalOpen(false);
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => setIsSignInModalOpen(false);

  return (
    <>
      {/* Register Button */}
      <button className="text-black">
        <span onClick={openRegisterModal}>Регистрирај се</span>
      </button>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        closeModal={closeSignInModal}
        openRegisterModal={openRegisterModal} // To switch back from Sign In to Register
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        closeModal={closeRegisterModal}
        openSignInModal={openSignInModal} // To switch from Register to Sign In
      />
    </>
  );
};

export default RegisterButton;
