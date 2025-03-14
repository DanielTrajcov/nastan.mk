import React, { useState, useEffect } from "react";
import Data from "@/app/shared/Data";
import { useSession } from "next-auth/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../shared/firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Post } from "../../types/Post";
import defaultImage from "../../../public/Images/default-user.svg";

interface Inputs {
  title?: string;
  desc?: string;
  date?: string;
  time?: string;
  location?: string;
  zip?: string;
  game?: string;
  [key: string]: unknown;
}
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface FormProps {
  post: Post;
}

const Form: React.FC<FormProps> = () => {
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

  // Default system date and time
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    // Set default date (YYYY-MM-DD)
    const dateStr = now.toISOString().split("T")[0];
    setCurrentDate(dateStr);

    // Set default time (HH:MM)
    const timeStr = now.toTimeString().split(" ")[0].slice(0, 5);
    setCurrentTime(timeStr);
  }, []);

  useEffect(() => {
    if (session) {
      setInputs({
        userName: session.user?.name,
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
      const postImageUrl = await getDownloadURL(storageRef);

      const selectedDate = new Date(inputs.date || Date.now());
      const formattedDate = selectedDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const createdAt = Date.now();

      const userImage = session?.user?.image || "";
      if (!userImage) {
        toast.error("User image not available, using default image.");
      }

      const postData = {
        ...inputs,
        date: formattedDate,
        image: postImageUrl,
        userImage: userImage,
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
                  src={userImage || defaultImage}
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
                  Успешно креиран настан
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Затвори
            </button>
          </div>
        </div>
      ));

      router.push("/");
    } catch (error) {
      console.error("Грешка при креирање на пост:", error);
      toast.error("Грешка при креирање на пост...");
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
              const postalCode = addressComponents.find(
                (component: AddressComponent) =>
                  component.types.includes("postal_code")
              );
              if (postalCode) {
                setZipCode(postalCode.long_name);
              }
            } else {
              toast.error("Не е пронајдена локација");
            }
          } catch {
            toast.error("Грешка при наоѓање на локација");
          }
        });
      } else {
        toast.error("Геолокација не е подржано преку овој пребарувач.");
      }
    };

    if (addressMethod === "automatic") {
      fetchLocation();
    }
  }, [addressMethod]);

  useEffect(() => {
    if (addressMethod === "manual") {
      setZipCode("");
    } else if (addressMethod === "automatic") {
      setZipCode("");
    }
  }, [addressMethod]);

  return (
    <div>
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            name="title"
            maxLength={28}
            placeholder="Наслов"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-3 rounded-md outline-accent"
          />
          <textarea
            name="desc"
            maxLength={75}
            className="w-full mb-4  border-[1px] p-3 rounded-md outline-accent"
            required
            onChange={handleChange}
            placeholder="Внесете опис овде"
          />
          <input
            type="date"
            name="date"
            required
            onChange={handleChange}
            value={currentDate}
            className="w-full mb-4 border-[1px] p-3 rounded-md outline-accent"
          />

          <input
            type="time"
            name="time"
            required
            onChange={handleChange}
            value={currentTime}
            className="w-full mb-4 border-[1px] p-3 rounded-md outline-accent"
          />

          <div className="mb-4 flex justify-between gap-5">
            <label
              className={`text-base border-[0.5px] border-gray-400 p-2 rounded-md cursor-pointer w-[50%] text-center ${
                addressMethod === "automatic"
                  ? "border-y-accent border-x-accent border-r-8"
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
              className={`text-base border-[0.5px] border-gray-400 p-2 rounded-md cursor-pointer w-[50%] text-center ${
                addressMethod === "manual"
                  ? "border-y-accent border-x-accent border-r-8"
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
              className="w-full mb-4 border-[1px] p-3 rounded-md outline-accent"
              required
            />
          )}
          <input
            type="text"
            placeholder="Zip"
            name="zip"
            maxLength={4}
            value={zipCode}
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-3 rounded-md outline-accent"
            required
          />
          <select
            name="game"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-3 rounded-md outline-accent"
          >
            <option value="" disabled selected>
              Изберете категорија
            </option>
            {Data.GameList.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={handleFileChange}
            accept="image/gif, image/jpeg, image/jpg, image/png"
            className="mb-5 border-[1px] w-full py-3"
          />
          <button className="bg-accent w-full p-3 rounded-md text-white">
            Креирај
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
