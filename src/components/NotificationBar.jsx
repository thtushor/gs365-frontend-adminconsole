import React, { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NotificationModal from "./NotificationModal";
import Axios from "../api/axios";
import { useSocket } from "../socket";

const NotificationBar = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [pendingNotificationId, setPendingNotificationId] = useState(null);
  const USER_ID = 1;

  const {
    data: notificationsData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["notifications", USER_ID],
    queryFn: async () => {
      if (!USER_ID) return null;
      const res = await Axios.get(`/api/users/notifications/${USER_ID}`);
      return res.data?.data;
    },
    enabled: !!USER_ID,
    refetchOnWindowFocus: false,
  });
  const notifications = notificationsData || [];

  // Outside click check
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const created = new Date(dateString);

    const diffMs = now.getTime() - created.getTime(); // milliseconds
    const diffSec = Math.floor(diffMs / 1000); // seconds
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 5) return "just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 30) return `${diffDay}d ago`;

    return created.toLocaleDateString(); // fallback for old notifications
  };

  // Socket listener for user notifications
  useEffect(() => {
    if (!socket || !USER_ID) return;

    const eventName = `user-notifications-${USER_ID}`;

    const handleNotificationEvent = (payload) => {
      // payload: { userId, event, notificationId, refresh }
      if (payload?.refresh) {
        setPendingNotificationId(payload?.notificationId || null);
        // Invalidate and refetch notifications for this user
        queryClient.invalidateQueries({
          queryKey: ["notifications", USER_ID],
        });
      }
      // Open dropdown to show latest
      setIsOpen(true);
    };

    socket.on(eventName, handleNotificationEvent);
    return () => {
      socket.off(eventName, handleNotificationEvent);
    };
  }, [socket, USER_ID, queryClient]);

  // When notifications update, auto-open the emitted one if present
  useEffect(() => {
    if (
      !pendingNotificationId ||
      !Array.isArray(notifications) ||
      notifications.length === 0
    )
      return;

    const match = notifications.find((note) => {
      const nid = note?.id || note?._id || note?.notificationId;
      return String(nid) === String(pendingNotificationId);
    });

    if (match) {
      setSelectedNote(match);
      setIsOpen(true);
      setPendingNotificationId(null);
    }
  }, [pendingNotificationId, notifications]);

  useEffect(() => {
    if (selectedNote) {
      setIsOpen();
    }
  }, [selectedNote]);

  return (
    <div className="relative">
      {/* Overlay click catcher */}
      {isOpen && (
        <div className="fixed inset-0 z-[998]" onClick={handleClickOutside} />
      )}

      {/* Bell Icon */}
      <div
        className="relative text-yellow-500 cursor-pointer z-[999]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IoNotificationsOutline size={27} />
        <div className="w-[11px] h-[11px] top-[1px] right-[2px] border-black border-2 bg-yellow-500 absolute rounded-full" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute text-left right-[-10px] md:right-0 mt-[2px] w-80 max-w-[90vw] second-bg profile-shadow shadow-lg rounded-lg overflow-hidden z-[999]"
        >
          {/* Header */}
          <div className="p-4 pr-2 py-0 flex items-center justify-between border-b border-white/10 mt-3 pb-3 font-semibold text-white text-[14px]">
            Notifications
            <IoIosCloseCircleOutline
              size={25}
              className="text-yellow-500 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Notification List */}
          <ul className="h-[300px] overflow-y-auto">
            {notifications?.length > 0 ? (
              notifications.map((note, idx) => (
                <li
                  key={idx}
                  className="px-4 py-3 border-b border-white/10 flex gap-2 relative text-sm hover:bg-yellow-500/10 cursor-pointer"
                  onClick={() => setSelectedNote(note)}
                >
                  {/* Image with fallback */}
                  <img
                    src={note?.posterImg}
                    className="w-[35px] h-[35px] object-cover rounded-full border-2 border-yellow-500"
                    alt={note?.title || "Notification"}
                  />

                  {/* Content */}
                  <div>
                    <h1 className="text-[14px] text-white font-medium">
                      {note?.title || "Untitled"}
                    </h1>
                    <p
                      onClick={(e) => {
                        const target = e.target;
                        if (target.tagName === "A") {
                          e.preventDefault(); // stop link navigation
                        }
                      }}
                      className="text-[12px] text-gray-300 truncate max-w-44"
                    >
                      {/* description may contain HTML from backend */}
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            note?.description || "No description available",
                        }}
                      />
                    </p>
                    <div className="absolute bottom-2 right-3 flex items-center gap-2">
                      <span className="text-[10px] text-yellow-300">
                        {formatTimeAgo(note?.createdAt)}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500">
                No notifications
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Conditional Modals */}
      {(selectedNote?.notificationType === "linkable" ||
        selectedNote?.notificationType === "static") && (
        <NotificationModal
          open={!!selectedNote}
          onClose={() => setSelectedNote(null)}
          notification={selectedNote}
          setIsOpen={setIsOpen}
          setSelectedNote={setSelectedNote}
        />
      )}
    </div>
  );
};

export default NotificationBar;
