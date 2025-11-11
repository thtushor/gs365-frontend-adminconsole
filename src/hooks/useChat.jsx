import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_LIST, SINGLE_IMAGE_UPLOAD_URL } from "../api/ApiList";


import Axios from "../api/axios";
import { useAuth } from "./useAuth";
import axios from "axios";
import { useSocket } from "../socket"; // Import useSocket

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isAffiliate = ["superAffiliate",
    "affiliate"].includes(user.role)

  const [selectedChatUser, setSelectedChatUser] = useState(null); // This will hold the selected user object with its chats array
  const [activeConversation, setActiveConversation] = useState(null); // This will hold the specific active chat conversation

  const { socket, emitEvent, joinChat, leaveChat } = useSocket(); // Initialize socket without chatId

  // Fetch messages using useQuery
  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["chatMessages", {
      ...user, selectedChatUser
    }],
    queryFn: async () => {
      const isSelectedAdminChat = Boolean(selectedChatUser?.role)
      const url = isAffiliate ? `${API_LIST.ADMIN_USER_MESSAGES}/${user?.id}/admin` : `${API_LIST.ADMIN_USER_MESSAGES}/${selectedChatUser?.type === "guest" ? selectedChatUser?.guestId : selectedChatUser?.id}/${isSelectedAdminChat ? "admin" : selectedChatUser?.type === "guest" ? "guest" : "user"}`
      // const url = isAffiliate ? `${API_LIST.ADMIN_USER_MESSAGES}/${user.id}/admin` : `${API_LIST.GET_MESSAGES}/${activeConversation.id}`
      // if (!activeConversation?.id && !isAffiliate) return [];
      const response = await Axios.get(url);

      queryClient.invalidateQueries({ queryKey: ["chats"] })
      return response.data.data;
    },
    enabled: isAffiliate ? !!user.id : !!(selectedChatUser?.type === "guest" ? selectedChatUser?.guestId : selectedChatUser?.id), // Only run query if activeConversation.id exists
    // refetchInterval: 2 * 1000,
  });


  const lastMessage = messages[messages?.length - 1];

  useEffect(() => {
    socket?.on(`newMessage`, (data) => {
      console.log("New message found", data)
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", {
          ...user, selectedChatUser
        }]
      });
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chats-count"] })
    })

    return () => {
      socket?.removeListener(`newMessage`)
    }
  }, [lastMessage?.chatId, socket])

  useEffect(() => {
    if (lastMessage?.chatId)
      joinChat(String(lastMessage?.chatId));

  }, [lastMessage?.chatId]);

  // Create chat using useMutation
  const createChatMutation = useMutation({
    mutationFn: async ({ initialMessageContent, targetUserId, targetAdminId, targetAffiliateId, attachmentUrl, senderType }) => {
      const payload = { initialMessageContent, attachmentUrl, senderType };
      if (targetUserId) payload.userId = targetUserId;
      if (targetAdminId) payload.adminUserId = targetAdminId;
      if (targetAdminId) payload.adminUserId = targetAdminId;
      if (targetAffiliateId) payload.targetAffiliateId = targetAffiliateId;

      const response = await Axios.post(API_LIST.CREATE_CHAT, payload);
      return response.data.data;
    },
    onSuccess: (newChat, arg) => {
      setActiveConversation(newChat);
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", {
          ...user, selectedChatUser
        }]
      });
      queryClient.invalidateQueries({ queryKey: ["userChats"] }); // Invalidate all user chats to reflect new chat
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      emitEvent('sendMessage', {
        ...arg,
        chatId: String(arg.chatId)
      });
    },
    onError: (err) => {
      console.error("Error creating chat:", err);
    },
  });

  // Send message using useMutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content, attachmentUrl }) => {
      const response = await Axios.post(API_LIST.SEND_MESSAGE, {
        chatId,
        senderId: user.id,
        senderType: ["superAdmin",
          "admin",
          "superAgent",
          "agent",
          "superAffiliate",
          "affiliate"].includes(user.role) ? "admin" : "user",
        content,
        attachmentUrl,
      });
      return response.data.data;
    },
    onSuccess: (_, arg) => {

      emitEvent('sendMessage', {
        ...arg,
        chatId: String(arg.chatId)
      });

      queryClient.invalidateQueries({
        queryKey: ["chatMessages", {
          ...user, selectedChatUser
        }]
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      queryClient.invalidateQueries({ queryKey: ["chats-count"] })
    },
    onError: (err) => {
      console.error("Error sending message:", err);
    },
  });
  // Read messages using useMutation
  const readMessagesMutation = useMutation({
    mutationFn: async ({ chatId, status }) => {
      if (!chatId) return;
      await Axios.put(`${API_LIST.CREATE_CHAT}/${chatId}/status`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", {
          ...user, selectedChatUser
        }]
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      queryClient.invalidateQueries({ queryKey: ["chats-count"] })
    },
    onError: (err) => {
      console.error("Error marking messages as read:", err);
    },
  });

  // Upload attachment using useMutation
  const uploadAttachmentMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file); // Adjusted to 'file' based on ImageUploadTestPage.jsx
      const response = await axios.post(SINGLE_IMAGE_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data.original; // Adjusted to 'original' based on ImageUploadTestPage.jsx
    },
    onError: (err) => {
      console.error("Error uploading attachment:", err);
    },
  });

  // Use a ref to track the last chat ID for which messages were marked as read
  // const lastReadChatIdRef = useRef(null);

  console.log({ lastMessage })

  // Effect to mark messages as read when activeConversation changes
  useEffect(() => {
    const statusCheck = isAffiliate ? "pending_user_response" : "pending_admin_response"
    if (lastMessage?.chatId && lastMessage?.chat?.status === statusCheck) {
      readMessagesMutation.mutate({
        chatId: Number(lastMessage?.chatId),
        status: "open"
      });
    }
  }, [lastMessage?.chatId,lastMessage?.chat?.status,user.role]);


  const value = {
    selectedChat: selectedChatUser,
    setSelectedChat: setSelectedChatUser,
    activeConversation,
    messages,
    loading: messagesLoading || createChatMutation.isPending || sendMessageMutation.isPending || readMessagesMutation.isPending || uploadAttachmentMutation.isPending,
    error: messagesError || createChatMutation.error || sendMessageMutation.error || readMessagesMutation.error || uploadAttachmentMutation.error,
    createChat: createChatMutation.mutateAsync, // Expose mutate function
    sendMessage: sendMessageMutation.mutateAsync, // Expose mutate function
    readMessages: readMessagesMutation.mutate, // Expose mutate function
    uploadAttachment: uploadAttachmentMutation.mutateAsync, // Expose upload attachment function
    refetchMessages, // Expose refetch for messages
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
