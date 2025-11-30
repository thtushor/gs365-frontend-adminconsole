import { BiMessage } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import Axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";

export const HelpCenterIconWithChatsCount = ({ userType, iconClassName }) => {
  const { user } = useAuth();
  const { data: chatsCount } = useQuery({
    queryKey: ["chats-count", userType],
    queryFn: async () => {
      const response = await Axios.get("/api/chats/count-unread", {
        params: {
          affiliateId:
            userType === "admin"
              ? undefined
              : userType === "affiliate"
              ? user.id
              : false,
        },
      });
      return response?.data?.data;
    },
    select: (data) => ({
      total:
        (data?.countGuest ?? 0) +
        (data?.countUser ?? 0) +
        (data?.countAffiliate ?? 0),
    }),
  });

  const totalUnread = chatsCount?.total || 0;

  if (totalUnread <= 0) {
    return null;
  }

  return (
    <div
      className="relative inline-flex items-center justify-center"
      title="Help Center"
    >
      <BiMessage className={`text-2xl text-gray-700 ${iconClassName}`} />

      {totalUnread > 0 && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-semibold animate-pulse">
          {totalUnread}
        </div>
      )}
    </div>
  );
};
