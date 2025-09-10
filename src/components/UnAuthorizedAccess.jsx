import { motion } from "framer-motion";
import { BiLock } from "react-icons/bi";
// import { FaTools } from "react-icons/fa";

const UnAuthorized = ({ title = "Unauthorized Access" }) => (
  <motion.div
    className="flex flex-col items-center justify-center h-full text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <BiLock className="text-6xl text-[#3ecf8e] mb-4 animate-spin-slow" />
    <h2 className="text-3xl font-bold mb-2 text-gray-800">{title}</h2>
    <p className="text-gray-500 text-lg">
      You do not have permission to access this page. Please contact your
      administrator if you believe this is an error.
    </p>
  </motion.div>
);

export default UnAuthorized;
