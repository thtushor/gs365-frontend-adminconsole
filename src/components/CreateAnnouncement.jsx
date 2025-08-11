import React from "react";
import { usePostRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";
import CreateContentForm from "./CreateContentForm";
import TextEditor from "./shared/TextEditor";

const CreateAnnouncement = ({ announcementToEdit, onSuccess, onCancel }) => {
  const postRequest = usePostRequest();

  const handleAnnouncementSubmit = (payload) => {
    return postRequest({
      url: BASE_URL + API_LIST.CREATE_UPDATE_ANNOUNCEMENT,
      body: payload,
    });
  };

  return (
    <CreateContentForm
      initialData={announcementToEdit}
      onSubmit={handleAnnouncementSubmit}
      onCancel={onCancel}
      titleLabel="Announcement Title"
      messageLabel="Announcement Message"
      submitLabel={announcementToEdit ? "Update" : "Create"}
      isDescription={true}
    />
  );
};

export default CreateAnnouncement;
