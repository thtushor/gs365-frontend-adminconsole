import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

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

  const handleLogout = () => {
    logout();
  };

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
              className="text-base font-semibold items-center gap-2 flex text-white border px-[10px] pr-[5.5px] pt-[2px] pb-1 rounded-full w-fit text-[16px]"
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
                className={`border rounded-full px-2 py-0.5 text-xs font-semibold capitalize mb-[-3px] whitespace-nowrap ${
                  roleColors[user.role] ||
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
          {isLogoutLoading ? "Logging out..." : "Logout"}{" "}
          <FaSignOutAlt className="text-lg mt-1" />
        </button>
      </div>
    </motion.header>
  );
};

export default Topbar;
