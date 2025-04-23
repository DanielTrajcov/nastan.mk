import React, { useState, useEffect } from "react";
import Data from "@/app/shared/Data";
import { useSession } from "next-auth/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../shared/firebaseConfig";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Post } from "../../types/Post";
import defaultImage from "../../../public/Images/default-user.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGeoLocation } from "../../hooks/useGeolocation";
import { uploadBytesResumable } from "firebase/storage";
import { formatMacedonianDate } from "../../utils/dateUtils";

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

  const [manualAddress, setManualAddress] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    addressMethod,
    setAddressMethod,
    location,
    latitude,
    longitude,
    zipCode,
    setZipCode,
    isDetectingLocation,
    locationPermission,
  } = useGeoLocation();

  useEffect(() => {
    const now = new Date();
    const formattedDate = formatMacedonianDate(now);
    setDisplayDate(formattedDate);
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
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (name === "date") {
      const mkDate = formatMacedonianDate(new Date(value));
      setDisplayDate(mkDate);
    }

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
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Дозволената големина е до 5MB.");
        return;
      }
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

    try {
      setIsSubmitting(true);
      const storageRef = ref(storage, "posts/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        () => {
          toast.error("Грешка при прикачување.");
          setIsSubmitting(false);
        },
        async () => {
          const postImageUrl = await getDownloadURL(uploadTask.snapshot.ref);

          const postData = {
            ...inputs,
            date: displayDate,
            time: selectedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            image: postImageUrl,
            userImage: session?.user?.image || defaultImage.src,
            createdAt: Date.now(),
            location: addressMethod === "automatic" ? location : manualAddress,
            zip: zipCode,
            latitude,
            longitude,
            game: inputs.game,
          };

          await setDoc(doc(db, "posts", Date.now().toString()), postData);

          toast.success("Настанот е успешно креиран!");
          router.push("/");
        }
      );
    } catch (error) {
      console.error("Грешка при креирање на пост:", error);
      toast.error("Грешка при креирање на пост...");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="title"
          maxLength={28}
          placeholder="Наслов"
          required
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        />

        <textarea
          name="desc"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent min-h-[120px]"
          required
          onChange={handleChange}
          placeholder="Внесете опис овде"
        />

        <DatePicker
          selected={selectedDate}
          onChange={(date) => date && setSelectedDate(date)}
          dateFormat="dd-MM-yyyy"
          name="date"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          placeholderText="Избери дата"
        />

        <DatePicker
          selected={selectedDate}
          onChange={(date) => date && setSelectedDate(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={5}
          timeCaption="Time"
          dateFormat="h:mm aa"
          name="time"
          required
          className="w-full border p-3 rounded-md outline-accent"
          placeholderText="Избери време"
        />

        <div className="flex flex-col space-y-4">
          <label
            className={`bg-white flex items-center p-3 border rounded-md cursor-pointer ${
              addressMethod === "automatic"
                ? "border-accent bg-accent/10"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              value="automatic"
              checked={addressMethod === "automatic"}
              onChange={() => setAddressMethod("automatic")}
              className="mr-2"
            />
            Автоматска локација
          </label>

          <label
            className={`bg-white flex items-center p-3 border rounded-md cursor-pointer ${
              addressMethod === "manual"
                ? "border-accent bg-accent/10"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              value="manual"
              checked={addressMethod === "manual"}
              onChange={() => setAddressMethod("manual")}
              className="mr-2"
            />
            Внесете адреса
          </label>
        </div>

        {addressMethod === "automatic" ? (
          <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
            {isDetectingLocation ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <span>Детектирање на локација...</span>
              </div>
            ) : (
              <div>
                <p className="font-medium">Локација:</p>
                <p>{location}</p>
                {latitude && longitude && (
                  <p className="text-sm text-gray-500 mt-1">
                    Координати: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                )}
              </div>
            )}
            {locationPermission === "denied" && (
              <p className="text-sm text-red-500 mt-2">
                Дозвола за локација е одбиена. Овозможете ја во поставките на
                прелистувачот.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Внесете адреса"
              name="manualAddress"
              value={manualAddress}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />

            <input
              type="text"
              placeholder="Поштенски код"
              name="zip"
              maxLength={4}
              value={zipCode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
        )}

        <div className="relative">
          <select
            name="game"
            required
            onChange={handleChange}
            className="w-full appearance-none p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-white text-base leading-tight"
            defaultValue=""
          >
            <option value="" disabled>
              Изберете категорија
            </option>
            {Data.GameList.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-4 text-center">
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/gif, image/jpeg, image/jpg, image/png"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-600">
                {file ? file.name : "Кликнете за да прикачите слика"}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF до 5MB</p>
            </div>
          </label>
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-accent h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-sm text-center">{Math.round(uploadProgress)}%</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-accent hover:bg-accent-dark"
          } text-white font-medium py-3 px-4 rounded-md transition-colors duration-200`}
        >
          {isSubmitting ? "Прикачување..." : "Креирај настан"}
        </button>
      </form>
    </div>
  );
};

export default Form;
