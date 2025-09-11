import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { useGetRequest, usePostRequest } from "../Utils/apiClient";
import CreateContentForm from "./CreateContentForm";
import TextEditor from "./shared/TextEditor";

const CreateFaq = ({ faqToEdit, onSuccess, onCancel }) => {
  const postRequest = usePostRequest();
  const getRequest = useGetRequest();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL + API_LIST.GET_DROPDOWN}?id=3`,
      }),
    select: (res) =>
      res?.data?.options?.filter((opt) => opt.status === "active") || [],
  });

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
      customTitle="Create Question"
      submitLabel={faqToEdit ? "Update FAQ" : "Create FAQ"}
      TextEditorComponent={({ value, setValue }) => (
        <TextEditor value={value} setValue={setValue} />
      )}
      categories={categories}
    />
  );
};

export default CreateFaq;
