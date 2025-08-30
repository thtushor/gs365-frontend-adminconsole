import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ImageUploader from "./shared/ImageUploader";
import { toast } from "react-toastify";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { useGetRequest, usePostRequest } from "../Utils/apiClient";
import { useAuth } from "../hooks/useAuth";
import { LuSend } from "react-icons/lu";
import KycRequestButton from "../Utils/KycRequestButton";

const KYCVerificationPage = () => {
  const { affiliateInfo } = useAuth();
  const getRequest = useGetRequest();

  const { data: kycDetails, isLoading: kycLoading } = useQuery({
    queryKey: ["kyc", { kycId: affiliateInfo?.id }],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_ALL_KYC,
        params: { kycId: affiliateInfo?.id },
      }),
  });

  const postRequest = usePostRequest();
  const [formData, setFormData] = useState({
    documentType: "",
    documentNo: "",
    expiryDate: "",
    dob: "",
  });

  const [uploads, setUploads] = useState({
    front: null,
    back: null,
    selfie: null,
  });

  const [status, setStatus] = useState("Pending");
  const [submitLoading, setSubmitLoading] = useState(false);

  // ✅ Prefill when details available
  useEffect(() => {
    if (kycDetails?.data) {
      const d = kycDetails.data;
      setFormData({
        documentType: d.documentType || "",
        documentNo: d.documentNo || "",
        expiryDate: d.expiryDate?.split("T")[0] || "", // keep yyyy-mm-dd format
        dob: d.dob?.split("T")[0] || "",
      });

      setUploads({
        front: d.documentFront ? { data: { original: d.documentFront } } : null,
        back: d.documentBack ? { data: { original: d.documentBack } } : null,
        selfie: d.selfie ? { data: { original: d.selfie } } : null,
      });

      setStatus(
        d.status
          ? d.status.charAt(0).toUpperCase() + d.status.slice(1)
          : "Pending"
      );
    }
  }, [kycDetails]);

  // ------------------- Mutation -------------------
  const mutation = useMutation({
    mutationFn: async (payload) => {
      return await postRequest({
        url: `${BASE_URL}${API_LIST.SUBMIT_KYC}`,
        body: payload,
        contentType: "application/json",
        setLoading: setSubmitLoading,
      });
    },
    onSuccess: () => {
      setStatus("Submitted");
      // toast.success("KYC submitted successfully!");
    },
    onError: (err) => {
      console.error(err);
      // toast.error("Failed to submit KYC. Please try again.");
    },
  });

  // ------------------- Handle Input Changes -------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------- Handle Submit -------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.documentType)
      return toast.error("Please select a document type.");
    if (!formData.documentNo)
      return toast.error("Please enter the document number.");
    if (!formData.expiryDate)
      return toast.error("Please select the expiry date.");
    if (!uploads.front)
      return toast.error("Please upload the front side of the document.");
    if (!uploads.back)
      return toast.error("Please upload the back side of the document.");
    if (!uploads.selfie)
      return toast.error("Please upload the selfie with document.");

    const payload = {
      ...formData,
      documentFront: uploads.front?.data?.original,
      documentBack: uploads.back?.data?.original,
      selfie: uploads.selfie?.data?.original,
      holderId: affiliateInfo?.id,
      holderType: "affiliate",
    };

    mutation.mutate(payload);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md ">
      {/* Left Column: Form */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold bg-[#07122b] text-white px-3 w-fit rounded-full py-1 pt-[2px] mb-2">
          KYC Verification
        </h1>

        <KycRequestButton
          holderId={affiliateInfo?.id}
          holderType={"affiliate"}
        />
      </div>
      <div className="flex md:flex-row flex-col-reverse  gap-8 items-start">
        {kycDetails?.data.holderKycStatus !== "verified" && (
          <form onSubmit={handleSubmit} className="space-y-3 w-full">
            {/* Document Type */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Document (Any one)
              </label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">Choose document type</option>
                <option value="identity_card">Identity card</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's license</option>
              </select>
            </div>

            {/* Document No */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Document No.
              </label>
              <input
                type="text"
                name="documentNo"
                value={formData.documentNo}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Enter document number"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            {/* Date of Birth */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            {/* Uploads */}
            {[
              { label: "Upload Document Photo (Front Side)", type: "front" },
              { label: "Upload Document Photo (Back Side)", type: "back" },
              {
                label: "Upload Document Photo (Selfie holding document)",
                type: "selfie",
              },
            ].map((file) => (
              <div key={file.type}>
                <label className="text-sm font-medium text-gray-700">
                  {file.label}
                </label>
                <ImageUploader
                  setUploadRes={(url) =>
                    setUploads((prev) => ({ ...prev, [file.type]: url }))
                  }
                  previewImage={uploads[file.type]?.data?.original}
                />
              </div>
            ))}

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                disabled={
                  submitLoading ||
                  kycDetails?.data.holderKycStatus === "verified"
                }
              >
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}

        {/* Right Column: Preview */}
        <div
          className={`border border-green-500 bg-green-50 ${
            kycDetails?.data.holderKycStatus !== "verified" && "md:mt-[28px]"
          } p-4 rounded-lg w-full space-y-2`}
        >
          <h1 className="text-base font-semibold bg-[#07122b] text-white px-3 w-fit rounded-full py-1 pt-[2px] mb-2">
            Details Preview
          </h1>
          {kycDetails?.data && (
            <>
              <p className="flex items-center justify-between w-full font-medium text-[14px] border shadow-sm border-gray-200 bg-white px-3 py-2 rounded-md">
                <p>Holder Username:</p>{" "}
                {kycDetails?.data.holderUsername || "Not selected"}
              </p>
              <p className="flex items-center justify-between w-full font-medium text-[14px] border shadow-sm border-gray-200 bg-white px-3 py-2 rounded-md">
                <p>Holder Email:</p>{" "}
                {kycDetails?.data.holderEmail || "Not selected"}
              </p>
              <p className="flex items-center justify-between w-full font-medium text-[14px] border shadow-sm border-gray-200 bg-white px-3 py-2 rounded-md">
                <p>Date of Birth:</p> {kycDetails?.data.dob || "Not selected"}
              </p>
              <p className="flex items-center justify-between w-full font-medium text-[14px] border shadow-sm border-gray-200  bg-white px-3 py-2 rounded-md">
                <p>Holder Kyc Status:</p>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm capitalize ${
                    kycDetails?.data.holderKycStatus === "verified"
                      ? "bg-green-200 text-green-800"
                      : kycDetails?.data.holderKycStatus === "unverified"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {kycDetails?.data.holderKycStatus}
                </span>
              </p>
            </>
          )}
          <p className="flex items-center justify-between w-full font-medium text-[14px] border shadow-sm border-gray-200 px-3  bg-white py-2 rounded-md capitalize">
            <p>Document Type:</p> {formData.documentType || "Not selected"}
          </p>
          <p className="flex items-center justify-between w-full font-medium text-[14px] border shadow-sm border-gray-200 px-3  bg-white py-2 rounded-md">
            <p>Document No.:</p> {formData.documentNo || "Not entered"}
          </p>
          <p className="flex items-center justify-between w-full font-medium text-[14px] border shadow-sm border-gray-200 px-3  bg-white py-2 rounded-md">
            <p>Expiry Date:</p> {formData.expiryDate || "Not set"}
          </p>{" "}
          <p className="flex items-center justify-between w-full font-medium text-[14px] border shadow-sm border-gray-200 bg-white px-3 py-2 rounded-md">
            <p>Date of Birth:</p> {formData.dob || "Not selected"}
          </p>
          <p className="flex items-center justify-between w-full font-medium text-[14px] border shadow-sm border-gray-200 px-3  bg-white py-2 rounded-md">
            <p>Status:</p>{" "}
            <span
              className={`px-2 py-1 rounded text-sm ${
                status === "Submitted" || status === "Approved"
                  ? "bg-green-200 text-green-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {status}
            </span>
          </p>
          {/* Uploaded Images Preview */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {uploads.front && (
              <img
                src={uploads.front?.data?.original}
                alt="Front"
                className="w-full h-full object-cover rounded border"
              />
            )}
            {uploads.back && (
              <img
                src={uploads.back?.data?.original}
                alt="Back"
                className="w-full h-full object-cover rounded border"
              />
            )}
            {uploads.selfie && (
              <img
                src={uploads.selfie?.data?.original}
                alt="Selfie"
                className="w-full h-full object-cover rounded border"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerificationPage;
