import React, { useState, useEffect } from "react";
import { Input } from "@/components/common/forms/Input";
import { LoadingState } from "@/components/common/LoadingState";
import { Card } from "@/components/common/Card";
import Data from "@/app/shared/Data";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app, auth } from "../../shared/firebaseConfig";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import defaultImage from "../../../public/Images/default-user.svg";
import { useGeoLocation } from "../../hooks/useGeolocation";
import { formatMacedonianDate } from "../../utils/dateUtils";
import { DateSelector, TimeSelector } from "./DatePicker";
import { CiCalendar, CiClock2 } from "react-icons/ci";
import FileUpload from "../FileUpload";
import { Post } from "../../types/Post";
import { onAuthStateChanged } from "firebase/auth";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  post?: Post;
}

const Form: React.FC<FormProps> = ({ post }) => {
  const router = useRouter();
  const [inputs, setInputs] = useState<Inputs>(() => {
    if (post) {
      return {
        title: post.title || "",
        desc: post.desc || "",
        date: post.date || "",
        time: post.time || "",
        location: post.location || "",
        game: post.game || "",
      };
    }
    return {};
  });
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [file, setFile] = useState<File | undefined>();
  const [manualAddress, setManualAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(() => auth.currentUser);

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
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    if (name === "manualAddress") setManualAddress(value);
    if (name === "zip") setZipCode(value);
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    if (newDate) setSelectedDate(newDate);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return toast.error("Ве молиме изберете слика пред прикачување.");
    if (!date) return toast.error("Ве молиме изберете датум.");
    if (!time) return toast.error("Ве молиме изберете време.");

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
            title: inputs.title,
            desc: inputs.desc,
            date: formatMacedonianDate(selectedDate),
            time,
            image: postImageUrl,
            userImage: user?.photoURL || defaultImage.src,
            userName: user?.displayName,
            email: user?.email,
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
      console.error("Error creating post:", error);
      toast.error("Грешка при креирање на пост...");
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Input
          label="Наслов"
          name="title"
          maxLength={50}
          required
          onChange={handleChange}
          value={inputs.title}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Опис
          </label>
          <textarea
            name="desc"
            required
            onChange={handleChange}
            value={inputs.desc}
            placeholder="Внесете опис овде"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
          />
        </div>

        <div className="flex items-center gap-2 w-full">
          <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
            <CiCalendar className="text-accent text-4xl w-14" />
          </div>
          <div className="flex-1">
            <DateSelector
              date={date}
              setDate={handleDateChange}
              className="input-default"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full">
          <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
            <CiClock2 className="text-accent text-4xl w-14" />
          </div>
          <div className="flex-1">
            <TimeSelector
              time={time}
              setTime={handleTimeChange}
              className="input-default"
            />
          </div>
        </div>

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
                <LoadingState variant="text" />
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
            <Input
              label="Адреса"
              name="manualAddress"
              maxLength={80}
              value={manualAddress}
              onChange={handleChange}
              placeholder="Внесете адреса"
              required
            />
            <Input
              label="Поштенски код"
              name="zip"
              maxLength={4}
              value={zipCode}
              onChange={handleChange}
              placeholder="Поштенски код"
              required
            />
          </div>
        )}

        <Select
          value={inputs.game || ""}
          onValueChange={(value) =>
            setInputs((prev) => ({ ...prev, game: value }))
          }
        >
          <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md bg-white">
            <SelectValue placeholder="Изберете категорија" />
          </SelectTrigger>
          <SelectContent>
            {Data.Category.map((item) => (
              <SelectItem key={item.id} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FileUpload onFileSelect={handleFileSelect} />

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
          {isSubmitting ? <LoadingState variant="button" /> : "Креирај настан"}
        </button>
      </form>
    </Card>
  );
};

export default Form;
