import React, { useState, useEffect } from "react";
import Data from "@/app/shared/Data";
import { useSession } from "next-auth/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import app from "./../../shared/FirebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Post } from "./../../types/Post";
import Image from "next/image";

interface Inputs {
  title?: string;
  desc?: string;
  date?: string;
  time?: string;
  location?: string;
  zip?: string;
  game?: string;
  [key: string]: any;
}

const Form = ({ post }: { post: Post }) => {
  const router = useRouter();
  const [inputs, setInputs] = useState<Inputs>({});
  const { data: session } = useSession();
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [file, setFile] = useState<File | undefined>();

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [addressMethod, setAddressMethod] = useState("automatic");
  const [location, setLocation] = useState("Вашата локација...");
  const [manualAddress, setManualAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    if (session) {
      setInputs({
        userName: session.user?.name,
        userImage: session.user?.image,
        email: session.user?.email,
      });
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    if (name === "manualAddress") {
      setManualAddress(value);
    }

    if (name === "zip") {
      setZipCode(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success("Сликата е прикачена");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast.error("Ве молиме изберете слика пред прикачување.");
      return;
    }

    const storageRef = ref(storage, "posts/" + file.name);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Convert date to desired format
      const selectedDate = new Date(inputs.date || Date.now());
      const formattedDate = selectedDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long", // This will give the month name
        year: "numeric",
      });

      const createdAt = Date.now();
      const postData = {
        ...inputs,
        date: formattedDate, // Store the formatted date
        image: url,
        createdAt: createdAt,
        location: addressMethod === "automatic" ? location : manualAddress,
        zip: zipCode,
        latitude: latitude,
        longitude: longitude,
      };

      await setDoc(doc(db, "posts", createdAt.toString()), postData);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Image
                  src={session?.user?.image || ""}
                  width={42}
                  height={42}
                  alt="UserImage"
                  className="h-10 w-10 rounded-full"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Успешно креира настан
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Изгаси
            </button>
          </div>
        </div>
      ));
      router.push("/");
    } catch (error) {
      toast.error("Грешка при прикачување на слика");
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setLocation(`Lat: ${latitude}, Lon: ${longitude}`);

          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const formattedAddress = data.results[0].formatted_address;
              setLocation(formattedAddress);

              const addressComponents = data.results[0].address_components;
              const postalCode = addressComponents.find((component: any) =>
                component.types.includes("postal_code")
              );
              if (postalCode) {
                setZipCode(postalCode.long_name);
              }
            } else {
              toast.error("Неможевме да најдеме локација");
            }
          } catch (error) {
            toast.error("Грешка при пронаоѓање на локација");
          }
        });
      } else {
        toast.error("Геолокација не е подржана преку овој пребарувач");
      }
    };

    if (addressMethod === "automatic") {
      fetchLocation();
    }
  }, [addressMethod]);

  // Reset zipCode when addressMethod changes
  useEffect(() => {
    if (addressMethod === "manual") {
      setZipCode(""); // Reset zip code when switching to manual
    } else if (addressMethod === "automatic") {
      setZipCode(""); // Optional: Reset zip code if switching back to automatic
    }
  }, [addressMethod]);

  return (
    <div>
      <div className="mt-4">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            maxLength={35}
            placeholder="Наслов"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-3 rounded-md"
          />
          <textarea
            name="desc"
            maxLength={75}
            className="w-full mb-4 outline-blue-400 border-[1px] p-3 rounded-md"
            required
            onChange={handleChange}
            placeholder="Внесете опис овде"
          />
          <input
            type="date"
            name="date"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-3 rounded-md"
          />

          <input
            type="time"
            name="time"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-3 rounded-md"
          />

          <div className="mb-4 flex justify-around">
            <label
              className={`text-lg border-[0.5px] border-gray-400 p-3 rounded-md cursor-pointer ${
                addressMethod === "automatic"
                  ? " border-y-blue-500 border-x-blue-500 border-r-8"
                  : ""
              }`}
            >
              <input
                type="radio"
                value="automatic"
                checked={addressMethod === "automatic"}
                onChange={() => setAddressMethod("automatic")}
                className="hidden"
              />
              Вашата локација
            </label>

            <label
              className={`text-lg border-[0.5px] border-gray-400 p-3 rounded-md cursor-pointer ${
                addressMethod === "manual"
                  ? "border-y-blue-500 border-x-blue-500 border-r-8"
                  : ""
              }`}
            >
              <input
                type="radio"
                value="manual"
                checked={addressMethod === "manual"}
                onChange={() => setAddressMethod("manual")}
                className="hidden"
              />
              Внесете адреса
            </label>
          </div>
          {addressMethod === "automatic" ? (
            <input
              type="text"
              placeholder="Локација"
              name="location"
              value={location}
              readOnly
              className="w-full mb-4 border-[1px] p-3 rounded-md"
            />
          ) : (
            <input
              type="text"
              placeholder="Внесете адреса"
              name="manualAddress"
              value={manualAddress}
              onChange={handleChange}
              className="w-full mb-4 border-[1px] p-3 rounded-md"
              required
            />
          )}
          <input
            type="text"
            placeholder="Zip"
            name="zip"
            value={zipCode}
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-3 rounded-md"
            required
          />
          <select
            name="game"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-3 rounded-md"
          >
            <option disabled value="">
              Изберете категорија
            </option>
            {Data.GameList.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </select>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/gif, image/jpeg, image/jpg, image/png"
            className="mb-5 border-[1px] w-full py-3"
          />
          <button className="bg-blue-500 w-full p-3 rounded-md text-white">
            Креирај
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;