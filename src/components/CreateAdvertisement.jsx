import React from "react";
import { usePostRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";
import CreateContentForm from "./CreateContentForm";
import TextEditor from "./shared/TextEditor";

const CreateAdvertisement = ({ advertisementToEdit, onSuccess, onCancel }) => {
  const postRequest = usePostRequest();

  const handleAnnouncementSubmit = (payload) => {
    return postRequest({
      url: BASE_URL + API_LIST.CREATE_UPDATE_ADVERTISEMENT,
      body: payload,
    });
  };

  return (
    <CreateContentForm
      initialData={advertisementToEdit}
      onSubmit={handleAnnouncementSubmit}
      onCancel={onCancel}
      titleLabel="Advertisement Title"
      messageLabel="Advertisement Description"
      submitLabel={advertisementToEdit ? "Update" : "Create"}
      extraInput={{ paramName: "videoUrl", placeholder: "Enter video url" }}
      customTitle="Create Advertisement"
      requiredFields={{
        title: true,
        message: false,
        link: true,
      }}
      TextEditorComponent={({ value, setValue }) => (
        <TextEditor value={value} setValue={setValue} />
      )}
      isDescription={true}
    />
  );
};

export default CreateAdvertisement;
