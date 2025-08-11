import { FaArrowUp, FaArrowDown } from "react-icons/fa";
// import { motion } from "framer-motion";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 80, damping: 15 },
  }),
};

const DashboardCard = ({
  icon,
  title,
  value,
  color,
  textColor,
  trend,
  index = 0,
}) => (
  <motion.div
    className={`border-2 ${color} rounded-lg p-6 flex flex-col gap-2 bg-white shadow-sm min-w-[200px] cursor-pointer`}
    custom={index}
    initial="hidden"
    animate="visible"
    variants={cardVariants}
    whileHover={{
      scale: 1.05,
      boxShadow: "0 8px 32px rgba(62, 207, 142, 0.15)",
    }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-3">
      <span className="bg-gray-100 p-2 rounded-full text-gray-700 shadow-md transition-all duration-300">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <span className={`text-xl font-semibold ${textColor}`}>
          {value}{" "}
          {trend === "up" ? (
            <FaArrowUp className="inline text-green-500 ml-1 animate-bounce" />
          ) : (
            <FaArrowDown className="inline text-red-500 ml-1 animate-bounce" />
          )}
        </span>
      </div>
    </div>
  </motion.div>
);

export default DashboardCard;
