import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
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
  subtitle,
  index = 0,
}) => (
  <motion.div
    className={`border-l-4 ${color} rounded-lg p-6 flex flex-col gap-3 bg-white shadow-md min-w-[200px] cursor-pointer hover:shadow-lg transition-all duration-300`}
    custom={index}
    initial="hidden"
    animate="visible"
    variants={cardVariants}
    whileHover={{
      scale: 1.02,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-between">
      <span className="bg-gray-100 p-3 rounded-full text-gray-700 shadow-sm transition-all duration-300">
        {icon}
      </span>
      {trend === "up" && (
        <FaArrowUp className="text-green-500 text-sm animate-pulse" />
      )}
      {trend === "down" && (
        <FaArrowDown className="text-red-500 text-sm animate-pulse" />
      )}
      {trend === "neutral" && (
        <FaMinus className="text-gray-400 text-sm" />
      )}
    </div>
    
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-500 font-medium">{title}</span>
      <span className={`text-xl font-bold ${textColor}`}>
        {value}
      </span>
      {subtitle && (
        <span className="text-xs text-gray-400 font-medium">
          {subtitle}
        </span>
      )}
    </div>
  </motion.div>
);

export default DashboardCard;
