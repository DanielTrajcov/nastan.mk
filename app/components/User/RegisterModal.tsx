import { useState } from "react";
import googleIcon from "../../../public/Images/google-icon.svg";
import facebookIcon from "../../../public/Images/facebook-icon.svg";
import defaultImage from "../../../public/Images/BasketBall.png";
import Image from "next/image";
import { auth, firestore } from "../../shared/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile, // Import the updateProfile function
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail, // Import fetchSignInMethodsForEmail
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface RegisterModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const RegisterModal = ({ isOpen, closeModal }: RegisterModalProps) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if email is already registered with any provider
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError(
          "Овој е-маил веќе е регистриран. Ве молиме најавете се со оригиналниот метод."
        );
        setLoading(false);
        return;
      }

      // Step 1: Create the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Step 2: Update the user profile
      await updateProfile(userCredential.user, {
        displayName: userName, // Set the displayName to the user input
        photoURL: defaultImage.src, // Set the photoURL to the default image
      });

      // Step 3: Save additional user info in Firestore
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        userName,
        email,
        userImage: defaultImage.src, // Add the default image URL to Firestore
        createdAt: serverTimestamp(),
      });

      // Optional: Sign in the user after registration
      await signInWithEmailAndPassword(auth, email, password);

      // Close modal after successful registration
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

  // Social sign-in handler
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
      // Check if user already exists in Firestore, if not, create
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(userRef, {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white sm:bg-white lg:bg-black/60"
      aria-hidden="true"
    >
      <div className="relative w-full max-w-md max-h-full overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-end items-center p-1">
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-800 bg-transparent hover:bg-gray-100 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center p-4 mx-2 md:p-5 border-b rounded-t border-gray-200">
            <p className="text-6xl font-extrabold cursor-pointer logo pb-8">
              Настан<span className="text-accent font-semibold">.мк</span>
            </p>
            <h1 className="text-3xl p-2">Регистрирај се</h1>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col p-6">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div>
              <label
                htmlFor="name"
                className="p-1 text-sm font-semibold text-gray-600"
              >
                Име и Презиме
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="my-4 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 outline-accent2"
                placeholder="Петко Петковски"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="p-1 text-sm font-semibold text-gray-600"
              >
                Е-маил
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="my-4 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 outline-accent2"
                placeholder="име@маил.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="p-1 text-sm font-semibold text-gray-600"
              >
                Пасворд
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="my-4 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3 outline-accent2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 p-3.5 w-full bg-accent text-white rounded-lg text-xl font-semibold"
            >
              {loading ? "Регистрирање..." : "Регистрирај се"}
            </button>
          </form>

          <div className="flex justify-between w-full items-center p-2">
            <div className="w-full border-b border-gray-200"></div>
            <span className="px-3 text-gray-600">или</span>
            <div className="w-full border-b border-gray-200"></div>
          </div>

          <div className="p-4 md:p-5">
            <div className="space-y-6">
              <button
                onClick={() => handleSocialSignIn("google")}
                className="w-full py-4 text-black rounded-lg border-[1px] border-gray-400 flex items-center justify-center gap-2"
              >
                <Image
                  src={googleIcon}
                  alt="Google Icon"
                  width={25}
                  height={25}
                  className="w-6 h-6"
                />
                Регистрирај се со Google
              </button>

              <button
                onClick={() => handleSocialSignIn("facebook")}
                className="w-full py-4 text-black rounded-lg border-[1px] border-gray-400 flex items-center justify-center gap-2"
              >
                <Image
                  src={facebookIcon}
                  alt="Facebook Icon"
                  width={25}
                  height={25}
                  className="w-6 h-6"
                />
                Регистрирај се со Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
