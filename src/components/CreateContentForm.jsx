import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ImageUploader from "./shared/ImageUploader";
import { toast } from "react-toastify";

const CreateContentForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  titleLabel = "Title",
  messageLabel = "Message",
  submitLabel = "Submit",
  showCancel = true,
  TextEditorComponent = null,
  extraInput = null, // { paramName, placeholder, uploadField, durationField }
  customTitle = "",
  requiredFields = {},
  isDescription = false,
  isDuration = false,
  isExtraField = true,
  categories = [],
}) => {
  const mainSubmitRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("inactive");
  const [extraValue, setExtraValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadRes, setUploadRes] = useState(null);
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [category, setCategory] = useState(null);
  const handleChangeCategory = (e) => {
    const { name, value, files } = e.target;
    setCategory(value);
  };
  useEffect(() => {
    if (initialData) {
      if (categories?.length > 0) {
        setCategory(initialData.dropdownOptionsId || null);
      }
      setTitle(initialData.title || initialData.name || "");
      setMessage(initialData.message || initialData?.description || "");
      setStatus(initialData.status || "inactive");
      if (extraInput?.paramName) {
        setExtraValue(initialData?.[extraInput.paramName] || "");
      }

      if (isDuration) {
        const range =
          initialData?.[extraInput?.durationField || "duration"] || "";
        const [from = "", to = ""] = range.split(" - ");
        setYearFrom(from);
        setYearTo(to);
      }
    } else {
      setTitle("");
      setMessage("");
      setStatus("inactive");
      setExtraValue("");
      setYearFrom("");
      setYearTo("");
    }
    setErrorMsg("");
  }, [initialData, extraInput, isDuration]);

  const mutation = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries();
      if (onCancel) onCancel();
    },
    onError: (err) => {
      setErrorMsg(err?.message || "Something went wrong");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitter = e.nativeEvent?.submitter;

    if (submitter !== mainSubmitRef.current) return;

    setErrorMsg("");

    if (requiredFields.title && !title.trim()) {
      setErrorMsg(`${titleLabel} is required.`);
      return;
    }

    if (requiredFields.message && !message.trim()) {
      setErrorMsg(`${messageLabel} is required.`);
      return;
    }

    if (categories?.length > 0 && !category) {
      toast.error(`Category is required.`);
      return;
    }

    if (
      extraInput &&
      requiredFields[extraInput.paramName] &&
      !extraValue.trim()
    ) {
      setErrorMsg(`${extraInput.placeholder || "This field"} is required.`);
      return;
    }

    if (isDuration) {
      if (!yearFrom || !yearTo) {
        setErrorMsg("Both From and To year are required.");
        return;
      }

      const from = parseInt(yearFrom, 10);
      const to = parseInt(yearTo, 10);

      if (
        isNaN(from) ||
        isNaN(to) ||
        from >= to ||
        from < 1900 ||
        from > 2100 ||
        to < 1900 ||
        to > 2100 ||
        yearFrom.length !== 4 ||
        yearTo.length !== 4
      ) {
        setErrorMsg(
          "Year range must be valid 4-digit numbers between 1900 and 2100, and From must be less than To."
        );
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        id: initialData?.id,
        status,
      };
      if (categories?.length > 0 && category) {
        payload.dropdownOptionsId = category;
      }
      if (extraInput?.titleName) {
        payload[extraInput?.titleName] = title.trim();
      } else {
        payload.title = title.trim();
      }

      if (isDescription) {
        payload.description = message.trim();
      } else {
        payload.message = message.trim();
      }

      if (extraInput?.paramName) {
        payload[extraInput.paramName] = extraValue.trim();
      }

      if (uploadRes?.status === true && uploadRes.data?.original) {
        const uploadFieldName = extraInput?.uploadField || "icon";
        payload[uploadFieldName] = uploadRes.data.original;
      } else if (initialData?.logo) {
        const uploadFieldName = extraInput?.uploadField || "icon";
        payload[uploadFieldName] = initialData?.logo;
      }

      if (isDuration) {
        const durationField = extraInput?.durationField || "duration";
        payload[durationField] = `${yearFrom} - ${yearTo}`;
      }

      await mutation.mutateAsync(payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[20px] font-semibold mb-4 text-left">
        {initialData
          ? "Edit"
          : !customTitle && TextEditorComponent
          ? "Create Popup"
          : customTitle || "Create Announcement"}
      </h2>

      <form onSubmit={handleSubmit}>
        {extraInput?.uploadField && (
          <ImageUploader
            setUploadRes={setUploadRes}
            previewImage={initialData?.[extraInput.uploadField]}
          />
        )}
        <select
          className="w-full px-3 py-2 mb-2 rounded-md border bg-gray-50"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {categories.length > 0 && (
          <div className="mb-2">
            <select
              name="categoryId"
              value={category}
              onChange={handleChangeCategory}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <input
          type="text"
          placeholder={`Enter ${titleLabel}`}
          className="w-full px-3 py-2 mb-2 rounded-md border bg-gray-50"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {extraInput && isExtraField && (
          <input
            type="text"
            placeholder={extraInput.placeholder || "Enter value"}
            className="w-full px-3 py-2 mb-2 rounded-md border bg-gray-50"
            value={extraValue}
            onChange={(e) => setExtraValue(e.target.value)}
          />
        )}

        {isDuration && (
          <div className="flex gap-4 mb-2">
            <input
              type="number"
              placeholder="From Year"
              className="w-1/2 px-3 py-2 rounded-md border bg-gray-50"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
            />
            <input
              type="number"
              placeholder="To Year"
              className="w-1/2 px-3 py-2 rounded-md border bg-gray-50"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
            />
          </div>
        )}

        {TextEditorComponent ? (
          <TextEditorComponent value={message} setValue={setMessage} />
        ) : isDescription ? (
          <textarea
            placeholder={`Enter ${messageLabel}`}
            className="w-full px-3 py-2 rounded-md border bg-gray-50"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        ) : (
          ""
        )}

        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}

        <button
          type="submit"
          className={`bg-green-500 ${
            loading ? "pointer-events-none" : ""
          } mt-2 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded mr-3`}
          ref={mainSubmitRef}
        >
          {loading ? "Submitting..." : submitLabel}
        </button>

        {initialData && showCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-400 cursor-pointer text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default CreateContentForm;
