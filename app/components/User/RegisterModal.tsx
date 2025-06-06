import React, { useState } from "react";
import { Input } from "@/components/common/forms/Input";
import { LoadingState } from "@/components/common/LoadingState";
import Image from "next/image";
import googleIcon from "../../../public/Images/google-icon.svg";
import facebookIcon from "../../../public/Images/facebook-icon.svg";
import defaultImage from "../../../public/Images/BasketBall.png";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth, firestore } from "../../shared/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface RegisterModalProps {
  isOpen: boolean;
  closeModal: () => void;
  openSignInModal: () => void;
}

const RegisterModal = ({
  isOpen,
  closeModal,
  openSignInModal,
}: RegisterModalProps) => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        throw new Error("Е-маилот веќе постои. Обидете се да се најавите.");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: userName,
        photoURL: defaultImage.src,
      });

      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        userName,
        email,
        userImage: defaultImage.src,
        createdAt: serverTimestamp(),
      });

      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
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
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(firestore, "users", user.uid), {
        userName: user.displayName || "",
        email: user.email,
        userImage: user.photoURL || defaultImage.src,
        createdAt: serverTimestamp(),
      }, { merge: true });
      closeModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Грешка при најава со социјален провајдер");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Регистрирај се</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col p-6">
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          
          <Input
            label="Име и Презиме"
            type="text"
            name="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Петко Петковски"
            required
          />

          <div className="mt-4">
            <Input
              label="Е-маил"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="име@маил.com"
              required
            />
          </div>

          <div className="mt-4">
            <Input
              label="Пасворд"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 p-3.5 w-full bg-accent text-white rounded-lg text-xl font-semibold"
          >
            {loading ? (
              <LoadingState variant="button" />
            ) : (
              "Регистрирај се"
            )}
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
            <span>Регистрирај се со Google</span>
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
            <span>Регистрирај се со Facebook</span>
          </button>
        </div>

        <div className="text-center p-6 bg-gray-50 rounded-b-lg">
          <p className="text-sm text-gray-600">
            Веќе имаш профил?{" "}
            <button
              onClick={openSignInModal}
              className="text-accent hover:underline font-semibold"
            >
              Најави се
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
