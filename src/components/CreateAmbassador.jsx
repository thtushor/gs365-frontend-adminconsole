import React from "react";
import { usePostRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";
import CreateContentForm from "./CreateContentForm";
import TextEditor from "./shared/TextEditor";

const CreateAmbassador = ({ ambassadorToEdit, onSuccess, onCancel }) => {
  const postRequest = usePostRequest();

  const handleSponsorSubmit = (payload) => {
    return postRequest({
      url: BASE_URL + API_LIST.CREATE_UPDATE_AMBASSADOR,
      body: payload,
    });
  };

  return (
    <CreateContentForm
      initialData={ambassadorToEdit}
      onSubmit={handleSponsorSubmit}
      onCancel={onCancel}
      titleLabel="Ambassador name"
      messageLabel="Description"
      submitLabel={ambassadorToEdit ? "Update" : "Create"}
      isDescription
      extraInput={{
        paramName: "signature",
        placeholder: "Enter signature",
        titleName: "name",
        durationField: "duration",
        uploadField: "photo",
      }}
      customTitle="Create Ambassador"
      isDuration
      requiredFields={{
        title: true,
        message: false,
        link: true,
      }}
    />
  );
};

export default CreateAmbassador;
