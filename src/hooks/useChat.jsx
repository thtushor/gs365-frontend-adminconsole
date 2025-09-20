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

  const [selectedChatUser, setSelectedChatUser] = useState(null); // This will hold the selected user object with its chats array
  const [activeConversation, setActiveConversation] = useState(null); // This will hold the specific active chat conversation

  const { socket, emitEvent, joinChat, leaveChat } = useSocket(); // Initialize socket without chatId

  // Effect to determine the active conversation when selectedChatUser changes and handle joining/leaving chat rooms
  useEffect(() => {
    let previousChatId = null;
    if (activeConversation?.id) {
      previousChatId = activeConversation.id;
    }

    if (selectedChatUser && selectedChatUser.chats && selectedChatUser.chats.length > 0) {
      const latestChat = selectedChatUser.chats.reduce((prev, current) =>
        (prev.id > current.id) ? prev : current
      );
      setActiveConversation(latestChat);
      if (latestChat.id && latestChat.id !== previousChatId) {
        joinChat(latestChat.id);
      }
    } else {
      setActiveConversation(null);
      if (previousChatId) {
        leaveChat(previousChatId);
      }
    }

    return () => {
      if (previousChatId) {
        leaveChat(previousChatId);
      }
    };
  }, [selectedChatUser, joinChat, leaveChat]); // Add joinChat and leaveChat to dependencies

  // Fetch messages using useQuery
  const {
    data: messages = [],
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["chatMessages", activeConversation?.id],
    queryFn: async () => {
      if (!activeConversation?.id) return [];
      const response = await Axios.get(
        `${API_LIST.GET_MESSAGES}/${activeConversation.id}`
      );
      return response.data.data;
    },
    enabled: !!activeConversation?.id, // Only run query if activeConversation.id exists
  });

  // Create chat using useMutation
  const createChatMutation = useMutation({
    mutationFn: async ({ initialMessageContent, targetUserId, targetAdminId, attachmentUrl, senderType }) => {
      const payload = { initialMessageContent, attachmentUrl, senderType };
      if (targetUserId) payload.userId = targetUserId;
      if (targetAdminId) payload.adminUserId = targetAdminId;

      console.log({payload})
      const response = await Axios.post(API_LIST.CREATE_CHAT, payload);
      return response.data.data;
    },
    onSuccess: (newChat) => {
      setActiveConversation(newChat);
      queryClient.invalidateQueries({ queryKey: ["chatMessages", newChat.id] });
      queryClient.invalidateQueries({ queryKey: ["userChats"] }); // Invalidate all user chats to reflect new chat
      queryClient.invalidateQueries({queryKey: ["chats"]})
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages", activeConversation?.id] });
      queryClient.invalidateQueries({queryKey: ["chats"]})
    },
    onError: (err) => {
      console.error("Error sending message:", err);
    },
  });
  // Read messages using useMutation
  const readMessagesMutation = useMutation({
    mutationFn: async (chatId) => {
      if (!chatId) return;
      await Axios.post(`${API_LIST.READ_MESSAGES}/${chatId}`, {
        senderType: user.role === "admin" ? "admin" : "user",
      });
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
  const lastReadChatIdRef = useRef(null);

  // Effect to mark messages as read when activeConversation changes
  useEffect(() => {
    if (activeConversation?.id && activeConversation.id !== lastReadChatIdRef.current) {
      readMessagesMutation.mutate(activeConversation.id);
      lastReadChatIdRef.current = activeConversation.id; // Update the ref after mutation
    }
  }, [activeConversation, readMessagesMutation]);

  // Effect to handle socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      console.log("New message received via socket:", message);
      // Invalidate queries to refetch messages for the active conversation
      queryClient.invalidateQueries({ queryKey: ["chatMessages", activeConversation?.id] });
      queryClient.invalidateQueries({queryKey: ["chats"]})
      // Optionally, if the new message is for the active conversation, mark it as read
      if (activeConversation?.id === message.chatId) {
        readMessagesMutation.mutate(activeConversation.id);
      }
    };

    const handleChatUpdated = (chatUpdate) => {
      console.log("Chat updated via socket:", chatUpdate);
      // Invalidate queries that list chats or specific chat details
      queryClient.invalidateQueries({ queryKey: ["userChats"] }); // Assuming a query key for all user chats
      queryClient.invalidateQueries({ queryKey: ["chatMessages", chatUpdate.id] }); // Invalidate messages for the updated chat
      queryClient.invalidateQueries({queryKey: ["chats"]})
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("chatUpdated", handleChatUpdated);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("chatUpdated", handleChatUpdated);
    };
  }, [socket, activeConversation?.id, queryClient, readMessagesMutation]);


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
