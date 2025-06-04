// SignInModal.js
import googleIcon from "../../../public/Images/google-icon.svg";
import facebookIcon from "../../../public/Images/facebook-icon.svg";
import Image from "next/image";
import { useState } from "react";
import { auth } from "../../shared/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

interface SignInModalProps {
  isOpen: boolean;
  closeModal: () => void;
  openRegisterModal: () => void; // Prop for opening the register modal
}

const SignInModal = ({
  isOpen,
  closeModal,
  openRegisterModal,
}: SignInModalProps) => {
  const [email, setEmail] = useState<string>(""); // Email input state
  const [password, setPassword] = useState<string>(""); // Password input state
  const [error, setError] = useState<string | null>(null); // Error state
  const [loading, setLoading] = useState<boolean>(false); // Loading state for the sign-in process

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
      setError(error instanceof Error ? error.message : "Грешка при најавување");
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
      await signInWithPopup(auth, provider);
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
            <h1 className="text-3xl p-2">Најави се</h1>
            <h2 className="text-base">
              Се уште не сте член?
              <span
                onClick={() => {
                  closeModal(); // Close the sign-in modal
                  openRegisterModal(); // Open the register modal
                }}
                className="text-accent2 cursor-pointer pl-1"
              >
                Регистрирај се
              </span>
            </h2>
          </div>

          <form onSubmit={handleEmailSignIn} className="flex flex-col p-6">
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
            {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
            {/* Show error */}
            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className="mt-4 p-3.5 w-full bg-accent text-white rounded-lg text-xl font-semibold"
            >
              {loading ? "Најави се..." : "Најави се"} {/* Show loading text */}
            </button>
          </form>

          {/* Social Sign-in Buttons */}
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
                Најави се со Google
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
                Најави се со Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
