
import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageInputProps {
  onImageChange: (file: File) => void;
  previewUrl: string | null;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onImageChange, previewUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    }
  };
  
  return (
    <div
      onClick={handleContainerClick}
      className="w-full aspect-square bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-700/50 transition-colors duration-200 overflow-hidden"
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
      ) : (
        <div className="text-center text-slate-500">
          <UploadIcon />
          <p className="mt-2 font-semibold">Click to upload an image</p>
          <p className="text-sm">PNG, JPG, or WEBP</p>
        </div>
      )}
    </div>
  );
};
