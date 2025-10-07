import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Axios from "../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useSocket } from "../socket";

const topbarVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

const roleColors = {
  admin: "bg-green-100 text-green-700 border-green-400",
  superAgent: "bg-blue-100 text-blue-700 border-blue-400",
  agent: "bg-purple-100 text-purple-700 border-purple-400",
  superAffiliate: "bg-yellow-100 text-yellow-700 border-yellow-400",
  affiliate: "bg-pink-100 text-pink-700 border-pink-400",
};

const Topbar = ({ onMenuClick }) => {
  const { logout, isLoading, isLogoutLoading, user } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [selectedNote, setSelectedNote] = useState(null);
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const USER_ID = 1;
  const {
    data: notificationsData,
    refetch,
    isLoading: notificationLoading,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!USER_ID) return null;
      const res = await Axios.get(`/api/users/notifications/${user?.id}?userType=admin`);
      return res.data?.data;
    },
    enabled: !!USER_ID,
    refetchOnWindowFocus: false,
  });

  const updateNotificationMutation = useMutation({
    mutationFn: async (data) => {
      return Axios.post(`/api/users/notifications-status`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  })


  const notifications = notificationsData || [];

  const handleLogout = () => {
    logout();
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

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  useEffect(() => {

    if (!socket) return;
    socket?.on(`admin-notifications`, (data) => {
      console.log("New notification received", data)
      refetch();
    }
    )
    return () => {
      socket?.removeListener(`admin-notifications`)
    }

  }, [socket])

  return (
    <motion.header
      className="flex items-center justify-between bg-[#07122b] text-white px-4 md:px-6 py-3 shadow-md w-full"
      initial="hidden"
      animate="visible"
      variants={topbarVariants}
    >
      {/* Hamburger menu for mobile */}
      <button
        className="md:hidden mr-2 text-2xl p-2 rounded hover:bg-[#1a2a4a] focus:outline-none"
        onClick={onMenuClick}
        aria-label="Open sidebar menu"
      >
        <FaBars />
      </button>
      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="relative w-fit">
          <div
            className="relative text-white cursor-pointer w-fit z-[999]"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <IoNotificationsOutline size={27} />
            {notificationsData?.length > 0 && (
              <div className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-blue-500 border-2 border-black rounded-full">
                {notificationsData?.length > 9 ? "9+" : notificationsData?.length}
              </div>
            )}
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="fixed md:absolute top-16 md:top-10 bg-[#07122b] text-left right-0 mt-[2px] w-full md:w-80 max-w-[90vw] second-bg profile-shadow shadow-lg rounded-lg overflow-hidden z-[999999]"
            >
              {/* Header */}
              <div className="p-4 pr-2 py-0 flex items-center justify-between border-b border-white/10 mt-3 pb-3 font-semibold text-white text-[14px]">
                Notifications
                <IoIosCloseCircleOutline
                  size={25}
                  className="text-blue-500 cursor-pointer"
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
                      onClick={async () => {

                        if (note?.link) {
                          if (note?.id) {
                            await updateNotificationMutation.mutateAsync({
                              id: note?.id,
                              status: "inactive"
                            })
                          }
                          navigate(note.link);
                          setIsOpen(false);
                        }

                        // setSelectedNote(note)
                      }}
                    >
                      {/* Image with fallback */}
                      <img
                        src={note?.posterImg || ""}
                        className="w-[35px] h-[35px] object-cover rounded-full border-2 border-blue-500"
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
                          <span className="text-[10px] text-blue-500">
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
        </div>
        
        {user?.role === "superAffiliate" && (
          <Link
            to={`/create-affiliate?refCode=${user?.refCode}`}
            className="text-base font-semibold items-center gap-2 flex text-white border px-[10px] pt-[2px] pb-1 rounded-full w-fit text-[16px]"
          >
            + Sub Affiliate
          </Link>
        )}

        {user && (
          <div className="flex items-center max-w-xs truncate">
            <Link
              to={`/affiliate-list/${user?.id}`}
              className="font-semibold items-center gap-2 flex text-white border sm:px-[10px] px-1 sm:pr-[5.5px] pt-[2px] pb-1 rounded-full w-fit text-[14px] sm:text-[16px]"
            >
              <p className="">
                {(user?.fullname || user?.username || user?.email)?.length > 50
                  ? (user?.fullname || user?.username || user?.email)?.slice(
                    0,
                    50
                  ) + "..."
                  : user?.fullname || user?.username || user?.email}
              </p>

              <span
                className={`border rounded-full px-2 py-0.5 text-xs font-semibold capitalize mb-[-3px] whitespace-nowrap ${roleColors[user.role] ||
                  "bg-gray-100 text-gray-700 border-gray-400"
                  }`}
              >
                {user.role}
              </span>
            </Link>
          </div>
        )}

        <button
          className="text-base font-semibold items-center gap-2 flex border px-[10px] pt-[2px] pb-1 rounded-full w-fit text-[16px] bg-red-100 border-red-500 text-red-500"
          onClick={handleLogout}
          disabled={isLoading || isLogoutLoading}
        >
          <span className="sm:flex hidden">
            {isLogoutLoading ? "Logging out..." : "Logout"}{" "}
          </span>
          <FaSignOutAlt className="text-lg mt-1" />
        </button>
      </div>
    </motion.header>
  );
};

export default Topbar;
