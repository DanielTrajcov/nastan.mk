import React, { useState, useEffect } from "react";
import Data from "@/app/shared/Data";
import { useSession } from "next-auth/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../shared/firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import defaultImage from "../../../public/Images/default-user.svg";
import { useGeoLocation } from "../../hooks/useGeolocation";
import { formatMacedonianDate } from "../../utils/dateUtils";
import { DateSelector, TimeSelector } from "./DatePicker";
import { CiCalendar, CiClock2 } from "react-icons/ci";
import FileUpload from "../FileUpload";
import { Post } from "../../types/Post";

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
        title: post.title || '',
        desc: post.desc || '',
        date: post.date || '',
        time: post.time || '',
        location: post.location || '',
        game: post.game || ''
      };
    }
    return {};
  });
  const { data: session } = useSession();
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [file, setFile] = useState<File | undefined>();
  const [manualAddress, setManualAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
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
    if (session) {
      setInputs({
        userName: session.user?.name,
        email: session.user?.email,
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            userImage: session?.user?.image || defaultImage.src,
            userName: session?.user?.name,
            email: session?.user?.email,
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
        <input type="text" name="title" placeholder="Наслов" required onChange={handleChange} className="input-default" />
        <textarea name="desc" required onChange={handleChange} placeholder="Внесете опис овде" className="input-default min-h-[120px]" />

        <div className="flex items-center gap-2 w-full">
          <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
            <CiCalendar className="text-accent text-4xl w-14" />
          </div>
          <div className="flex-1">
            <DateSelector date={date} setDate={handleDateChange} className="input-default" />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full">
          <div className="flex justify-center items-center border-2 rounded-lg w-14 h-14">
            <CiClock2 className="text-accent text-4xl w-14" />
          </div>
          <div className="flex-1">
            <TimeSelector time={time} setTime={handleTimeChange} className="input-default" />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <label className={`bg-white flex items-center p-3 border rounded-md cursor-pointer ${addressMethod === "automatic" ? "border-accent bg-accent/10" : "border-gray-300"}`}>
            <input type="radio" value="automatic" checked={addressMethod === "automatic"} onChange={() => setAddressMethod("automatic")} className="mr-2" />
            Автоматска локација
          </label>
          <label className={`bg-white flex items-center p-3 border rounded-md cursor-pointer ${addressMethod === "manual" ? "border-accent bg-accent/10" : "border-gray-300"}`}>
            <input type="radio" value="manual" checked={addressMethod === "manual"} onChange={() => setAddressMethod("manual")} className="mr-2" />
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
                  <p className="text-sm text-gray-500 mt-1">Координати: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
                )}
              </div>
            )}
            {locationPermission === "denied" && (
              <p className="text-sm text-red-500 mt-2">Дозвола за локација е одбиена. Овозможете ја во поставките на прелистувачот.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <input type="text" placeholder="Внесете адреса" name="manualAddress" value={manualAddress} onChange={handleChange} className="input-default" required />
            <input type="text" placeholder="Поштенски код" name="zip" maxLength={4} value={zipCode} onChange={handleChange} className="input-default" required />
          </div>
        )}

        <select name="game" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none bg-white">
          <option value="" disabled>Изберете категорија</option>
          {Data.GameList.map((item) => (
            <option key={item.id} value={item.name}>{item.name}</option>
          ))}
        </select>

        <FileUpload onFileSelect={handleFileSelect} />

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-accent h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            <p className="text-sm text-center">{Math.round(uploadProgress)}%</p>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className={`${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-accent hover:bg-accent-dark"} text-white font-medium py-3 px-4 rounded-md transition-colors duration-200`}>
          {isSubmitting ? "Прикачување..." : "Креирај настан"}
        </button>
      </form>
    </div>
  );
};

export default Form;