import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:3000'; // Your backend Socket.IO URL

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection only once
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    // Event listeners
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Clean up on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // This function handles emitting events
  const emitEvent = (eventName, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(eventName, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', eventName);
    }
  };

  // Functions to join/leave chat rooms
  const joinChat = (id) => {
    if (socketRef.current && socketRef.current.connected && id) {
      socketRef.current.emit('joinChat', id);
    }
  };

  const leaveChat = (id) => {
    if (socketRef.current && socketRef.current.connected && id) {
      socketRef.current.emit('leaveChat', id);
    }
  };

  // Return socket instance and functions to join/leave/emit
  return { socket: socketRef.current, emitEvent, joinChat, leaveChat };
};
