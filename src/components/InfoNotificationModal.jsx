import { Link } from "react-router-dom";
import BaseModal from "./shared/BaseModal";

const InfoNotificationModal = ({ open, onClose, notification }) => {
  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="text-center">
        <img
          src={notification.posterImg}
          alt={notification.title}
          className="w-full h-40 object-cover rounded-xl mb-3"
        />
        <h2 className="text-lg font-bold text-white">{notification.title}</h2>
        <p
          className="text-sm text-gray-300 mb-4"
          dangerouslySetInnerHTML={{ __html: notification.description }}
        />

        {notification.notificationType === "linkable" && notification.link && (
          <Link
            to={notification.link}
            className="inline-block w-full py-2 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            View Details
          </Link>
        )}
      </div>
    </BaseModal>
  );
};

export default InfoNotificationModal;
