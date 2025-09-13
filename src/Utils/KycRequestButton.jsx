import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuSend } from "react-icons/lu";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { usePostRequest } from "../Utils/apiClient";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "./permissions";

const KycRequestButton = ({ holderType, holderId }) => {
  const { user } = useAuth();
  console.log(user);
  const postRequest = usePostRequest();
  const [loading, setLoading] = useState(false);

  // ------------------- Mutation -------------------
  const mutation = useMutation({
    mutationFn: async () => {
      return await postRequest({
        url: `${BASE_URL}${API_LIST.SEND_KYC_REQUEST}`,
        body: { holderType, holderId },
        contentType: "application/json",
        setLoading: setLoading,
      });
    },
    onSuccess: () => {
      //   toast.success("KYC request sent successfully!");
      window.location.reload();
    },
    onError: (err) => {
      console.error(err);
      //   toast.error("Failed to send KYC request. Please try again.");
    },
  });
  const userPermissions = user?.designation?.permissions || [];
  const canSendKyc = hasPermission(userPermissions, "kyc_send_kyc_requests");
  return (
    canSendKyc && (
      <button
        disabled={loading}
        onClick={() => mutation.mutate()}
        className={`text-base font-semibold cursor-pointer w-fit px-3 py-1 rounded-full flex items-center gap-1
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-700 text-white"
        }`}
      >
        <LuSend />
        <span className="mt-[-2px] md:flex hidden">
          {loading ? "Sending..." : "Send KYC Request"}
        </span>
        <span className="mt-[-2px] md:hidden flex">KYC</span>
      </button>
    )
  );
};

export default KycRequestButton;
