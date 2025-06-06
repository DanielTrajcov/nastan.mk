// SignInModal.js
import React, { useState } from "react";
import { Input } from "@/components/common/forms/Input";
import { LoadingState } from "@/components/common/LoadingState";
import Image from "next/image";
import googleIcon from "../../../public/Images/google-icon.svg";
import facebookIcon from "../../../public/Images/facebook-icon.svg";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../../shared/firebaseConfig";

interface SignInModalProps {
  isOpen: boolean;
  closeModal: () => void;
  openRegisterModal: () => void;
}

const SignInModal = ({
  isOpen,
  closeModal,
  openRegisterModal,
}: SignInModalProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Грешка при најавување"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (providerType: "google" | "facebook") => {
    setLoading(true);
    setError(null);
    try {
      let provider;
      if (providerType === "google") {
        provider = new GoogleAuthProvider();
      } else {
        provider = new FacebookAuthProvider();
      }
      await signInWithPopup(auth, provider);
      closeModal();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Грешка при најава со социјален провајдер"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Најави се</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleEmailSignIn} className="flex flex-col p-6">
          <Input
            label="Е-маил"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="име@маил.com"
            error={error || undefined}
          />
          <div className="mt-4">
            <Input
              label="Пасворд"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 p-3.5 w-full bg-accent text-white rounded-lg text-xl font-semibold"
          >
            {loading ? <LoadingState variant="button" /> : "Најави се"}
          </button>
        </form>

        <div className="flex justify-between w-full items-center p-2">
          <div className="w-full border-b border-gray-200"></div>
          <span className="px-3 text-gray-600">или</span>
          <div className="w-full border-b border-gray-200"></div>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={() => handleSocialSignIn("google")}
            disabled={loading}
            className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Image
              src={googleIcon}
              alt="Google"
              width={24}
              height={24}
              className="mr-2"
            />
            <span>Најави се со Google</span>
          </button>

          <button
            onClick={() => handleSocialSignIn("facebook")}
            disabled={loading}
            className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Image
              src={facebookIcon}
              alt="Facebook"
              width={24}
              height={24}
              className="mr-2"
            />
            <span>Најави се со Facebook</span>
          </button>
        </div>

        <div className="text-center p-6 bg-gray-50 rounded-b-lg">
          <p className="text-sm text-gray-600">
            Немаш профил?{" "}
            <button
              onClick={openRegisterModal}
              className="text-accent hover:underline font-semibold"
            >
              Регистрирај се
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
