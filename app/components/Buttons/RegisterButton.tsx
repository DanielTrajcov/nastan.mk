import React, { useState } from "react";
import RegisterModal from "../Home/RegisterModal";

const RegisterButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Register Button */}
      <button className="text-black">
        <span onClick={openModal}>Регистрирај се</span>
      </button>

      {/* RegisterModal */}
      <RegisterModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default RegisterButton;
