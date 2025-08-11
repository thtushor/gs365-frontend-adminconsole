import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { API_LIST, BASE_URL, MULTIPLE_IMAGE_UPLOAD_URL } from "../api/ApiList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePostRequest } from "../Utils/apiClient";

const MAX_SIZE = 25 * 1024 * 1024;

const formatSize = (size) => {
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + " MB";
  if (size >= 1024) return (size / 1024).toFixed(2) + " KB";
  return size + " B";
};

const DropzoneBox = ({ onDrop, files, error }) => {
  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const onDropRejected = useCallback(
    (fileRejections) => {
      const err = fileRejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        error("File is too large. Max size is 25MB.");
      } else {
        error("Invalid file.");
      }
    },
    [error]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropAccepted,
    onDropRejected,
    accept: { "image/*": [] },
    multiple: true,
    maxSize: MAX_SIZE,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 p-6 rounded-xl cursor-pointer transition-all ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-center text-gray-600">
        {isDragActive
          ? "Drop the images here..."
          : "Drag & drop or click to select images"}
      </p>
      <p className="text-center text-sm text-gray-400 mt-1">
        Max file size: 25MB each <br />{" "}
        <span className="text-green-500 font-medium">
          (W: 1920px - H: 400px)
        </span>
      </p>
      {files.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-gray-700">
          {files.map((file, idx) => (
            <li key={idx}>
              {file.name}{" "}
              <span className="text-gray-500">({formatSize(file.size)})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CreateBanner = ({ bannerToEdit, handleCancelEdit, onSuccess }) => {
  const postRequest = usePostRequest();
  const queryClient = useQueryClient();

  const [files, setFiles] = useState([]); // new files to upload
  const [previews, setPreviews] = useState([]); // base64 previews for new files
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("inactive");
  const [existingImages, setExistingImages] = useState([]); // URLs from bannerToEdit

  // Prefill form when editing
  useEffect(() => {
    if (bannerToEdit) {
      setTitle(bannerToEdit.title || "");
      setStatus(bannerToEdit.status || "inactive");
      setExistingImages(bannerToEdit.images || []);
      setFiles([]);
      setPreviews([]);
      setErrorMsg("");
      setResponse(null);
    } else {
      setTitle("");
      setStatus("inactive");
      setExistingImages([]);
      setFiles([]);
      setPreviews([]);
      setErrorMsg("");
      setResponse(null);
    }
  }, [bannerToEdit]);

  // Handle file drop - add new files, generate previews
  const handleDrop = (acceptedFiles) => {
    setErrorMsg("");
    setResponse(null);

    // Filter out duplicates by name+size+lastModified
    const uniqueFiles = acceptedFiles.filter((file) => {
      return !files.some(
        (f) =>
          f.name === file.name &&
          f.size === file.size &&
          f.lastModified === file.lastModified
      );
    });

    if (uniqueFiles.length === 0) {
      setErrorMsg("You've already selected these image(s).");
      return;
    }

    setFiles((prev) => [...prev, ...uniqueFiles]);

    // Create previews for new files
    Promise.all(
      uniqueFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((newPreviews) => {
      setPreviews((prev) => [...prev, ...newPreviews]);
    });
  };

  // Remove a preview/new file by index
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove an existing image from edit banner (by index)
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: ({ url, payload }) => postRequest({ url, body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      if (onSuccess) onSuccess();
    },
  });

  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0 && existingImages.length === 0) {
      setErrorMsg("Please select or keep at least one image.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResponse(null);

    try {
      let imageData = existingImages;

      // Upload new files if any
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const res = await axios.post(MULTIPLE_IMAGE_UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data.status || !Array.isArray(res.data.data)) {
          throw new Error("Image upload failed");
        }

        // Append new uploaded images to existing ones
        imageData = [...existingImages, ...res.data.data];
      }

      const payload = {
        id: bannerToEdit?.id,
        title: title.trim(),
        status,
        dateRange: bannerToEdit?.dateRange || null,
        images: imageData,
      };

      const url = BASE_URL + API_LIST.CREATE_UPDATE_BANNER;

      await mutation.mutateAsync({ url, payload });

      // Clear after success
      setFiles([]);
      setPreviews([]);
      setExistingImages([]);
      setTitle("");
      setStatus("inactive");
      setErrorMsg("");
      setResponse({ status: true, message: "Banner saved successfully!" });
    } catch (err) {
      setResponse({ status: false, message: err.message || "Error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[20px] font-semibold mb-4 text-left">
        {bannerToEdit ? "Edit Banner" : "Create Banner"}
      </h2>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the title (Optional)"
          className="w-full px-3 py-2 rounded-md mb-2 border-gray-300 bg-gray-50 border text-base font-normal"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <DropzoneBox onDrop={handleDrop} files={files} error={setErrorMsg} />

        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}

        {/* Show previews for new files with remove option */}
        {previews.length > 0 && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {previews.map((src, idx) => (
              <div key={idx} className="relative text-center">
                <img
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-full h-32 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  title="Remove image"
                >
                  ×
                </button>
                <p className="text-sm text-gray-600 mt-1">
                  {formatSize(files[idx]?.size)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Show existing images with remove option */}
        {existingImages.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-4">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative text-center">
                <img
                  src={img.original || img.thumbnail} // <--- changed here
                  alt={`Existing image ${idx}`}
                  className="max-w-[200px] h-[98px] rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs cursor-pointer flex items-center justify-center"
                  title="Remove existing image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={
            loading || (files.length === 0 && existingImages.length === 0)
          }
          className={`mt-4 px-4 py-2 text-white font-semibold rounded-lg transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed pointer-events-none"
              : "bg-green-500 hover:bg-green-600 cursor-pointer"
          }`}
        >
          {loading
            ? "Saving..."
            : bannerToEdit
            ? "Update Banner"
            : "Create Banner"}
        </button>
        {bannerToEdit && (
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={loading}
            className={`px-5 cursor-pointer py-2 ml-3 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition ${
              loading && "pointer-events-none"
            }`}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default CreateBanner;
