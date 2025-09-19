import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { API_LIST } from "../api/ApiList";


import Axios from "../api/axios";
import { useAuth } from "./useAuth";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null); // This will now hold the specific chat conversation object
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(
    async (chatId) => {
      if (!chatId) {
        setMessages([]); // Clear messages if no chat is selected
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `${API_LIST.GET_MESSAGES}/${chatId}`
        );
        setMessages(response.data.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createChat = useCallback(
    async (initialMessageContent, targetUserId = null, targetAdminId = null) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          initialMessageContent,
        };
        if (targetUserId) payload.userId = targetUserId;
        if (targetAdminId) payload.adminUserId = targetAdminId;

        const response = await axiosInstance.post(API_LIST.CREATE_CHAT, payload);
        setSelectedChat(response.data.data); // The response should return the new chat object
        fetchMessages(response.data.data.id);
        return response.data.data;
      } catch (err) {
        setError(err);
        console.error("Error creating chat:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchMessages]
  );

  const sendMessage = useCallback(
    async (chatId, content, attachmentUrl = null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.post(API_LIST.SEND_MESSAGE, {
          chatId,
          senderId: user.id,
          senderType: user.role === "admin" ? "admin" : "user",
          content,
          attachmentUrl,
        });
        setMessages((prevMessages) => [...prevMessages, response.data.data]);
        return response.data.data;
      } catch (err) {
        setError(err);
        console.error("Error sending message:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const readMessages = useCallback(
    async (chatId) => {
      if (!chatId) return;
      try {
        await axiosInstance.post(`${API_LIST.READ_MESSAGES}/${chatId}`, {
          senderType: user.role === "admin" ? "admin" : "user",
        });
        // Optionally update message status in local state if needed
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    },
    [user]
  );

  useEffect(() => {
    if (selectedChat?.id) {
      fetchMessages(selectedChat.id);
      readMessages(selectedChat.id);
    } else {
      setMessages([]); // Clear messages if no chat is selected
    }
  }, [selectedChat, fetchMessages, readMessages]);

  const value = {
    selectedChat,
    setSelectedChat,
    messages,
    loading,
    error,
    fetchMessages,
    createChat,
    sendMessage,
    readMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
