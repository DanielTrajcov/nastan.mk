import { useState } from "react";
import { signIn } from "next-auth/react";
import googleIcon from "../../../public/Images/google-icon.svg";
import facebookIcon from "../../../public/Images/facebook-icon.svg";
import Image from "next/image";
import { auth } from "../../shared/firebaseConfig"; // Correct path to firebaseConfig
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import createUserWithEmailAndPassword from firebase/auth

interface RegisterModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const RegisterModal = ({ isOpen, closeModal }: RegisterModalProps) => {
  if (!isOpen) return null;

  // Local state to manage form inputs and errors
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Register the user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // Use auth from firebaseConfig

      // Save additional user info in Firestore (optional)
      // firestore.collection("users").doc(userCredential.user.uid).set({
      //   name,
      //   email,
      //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      // });

      // Close the modal after successful registration
      closeModal();
    } catch (err: any) {
      setError(err.message);
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                onClick={() => signIn("google")}
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
                onClick={() => signIn("facebook")}
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
