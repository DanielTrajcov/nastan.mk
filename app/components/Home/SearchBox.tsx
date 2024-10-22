import React, { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import app from "../../shared/firebaseConfig";
import { Post } from "./../../types/Post";
import { toast } from "react-hot-toast";

interface SearchBoxProps {
  setSearchResults: React.Dispatch<React.SetStateAction<Post[]>>;
  setZipCode: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  setSearchResults,
  setZipCode,
}) => {
  const [zipCodeInput, setZipCodeInput] = useState("");

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value;
    setZipCodeInput(zip);
    setZipCode(zip);

    if (zip.length !== 4) {
      setSearchResults([]);
      return;
    }

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
      <div className="relative">
        <input
          type="text"
          maxLength={4}
          value={zipCodeInput}
          onChange={handleSearch}
          className="block w-full p-4 text-md text-black shadow-md rounded-lg bg-white"
          placeholder="Внесете Zip код..."
          required
        />
      </div>
    </div>
  );
};

export default SearchBox;
