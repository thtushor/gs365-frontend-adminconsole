import { API_LIST, BASE_URL } from "../api/ApiList";
import { usePostRequest } from "../Utils/apiClient";
import CreateContentForm from "./CreateContentForm";
import TextEditor from "./shared/TextEditor";

const CreateFaq = ({ faqToEdit, onSuccess, onCancel }) => {
  const postRequest = usePostRequest();

  const handlePopupSubmit = (payload) => {
    return postRequest({
      url: BASE_URL + API_LIST.CREATE_UPDATE_FAQ,
      body: payload,
    });
  };

  return (
    <CreateContentForm
      initialData={faqToEdit}
      onSubmit={handlePopupSubmit}
      onCancel={onCancel}
      titleLabel="Question"
      messageLabel="Answer"
      submitLabel={faqToEdit ? "Update FAQ" : "Create FAQ"}
      TextEditorComponent={({ value, setValue }) => (
        <TextEditor value={value} setValue={setValue} />
      )}
    />
  );
};

export default CreateFaq;
