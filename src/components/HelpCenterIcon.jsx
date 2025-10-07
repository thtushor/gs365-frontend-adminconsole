import { BiMessage } from "react-icons/bi";
import { useChat } from "../hooks/useChat";

export const HelpCenterIconWithChatsCount = () => {

    const { messages } = useChat();

    const unreadMessagesCount = messages?.filter(

    return (
        <div className="-top-2 left-4 relative inline-block" title="You have new messages">
            {/* Replace this div with your Help icon */}
            {/* <div className="w-4 h-4 flex items-center justify-center">
        <BiMessage size={10} />
      </div> */}

            {/* Blinking red circle */}
            <span className="absolute top-0 right-0 block w-3 h-3 rounded-full bg-red-600 animate-ping"></span>

            {/* Solid red dot (stays visible while ping animates) */}
            <span className="absolute top-0 right-0 block w-3 h-3 rounded-full bg-red-600"></span>
        </div>
    );
};
