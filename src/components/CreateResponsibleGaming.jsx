import React from "react";
import { usePostRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";
import CreateContentForm from "./CreateContentForm";

const CreateResponsibleGaming = ({
  responsibleGamingToEdit,
  onSuccess,
  onCancel,
}) => {
  const postRequest = usePostRequest();

  const handleResponsibleGamingSubmit = (payload) => {
    return postRequest({
      url: BASE_URL + API_LIST.CREATE_UPDATE_RESPONSIBLE_GAMING,
      body: payload,
    });
  };

  return (
    <CreateContentForm
      initialData={responsibleGamingToEdit}
      onSubmit={handleResponsibleGamingSubmit}
      onCancel={onCancel}
      titleLabel="responsible gaming license name"
      submitLabel={responsibleGamingToEdit ? "Update" : "Create"}
      extraInput={{
        titleName: "name",
        uploadField: "icon",
      }}
      isExtraField={false}
      customTitle="Responsible Gaming License"
      requiredFields={{
        title: true,
        message: false,
        link: false,
      }}
    />
  );
};

export default CreateResponsibleGaming;
