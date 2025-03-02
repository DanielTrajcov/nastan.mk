import React, { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../shared/firebaseConfig";
import { Post } from "./../../types/Post";
import { toast } from "react-hot-toast";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface SearchBoxProps {
  setSearchResults: React.Dispatch<React.SetStateAction<Post[]>>;
  setZipCode: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  setSearchResults,
  setZipCode,
}) => {
  const [zipCodeInput, setZipCodeInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const zip = zipCodeInput.trim();

    if (zip.length !== 4) {
      setSearchResults([]);
      return;
    }

    setZipCode(zip);

    const db = getFirestore(app);

    try {
      const q = query(collection(db, "posts"), where("zip", "==", zip));
      const querySnapshot = await getDocs(q);
      const results: Post[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({ id: doc.id, ...data } as Post);
      });

      setSearchResults(results);

      if (results.length === 0) {
        toast.error("Нема настани со тој Zip код");
      } else {
        toast.success(`Има ${results.length} настани`);
      }
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
      toast.error("An error occurred while fetching data");
    }
  };

  return (
    <div className="mt-7">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          maxLength={4}
          value={zipCodeInput}
          onChange={(e) => setZipCodeInput(e.target.value)}
          className="block w-full p-4 text-md text-black shadow-md rounded-lg bg-white outline-accent pr-12"
          placeholder="Внесете Zip код..."
          required
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-accent-hover focus:outline-none"
        >
          <HiMagnifyingGlass size={24} />
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
