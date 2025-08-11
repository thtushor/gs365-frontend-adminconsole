import { API_LIST, BASE_URL } from "../api/ApiList";
import { usePostRequest } from "../Utils/apiClient";
import CreateContentForm from "./CreateContentForm";
import TextEditor from "./shared/TextEditor";

const CreatePopup = ({ popupToEdit, onSuccess, onCancel }) => {
  const postRequest = usePostRequest();

  const handlePopupSubmit = (payload) => {
    return postRequest({
      url: BASE_URL + API_LIST.CREATE_UPDATE_POPUP,
      body: payload,
    });
  };

  return (
    <CreateContentForm
      initialData={popupToEdit}
      onSubmit={handlePopupSubmit}
      onCancel={onCancel}
      titleLabel="Popup Title"
      messageLabel="Popup Description"
      submitLabel={popupToEdit ? "Update Popup" : "Create Popup"}
      TextEditorComponent={({ value, setValue }) => (
        <TextEditor value={value} setValue={setValue} />
      )}
    />
  );
};

export default CreatePopup;
