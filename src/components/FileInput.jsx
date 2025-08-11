import React, { useRef, useState } from "react";

const FileInput = ({
  label = "Choose file",
  required = false,
  name,
  accept = "image/*",
  onChange,
  className = "",
  ...props
}) => {
  const inputRef = useRef();
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setFileName(file ? file.name : "");
    if (onChange) onChange(e);
  };

  return (
    <div className={`relative w-full ${className}`} style={{ minWidth: 220 }}>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        required={required}
        onChange={handleFileChange}
        className="hidden"
        {...props}
      />
      <div
        className="flex items-center w-full text-sm border border-gray-300 rounded-lg px-2 bg-white text-gray-700 cursor-pointer transition hover:border-green-400"
        style={{ minHeight: 48 }}
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        <span className="block font-medium  text-gray-500">{label}</span>
        <span className="ml-4 text-gray-400 truncate" style={{ maxWidth: 200 }}>
          {fileName || "No file chosen..."}
        </span>
      </div>
    </div>
  );
};

export default FileInput;
