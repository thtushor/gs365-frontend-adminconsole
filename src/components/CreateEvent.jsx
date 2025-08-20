import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  API_LIST,
  BASE_URL,
  MULTIPLE_IMAGE_UPLOAD_URL,
  SINGLE_IMAGE_UPLOAD_URL,
} from "../api/ApiList";
import { useGetRequest, usePostRequest } from "../Utils/apiClient";

const MAX_SIZE = 25 * 1024 * 1024;

const formatSize = (size) => {
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + " MB";
  if (size >= 1024) return (size / 1024).toFixed(2) + " KB";
  return size + " B";
};

const DropzoneBox = ({ onDrop, file, error, imageWidth = "" }) => {
  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles[0]); // only first file
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
    multiple: false, // only one file
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
          ? "Drop the image here..."
          : "Drag & drop or click to select an image"}
      </p>
      {imageWidth && (
        <div className="mt-2 w-full flex items-center justify-center">
          <span className="text-sm font-medium text-center text-gray-500">
            Image Size: {imageWidth}px
          </span>
        </div>
      )}
      {file && (
        <div className="mt-4 text-sm text-gray-700">
          {file.name}{" "}
          <span className="text-gray-500">({formatSize(file.size)})</span>
        </div>
      )}
    </div>
  );
};

const CreateEvent = ({ bannerToEdit, handleCancelEdit, onSuccess }) => {
  const postRequest = usePostRequest();
  const queryClient = useQueryClient();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("inactive");
  const [existingImages, setExistingImages] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    status: "",
    publicList: true,
  });

  const getRequest = useGetRequest();

  const { data, isLoading } = useQuery({
    queryKey: ["sports", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_SPORTS,
        params: filters,
        errorMessage: "Failed to fetch sports list",
      }),
    keepPreviousData: true,
  });

  const sports = data?.data || [];

  const sportsOption =
    sports?.map((sport) => ({
      value: sport.id,
      label: sport.name,
    })) || [];

  // Prefill form when editing
  useEffect(() => {
    if (bannerToEdit) {
      setTitle(bannerToEdit.title || "");
      setStatus(bannerToEdit.status || "inactive");
      setExistingImages(bannerToEdit.images || []);
      setFile(null);
      setErrorMsg("");
      setResponse(null);

      // Set preview to the first existing image
      if (bannerToEdit.images) {
        setPreview(
          bannerToEdit.images.original || bannerToEdit.images.thumbnail || null
        );
      } else {
        setPreview(null);
      }

      if (bannerToEdit.sportId) {
        const preSelected = sportsOption.find(
          (opt) => opt.value === bannerToEdit.sportId
        );
        setSelectedSport(preSelected || null);
      } else {
        setSelectedSport(null);
      }
    } else {
      setTitle("");
      setStatus("inactive");
      setExistingImages([]);
      setFile(null);
      setPreview(null);
      setErrorMsg("");
      setResponse(null);
      setSelectedSport(null);
    }
  }, [bannerToEdit, sportsOption?.length]);

  const handleDrop = (acceptedFile) => {
    setErrorMsg("");
    setResponse(null);

    setFile(acceptedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(acceptedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: ({ url, payload }) => postRequest({ url, body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      if (onSuccess) onSuccess();
    },
  });

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file && existingImages.length === 0) {
      setErrorMsg("Please select or keep at least one image.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResponse(null);

    try {
      let imageData = existingImages;

      if (file) {
        const formData = new FormData();
        formData.append("file", file); // single file upload

        const res = await axios.post(SINGLE_IMAGE_UPLOAD_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data.status || !res.data.data) {
          throw new Error("Image upload failed");
        }

        imageData = res.data.data || existingImages;
      }

      console.log(existingImages);
      const payload = {
        id: bannerToEdit?.id,
        title: title.trim(),
        status,
        dateRange: bannerToEdit?.dateRange || null,
        image: imageData,
        sportId: selectedSport?.value || null,
      };

      const url = BASE_URL + API_LIST.CREATE_UPDATE_EVENT;

      await mutation.mutateAsync({ url, payload });

      setFile(null);
      setPreview(null);
      setExistingImages([]);
      setTitle("");
      setStatus("inactive");
      setSelectedSport(null);
      setErrorMsg("");
      setResponse({ status: true, message: "Event saved successfully!" });
    } catch (err) {
      setResponse({ status: false, message: err.message || "Error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[20px] font-semibold mb-4 text-left">
        {bannerToEdit ? "Edit Event" : "Create Event"}
      </h2>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the title (Optional)"
          className="w-full px-3 py-2 rounded-md mb-2 border-gray-300 bg-gray-50 border text-base font-normal"
        />

        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading sports...</p>
        ) : (
          <Select
            options={sportsOption}
            value={selectedSport}
            onChange={(selected) => setSelectedSport(selected)}
            isSearchable
            placeholder="Select Sport"
            styles={{
              menuList: (base) => ({
                ...base,
                maxHeight: "300px",
                overflowY: "auto",
              }),
            }}
          />
        )}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full my-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <DropzoneBox
          onDrop={handleDrop}
          file={file}
          error={setErrorMsg}
          imageWidth="W:378px - H:195px"
        />

        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}

        {preview && (
          <div className="mt-5 relative text-center">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-w-[250px] h-32 object-cover rounded-md border"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}

        {existingImages.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-4">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative text-center">
                <img
                  src={img.original || img.thumbnail}
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
          disabled={loading || (!file && existingImages.length === 0)}
          className={`mt-4 px-4 py-2 text-white font-semibold rounded-lg transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed pointer-events-none"
              : "bg-green-500 hover:bg-green-600 cursor-pointer"
          }`}
        >
          {loading
            ? "Saving..."
            : bannerToEdit
            ? "Update Event"
            : "Create Event"}
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

export default CreateEvent;
