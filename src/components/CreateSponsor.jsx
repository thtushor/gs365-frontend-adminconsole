import React from "react";
import { usePostRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";
import CreateContentForm from "./CreateContentForm";
import TextEditor from "./shared/TextEditor";

const CreateSponsor = ({ sponsorToEdit, onSuccess, onCancel }) => {
  const postRequest = usePostRequest();

  const handleSponsorSubmit = (payload) => {
    return postRequest({
      url: BASE_URL + API_LIST.CREATE_UPDATE_SPONSOR,
      body: payload,
    });
  };

  return (
    <CreateContentForm
      initialData={sponsorToEdit}
      onSubmit={handleSponsorSubmit}
      onCancel={onCancel}
      titleLabel="Sponsor Title"
      messageLabel="Description"
      submitLabel={sponsorToEdit ? "Update" : "Create"}
      isDescription
      extraInput={{
        paramName: "companyType",
        placeholder: "Enter company type",
        titleName: "name",
        durationField: "duration",
        uploadField: "logo",
      }}
      customTitle="Create Sponsor"
      isDuration
      requiredFields={{
        title: true,
        message: false,
        link: true,
      }}
    />
  );
};

export default CreateSponsor;
