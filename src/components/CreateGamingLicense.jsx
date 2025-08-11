import React from "react";
import { usePostRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";
import CreateContentForm from "./CreateContentForm";

const CreateGamingLicense = ({ gamingLicenseToEdit, onSuccess, onCancel }) => {
  const postRequest = usePostRequest();

  const handleGamingLicenseSubmit = (payload) => {
    return postRequest({
      url: BASE_URL + API_LIST.CREATE_UPDATE_GAMING_LICENSE,
      body: payload,
    });
  };

  return (
    <CreateContentForm
      initialData={gamingLicenseToEdit}
      onSubmit={handleGamingLicenseSubmit}
      onCancel={onCancel}
      titleLabel="Gaming license name"
      submitLabel={gamingLicenseToEdit ? "Update" : "Create"}
      extraInput={{
        titleName: "name",
        durationField: "duration",
        uploadField: "icon",
      }}
      isExtraField={false}
      customTitle="Create Gaming License"
      isDuration
      requiredFields={{
        title: true,
        message: false,
        link: false,
      }}
    />
  );
};

export default CreateGamingLicense;
