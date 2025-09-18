import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:3000'; // Your backend Socket.IO URL

export const useSocket = (chatId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      query: { chatId }, // Pass chatId or other relevant info
      transports: ['websocket', 'polling'],
    });

    // Event listeners
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
      if (chatId) {
        socketRef.current.emit('joinChat', chatId); // Join a specific chat room
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current.on('newMessage', (message) => {
      console.log('New message received:', message);
      // Handle new message, e.g., update React Query cache or state
    });

    socketRef.current.on('chatUpdated', (chatUpdate) => {
      console.log('Chat updated:', chatUpdate);
      // Handle chat updates
    });

    // Clean up on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [chatId]); // Reconnect if chatId changes

  const emitEvent = (eventName, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(eventName, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', eventName);
    }
  };

  return { socket: socketRef.current, emitEvent };
};
