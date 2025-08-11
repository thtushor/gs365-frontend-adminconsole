import React, { useState, useCallback, useEffect } from "react";
import {
  SINGLE_IMAGE_UPLOAD_URL,
  MULTIPLE_IMAGE_UPLOAD_URL,
} from "../../api/ApiList";
import axios from "axios";
import { useDropzone } from "react-dropzone";

/**
 * ImageUploadTestPage
 *
 * This page demonstrates how to upload single and multiple images using the API endpoints defined in ApiList.js.
 *
 * API Endpoints:
 *   - Single image: SINGLE_IMAGE_UPLOAD_URL ('http://localhost:8000/upload')
 *   - Multiple images: MULTIPLE_IMAGE_UPLOAD_URL ('http://localhost:8000/uploads')
 *
 * Usage:
 *   - Drag and drop or select a file for single image upload or multiple files for multi-upload.
 *   - Click the corresponding upload button.
 *   - The response from the server will be displayed below the form.
 *
 * Response Data Example:
 *   {
 *     status: true,
 *     message: 'Image uploaded successfully',
 *     data: {
 *       original: 'http://localhost:8000/gs-image/99-6bf9bb25-fae9-45e5-9034-36fe61fa08f8.png',
 *       thumbnail: 'http://localhost:8000/gs-image/99-d16afe55-5d51-4beb-ba00-d5aa13cf9d56.png'
 *     }
 *   }
 *
 *   // Multiple images:
 *   {
 *     status: true,
 *     message: 'Images uploaded successfully',
 *     data: [
 *       {
 *         original: 'http://localhost:8000/gs-image/276-1_page-0001-cf6d0cab-f79c-4731-9d53-f5d5a2abd5bb.png',
 *         thumbnail: 'http://localhost:8000/gs-image/276-1_page-0001-f653eff6-74dc-4ba0-9d17-102357e10405.png'
 *       }
 *     ]
 *   }
 */
const MAX_SIZE = 25 * 1024 * 1024; // 25MB

const codeSampleSingle = `// Single image upload\nconst formData = new FormData();\nformData.append('file', file);\nconst res = await axios.post('${SINGLE_IMAGE_UPLOAD_URL}', formData, {\n  headers: { 'Content-Type': 'multipart/form-data' },\n});`;

const codeSampleMultiple = `// Multiple images upload\nconst formData = new FormData();\nfiles.forEach(f => formData.append('files', f));\nconst res = await axios.post('${MULTIPLE_IMAGE_UPLOAD_URL}', formData, {\n  headers: { 'Content-Type': 'multipart/form-data' },\n});`;

const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      setCopied(false);
    }
  };
  return (
    <button
      onClick={handleCopy}
      type="button"
      style={{
        position: "absolute",
        top: 10,
        right: 14,
        background: copied ? "#38a169" : "#23272e",
        color: copied ? "#fff" : "#90cdf4",
        border: "none",
        borderRadius: 6,
        padding: "4px 12px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: copied ? "0 2px 8px #38a16933" : "none",
        transition: "background 0.2s, color 0.2s",
        zIndex: 2,
      }}
      aria-label="Copy code"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

function formatSize(size) {
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + " MB";
  if (size >= 1024) return (size / 1024).toFixed(2) + " KB";
  return size + " B";
}

// Utility to fetch image size from URL
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

const ImageUploadTestPage = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [singleResponse, setSingleResponse] = useState(null);
  const [multipleResponse, setMultipleResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [singlePreview, setSinglePreview] = useState(null);
  const [multiplePreviews, setMultiplePreviews] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [multiErrorMsg, setMultiErrorMsg] = useState("");
  const [singleUrlSizes, setSingleUrlSizes] = useState({
    original: null,
    thumbnail: null,
    loading: false,
  });
  const [multiUrlSizes, setMultiUrlSizes] = useState([]); // [{ original, thumbnail, loading }]

  // Handle single file drop
  const handleSingleDrop = (files) => {
    setErrorMsg("");
    if (files && files.length > 0) {
      setSingleFile(files[0]);
      setSingleResponse(null);
      const reader = new FileReader();
      reader.onloadend = () => setSinglePreview(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  // Handle multiple files drop
  const handleMultipleDrop = (files) => {
    setMultiErrorMsg("");
    setMultipleFiles(files);
    setMultipleResponse(null);
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
    } else {
      setMultiplePreviews([]);
    }
  };

  // Error handlers
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

  // Handle single file upload
  const handleSingleUpload = async (e) => {
    e.preventDefault();
    if (!singleFile) return;
    setLoading(true);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", singleFile);
    try {
      const res = await axios.post(SINGLE_IMAGE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSingleResponse(res.data);
    } catch (err) {
      setSingleResponse({ status: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle multiple files upload
  const handleMultipleUpload = async (e) => {
    e.preventDefault();
    if (!multipleFiles.length) return;
    setLoading(true);
    setMultiErrorMsg("");
    const formData = new FormData();
    for (let i = 0; i < multipleFiles.length; i++) {
      formData.append("files", multipleFiles[i]);
    }
    try {
      const res = await axios.post(MULTIPLE_IMAGE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMultipleResponse(res.data);
    } catch (err) {
      setMultipleResponse({ status: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Fetch sizes for single image response
  useEffect(() => {
    if (singleResponse && singleResponse.status && singleResponse.data) {
      setSingleUrlSizes({ original: null, thumbnail: null, loading: true });
      Promise.all([
        fetchImageSize(singleResponse.data.original),
        fetchImageSize(singleResponse.data.thumbnail),
      ]).then(([original, thumbnail]) => {
        setSingleUrlSizes({ original, thumbnail, loading: false });
      });
    }
  }, [singleResponse]);

  // Fetch sizes for multiple image response
  useEffect(() => {
    if (
      multipleResponse &&
      multipleResponse.status &&
      Array.isArray(multipleResponse.data)
    ) {
      setMultiUrlSizes(
        Array(multipleResponse.data.length).fill({
          original: null,
          thumbnail: null,
          loading: true,
        })
      );
      Promise.all(
        multipleResponse.data.map(async (img) => {
          const [original, thumbnail] = await Promise.all([
            fetchImageSize(img.original),
            fetchImageSize(img.thumbnail),
          ]);
          return { original, thumbnail, loading: false };
        })
      ).then(setMultiUrlSizes);
    }
  }, [multipleResponse]);

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 32,
        border: "1px solid #e0e0e0",
        borderRadius: 16,
        background: "linear-gradient(135deg, #f8fafc 60%, #e3e8f0 100%)",
        boxShadow: "0 2px 16px #0001",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#2d3748",
          marginBottom: 8,
          letterSpacing: 1,
        }}
      >
        🖼️ Image Upload Test Page
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "#4a5568",
          marginBottom: 24,
          fontSize: 17,
        }}
      >
        Easily test single and multiple image uploads using the API endpoints
        from <code>ApiList.js</code>.<br />
        <span style={{ fontSize: 13, color: "#888" }}>
          <b>Single:</b> <code>{SINGLE_IMAGE_UPLOAD_URL}</code> &nbsp;|&nbsp;
          <b>Multiple:</b> <code>{MULTIPLE_IMAGE_UPLOAD_URL}</code>
        </span>
      </p>

      <section style={{ marginBottom: 36 }}>
        <h3 style={{ color: "#3182ce", marginBottom: 8 }}>How to Use</h3>
        <ol
          style={{
            color: "#444",
            fontSize: 15,
            marginLeft: 18,
            marginBottom: 0,
          }}
        >
          <li>
            Drag and drop or select a file for single image upload or multiple
            files for multi-upload.
          </li>
          <li>Click the corresponding upload button.</li>
          <li>
            The response from the server will be displayed below the form.
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: 36, position: "relative" }}>
        <h3 style={{ color: "#3182ce", marginBottom: 8 }}>
          Code Sample: Single Image Upload
        </h3>
        <div style={{ position: "relative" }}>
          <pre
            style={{
              background: "#23272e",
              color: "#e3e3e3",
              padding: 16,
              borderRadius: 8,
              fontSize: 14,
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            <code>{codeSampleSingle}</code>
          </pre>
          <CopyButton code={codeSampleSingle.replace(/\\n/g, "\n")} />
        </div>
      </section>

      <form
        onSubmit={handleSingleUpload}
        style={{
          marginBottom: 32,
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 1px 8px #0001",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ color: "#2b6cb0", marginBottom: 10 }}>
          Single Image Upload
        </h3>
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
          <div style={{ color: "#e53e3e", marginBottom: 10, fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !singleFile}
          style={{
            marginTop: 8,
            padding: "10px 22px",
            background: loading
              ? "#90cdf4"
              : "linear-gradient(90deg, #38a169 60%, #68d391 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            boxShadow: "0 1px 4px #38a16922",
            fontSize: 16,
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        {singlePreview && (
          <div style={{ marginTop: 18 }}>
            <img
              src={singlePreview}
              alt="Preview"
              style={{
                maxWidth: 180,
                maxHeight: 120,
                borderRadius: 8,
                border: "1px solid #eee",
                boxShadow: "0 1px 4px #0001",
              }}
            />
            <div style={{ color: "#444", fontSize: 14, marginTop: 4 }}>
              Size: <b>{singleFile && formatSize(singleFile.size)}</b>
            </div>
          </div>
        )}
      </form>
      {singleResponse && (
        <div style={{ marginBottom: 32 }}>
          <strong>Response:</strong>
          <pre
            style={{
              background: "#f6f8fa",
              padding: 12,
              borderRadius: 4,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 14,
              color: "#222",
              border: "1px solid #e2e8f0",
              marginTop: 8,
            }}
          >
            {JSON.stringify(singleResponse, null, 2)}
          </pre>
          {singleResponse.status && singleResponse.data && (
            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 32,
                alignItems: "flex-start",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ fontWeight: 500, color: "#2b6cb0", marginBottom: 4 }}
                >
                  Original:
                </div>
                <a
                  href={singleResponse.data.original}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#3182ce",
                    textDecoration: "underline",
                    fontSize: 14,
                  }}
                >
                  {singleResponse.data.original}
                </a>
                <div style={{ margin: "8px 0" }}>
                  <img
                    src={singleResponse.data.original}
                    alt="Original"
                    style={{
                      maxWidth: 180,
                      maxHeight: 120,
                      borderRadius: 8,
                      border: "1px solid #eee",
                      boxShadow: "0 1px 4px #0001",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </div>
                <div style={{ color: "#444", fontSize: 14 }}>
                  Size:{" "}
                  <b>
                    {singleUrlSizes.loading
                      ? "Loading..."
                      : singleUrlSizes.original !== null
                      ? formatSize(singleUrlSizes.original)
                      : "N/A"}
                  </b>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ fontWeight: 500, color: "#2b6cb0", marginBottom: 4 }}
                >
                  Thumbnail:
                </div>
                <a
                  href={singleResponse.data.thumbnail}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#3182ce",
                    textDecoration: "underline",
                    fontSize: 14,
                  }}
                >
                  {singleResponse.data.thumbnail}
                </a>
                <div style={{ margin: "8px 0" }}>
                  <img
                    src={singleResponse.data.thumbnail}
                    alt="Thumbnail"
                    style={{
                      maxWidth: 120,
                      maxHeight: 80,
                      borderRadius: 8,
                      border: "1px solid #eee",
                      boxShadow: "0 1px 4px #0001",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </div>
                <div style={{ color: "#444", fontSize: 14 }}>
                  Size:{" "}
                  <b>
                    {singleUrlSizes.loading
                      ? "Loading..."
                      : singleUrlSizes.thumbnail !== null
                      ? formatSize(singleUrlSizes.thumbnail)
                      : "N/A"}
                  </b>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <section style={{ marginBottom: 36, position: "relative" }}>
        <h3 style={{ color: "#3182ce", marginBottom: 8 }}>
          Code Sample: Multiple Images Upload
        </h3>
        <div style={{ position: "relative" }}>
          <pre
            style={{
              background: "#23272e",
              color: "#e3e3e3",
              padding: 16,
              borderRadius: 8,
              fontSize: 14,
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            <code>{codeSampleMultiple}</code>
          </pre>
          <CopyButton code={codeSampleMultiple.replace(/\\n/g, "\n")} />
        </div>
      </section>

      <form
        onSubmit={handleMultipleUpload}
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 1px 8px #0001",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ color: "#2b6cb0", marginBottom: 10 }}>
          Multiple Images Upload
        </h3>
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
          <div style={{ color: "#e53e3e", marginBottom: 10, fontWeight: 500 }}>
            {multiErrorMsg}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !multipleFiles.length}
          style={{
            marginTop: 8,
            padding: "10px 22px",
            background: loading
              ? "#90cdf4"
              : "linear-gradient(90deg, #38a169 60%, #68d391 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            boxShadow: "0 1px 4px #38a16922",
            fontSize: 16,
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
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
                    maxWidth: 120,
                    maxHeight: 90,
                    borderRadius: 8,
                    border: "1px solid #eee",
                    boxShadow: "0 1px 4px #0001",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
                <div style={{ color: "#444", fontSize: 13, marginTop: 4 }}>
                  Size:{" "}
                  <b>
                    {multipleFiles[idx] && formatSize(multipleFiles[idx].size)}
                  </b>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
      {multipleResponse && (
        <div style={{ marginTop: 32 }}>
          <strong>Response:</strong>
          <pre
            style={{
              background: "#f6f8fa",
              padding: 12,
              borderRadius: 4,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 14,
              color: "#222",
              border: "1px solid #e2e8f0",
              marginTop: 8,
            }}
          >
            {JSON.stringify(multipleResponse, null, 2)}
          </pre>
          {multipleResponse.status && Array.isArray(multipleResponse.data) && (
            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 32,
                flexWrap: "wrap",
              }}
            >
              {multipleResponse.data.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: 220,
                    textAlign: "center",
                    background: "#f8fafc",
                    borderRadius: 10,
                    padding: 12,
                    boxShadow: "0 1px 4px #0001",
                    border: "1px solid #e2e8f0",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 500,
                      color: "#2b6cb0",
                      marginBottom: 4,
                    }}
                  >
                    Original:
                  </div>
                  <a
                    href={img.original}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#3182ce",
                      textDecoration: "underline",
                      fontSize: 14,
                    }}
                  >
                    {img.original}
                  </a>
                  <div style={{ margin: "8px 0" }}>
                    <img
                      src={img.original}
                      alt="Original"
                      style={{
                        maxWidth: 120,
                        maxHeight: 80,
                        borderRadius: 8,
                        border: "1px solid #eee",
                        boxShadow: "0 1px 4px #0001",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                  <div style={{ color: "#444", fontSize: 14 }}>
                    Size:{" "}
                    <b>
                      {multiUrlSizes[idx]?.loading
                        ? "Loading..."
                        : multiUrlSizes[idx]?.original !== null
                        ? formatSize(multiUrlSizes[idx]?.original)
                        : "N/A"}
                    </b>
                  </div>
                  <div
                    style={{
                      fontWeight: 500,
                      color: "#2b6cb0",
                      margin: "8px 0 4px",
                    }}
                  >
                    Thumbnail:
                  </div>
                  <a
                    href={img?.thumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#3182ce",
                      textDecoration: "underline",
                      fontSize: 14,
                    }}
                  >
                    {img?.thumbnail}
                  </a>
                  <div style={{ margin: "8px 0" }}>
                    <img
                      src={img?.thumbnail}
                      alt="Thumbnail"
                      style={{
                        maxWidth: 80,
                        maxHeight: 60,
                        borderRadius: 8,
                        border: "1px solid #eee",
                        boxShadow: "0 1px 4px #0001",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                  <div style={{ color: "#444", fontSize: 14 }}>
                    Size:{" "}
                    <b>
                      {multiUrlSizes[idx]?.loading
                        ? "Loading..."
                        : multiUrlSizes[idx]?.thumbnail !== null
                        ? formatSize(multiUrlSizes[idx]?.thumbnail)
                        : "N/A"}
                    </b>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadTestPage;
