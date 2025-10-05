import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BaseModal from "./shared/BaseModal";
const NotificationModal = ({
  open,
  onClose,
  setSelectedNote,
  notification,
}) => {
  const navigate = useNavigate();
  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="text-center">
        {notification.posterImg && (
          <img
            src={notification.posterImg}
            alt={notification.title}
            className="w-full h-40 object-cover rounded-xl mb-3"
          />
        )}
        <h2 className="text-lg font-bold text-white">
          {notification?.title || "Title"}
        </h2>
        <p
          className="text-sm text-gray-300 mb-2 [&_table]:w-full 
    [&_table]:text-white 
    [&_td]:px-2 
    [&_th]:px-2 
    [&_table]:border 
    [&_th]:border 
    [&_td]:border 
    [&_table]:border-white 
    [&_td]:border-white 
    [&_th]:border-white 
    [&_ul]:list-disc 
    [&_ol]:list-decimal 
    [&_ul]:pl-5 
    [&_ol]:pl-5 
    [&_li]:text-white 
    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-5
    [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-5
    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5
    [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-5
    [&_h5]:text-base [&_h5]:font-medium [&_h5]:mt-5
    [&_h6]:text-sm [&_h6]:font-medium [&_h6]:mt-5"
          dangerouslySetInnerHTML={{ __html: notification?.description }}
        />

        {notification?.notificationType === "linkable" && (
          <div className="header-auth">
            <div
              onClick={() => {
                setSelectedNote(null);
                onClose();
                navigate(`/deposit?promotionId=${notification?.promotionId}`);
              }}
              className="signup-btn mx-auto py-2 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Deposit
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default NotificationModal;
