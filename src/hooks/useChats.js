import { useQuery } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";

const getChats = async (chatUserType, searchKey) => {
  const response = await Axios.get(API_LIST.CREATE_CHAT, {
    params: { chatUserType, searchKey },
  });
  return response.data.data;
};

export const useChats = (chatUserType, searchKey) => {
  return useQuery({
    queryKey: ["chats", chatUserType, searchKey],
    queryFn: () => getChats(chatUserType, searchKey),
  });
};
