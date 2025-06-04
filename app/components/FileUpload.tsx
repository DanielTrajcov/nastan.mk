import React from 'react';
import { toast } from 'react-hot-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  currentImage?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, currentImage }) => {
  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Невалиден тип на датотека. Дозволени се само JPG, PNG и GIF.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Дозволената големина е до 5MB.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      onFileSelect(selectedFile);
      toast.success("Сликата е прикачена");
    }
  };

  return (
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
            {currentImage ? "Кликнете за да промените слика" : "Кликнете за да прикачите слика"}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF до 5MB</p>
        </div>
      </label>
    </div>
  );
};

export default FileUpload; 