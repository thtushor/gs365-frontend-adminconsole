import React, { useState, useCallback, useEffect } from "react";
import {
  SINGLE_IMAGE_UPLOAD_URL,
  MULTIPLE_IMAGE_UPLOAD_URL,
} from "../../api/ApiList";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

function formatSize(size) {
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + " MB";
  if (size >= 1024) return (size / 1024).toFixed(2) + " KB";
  return size + " B";
}

async function fetchImageSize(url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return blob.size;
  } catch {
    return null;
  }
}

const DropzoneBox = ({
  onDrop,
  accept,
  multiple,
  maxSize,
  files,
  error,
  label,
}) => {
  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const onDropRejected = useCallback(
    (fileRejections) => {
      if (fileRejections && fileRejections.length > 0) {
        const err = fileRejections[0].errors[0];
        if (err.code === "file-too-large") {
          error("File is too large. Max size is 25MB.");
        } else {
          error("Invalid file.");
        }
      }
    },
    [error]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropAccepted,
    onDropRejected,
    accept,
    multiple,
    maxSize,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: isDragActive ? "2px solid #3182ce" : "2px dashed #cbd5e1",
        background: isDragActive ? "#ebf8ff" : "#f8fafc",
        borderRadius: 12,
        padding: 32,
        textAlign: "center",
        cursor: "pointer",
        marginBottom: 12,
        transition: "border 0.2s, background 0.2s",
        boxShadow: isDragActive ? "0 2px 8px #3182ce22" : "0 1px 4px #0001",
      }}
    >
      <input {...getInputProps()} />
      <div
        style={{
          fontSize: 18,
          color: "#2b6cb0",
          fontWeight: 500,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ color: "#4a5568", fontSize: 14 }}>
        {isDragActive
          ? "Drop the file(s) here..."
          : "Drag & drop or click to select"}
        <br />
        <span style={{ color: "#888", fontSize: 13 }}>
          Max size: 25MB per image
        </span>
      </div>
      {files && files.length > 0 && (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          {files.map((file, idx) => (
            <div key={idx} style={{ color: "#444", fontSize: 15 }}>
              <b>{file.name}</b>{" "}
              <span style={{ color: "#888", fontSize: 13 }}>
                ({formatSize(file.size)})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ImageUploader = ({
  isMultiple = false,
  previewImage,
  setUploadRes = () => {},
}) => {
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singlePreview, setSinglePreview] = useState(null);
  const [multiplePreviews, setMultiplePreviews] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [multiErrorMsg, setMultiErrorMsg] = useState("");

  const uploadSingleImage = async (file) => {
    setLoading(true);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(SINGLE_IMAGE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadRes(res.data);
    } catch (err) {
      setUploadRes({ status: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const uploadMultipleImages = async (files) => {
    setLoading(true);
    setMultiErrorMsg("");
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    try {
      const res = await axios.post(MULTIPLE_IMAGE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadRes(res.data);
    } catch (err) {
      setUploadRes({ status: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSingleDrop = (files) => {
    setErrorMsg("");
    if (files && files.length > 0) {
      const file = files[0];
      setSingleFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSinglePreview(reader.result);
      reader.readAsDataURL(file);
      uploadSingleImage(file);
    }
  };

  const handleMultipleDrop = (files) => {
    setMultiErrorMsg("");
    setMultipleFiles(files);
    if (files.length) {
      Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      ).then(setMultiplePreviews);
      uploadMultipleImages(files);
    } else {
      setMultiplePreviews([]);
    }
  };

  const handleSingleError = (msg) => {
    setErrorMsg(msg);
    setSingleFile(null);
    setSinglePreview(null);
  };

  const handleMultiError = (msg) => {
    setMultiErrorMsg(msg);
    setMultipleFiles([]);
    setMultiplePreviews([]);
  };

  return (
    <div className="w-full">
      {isMultiple ? (
        <>
          <DropzoneBox
            onDrop={handleMultipleDrop}
            accept={{ "image/*": [] }}
            multiple={true}
            maxSize={MAX_SIZE}
            files={multipleFiles}
            error={handleMultiError}
            label="Drop or select multiple images"
          />
          {multiErrorMsg && (
            <div
              style={{ color: "#e53e3e", marginBottom: 10, fontWeight: 500 }}
            >
              {multiErrorMsg}
            </div>
          )}
          {multiplePreviews.length > 0 && (
            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {multiplePreviews.map((src, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    style={{
                      maxWidth: 80,
                      borderRadius: 5,
                      border: "1px solid #eee",
                      boxShadow: "0 1px 4px #0001",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="relative">
          <DropzoneBox
            onDrop={handleSingleDrop}
            accept={{ "image/*": [] }}
            multiple={false}
            maxSize={MAX_SIZE}
            files={singleFile ? [singleFile] : []}
            error={handleSingleError}
            label="Drop or select a single image"
          />
          {errorMsg && (
            <div
              style={{ color: "#e53e3e", marginBottom: 10, fontWeight: 500 }}
            >
              {errorMsg}
            </div>
          )}
          {(singlePreview || previewImage) && (
            <div
              style={{ marginTop: 0, border: "1px solid #eee" }}
              className=" rounded-lg overflow-hidden top-1 left-1"
            >
              <div
                className="relative"
                style={{
                  boxShadow: "0 1px 4px #0001",
                }}
              >
                <img
                  src={singlePreview || previewImage}
                  alt="Preview"
                  style={{
                    maxWidth: 100,
                  }}
                />
                {loading && (
                  <div className="absolute bg-black/60 w-full top-0 left-0 text-white text-[12px] font-normal h-full flex items-center justify-center">
                    Uploading...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
