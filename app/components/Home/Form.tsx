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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  // Location states
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [addressMethod, setAddressMethod] = useState<"automatic" | "manual">(
    "automatic"
  );
  const [location, setLocation] = useState("Вашата локација...");
  const [manualAddress, setManualAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationPermission, setLocationPermission] =
    useState<PermissionState>("prompt");

  // Date states
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [displayDate, setDisplayDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Check geolocation permission status
  useEffect(() => {
    const checkPermission = async () => {
      if (navigator.permissions) {
        try {
          const status = await navigator.permissions.query({
            name: "geolocation",
          });
          setLocationPermission(status.state);
          status.onchange = () => setLocationPermission(status.state);
        } catch (error) {
          console.log("Permission API not supported");
        }
      }
    };
    checkPermission();
  }, []);

  // Initialize default date/time
  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    setCurrentDate(dateStr);
    const timeStr = now.toTimeString().split(" ")[0].slice(0, 5);
    setCurrentTime(timeStr);
    const mkDate = now.toLocaleDateString("mk-MK", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setDisplayDate(mkDate);
  }, []);

  // Set user info if session exists
  useEffect(() => {
    if (session) {
      setInputs({
        userName: session.user?.name,
        email: session.user?.email,
      });
    }
  }, [session]);

  // Improved location detection from second code
  const detectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          }
        );

        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.address) {
            const addressParts = [];
            if (data.address.road) addressParts.push(data.address.road);
            if (data.address.city) addressParts.push(data.address.city);
            if (data.address.country) addressParts.push(data.address.country);

            setLocation(addressParts.join(", "));

            if (data.address.postcode) {
              setZipCode(data.address.postcode);
            }
          } else {
            setLocation(
              `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
            );
            toast.error("Не е пронајдена локација");
          }
        } catch (error) {
          setLocation(
            `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
          );
          toast.error("Грешка при наоѓање на локација");
        }
      } else {
        throw new Error("Geolocation not supported");
      }
    } catch (error) {
      console.error("Location detection failed:", error);
      toast.error("Грешка при пристап до локација");
      setAddressMethod("manual"); // Fallback to manual input
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Location detection effect
  useEffect(() => {
    if (addressMethod === "automatic") {
      detectLocation();
    } else {
      // Reset location data when switching to manual mode
      setLatitude(null);
      setLongitude(null);
      setLocation("Вашата локација...");
    }
  }, [addressMethod]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));

    if (name === "date") {
      const mkDate = new Date(value).toLocaleDateString("mk-MK", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
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
      const storageRef = ref(storage, "posts/" + file.name);
      await uploadBytes(storageRef, file);
      const postImageUrl = await getDownloadURL(storageRef);

      const postData = {
        ...inputs,
        date: displayDate,
        time: inputs.time || currentTime,
        image: postImageUrl,
        userImage: session?.user?.image || defaultImage.src,
        createdAt: Date.now(),
        location: addressMethod === "automatic" ? location : manualAddress,
        zip: zipCode,
        latitude: latitude,
        longitude: longitude,
        game: inputs.game,
      };

      await setDoc(doc(db, "posts", Date.now().toString()), postData);

      // Enhanced toast notification from second code
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
                  src={session?.user?.image || defaultImage}
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mt-4 bg-white rounded-lg shadow-md p-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              dateFormat="dd-MM-yyyy"
              name="date"
              required
              className="w-full mb-4 border p-3 rounded-md outline-accent"
              placeholderText="Избери дата"
            />

            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              timeCaption="Time"
              dateFormat="h:mm aa"
              name="time"
              required
              className="w-full mb-4 border p-3 rounded-md outline-accent"
              placeholderText="Избери време"
            />
          </div>

          <div className="space-y-2">
            <p className="font-medium">Начин на одредување локација:</p>
            <div className="flex flex-col space-y-2">
              <label
                className={`flex items-center p-3 border rounded-md cursor-pointer ${
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
                className={`flex items-center p-3 border rounded-md cursor-pointer ${
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
                  Дозвола за локација е одбиена. Ве молиме овозможете ја во
                  поставките на вашиот прелистувач.
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

          <select
            name="game"
            required
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
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

          <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
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
                  ></path>
                </svg>
                <p className="text-sm text-gray-600">
                  {file ? file.name : "Кликнете за да прикачите слика"}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF до 5MB</p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="bg-accent hover:bg-accent-dark text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
          >
            Креирај настан
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
