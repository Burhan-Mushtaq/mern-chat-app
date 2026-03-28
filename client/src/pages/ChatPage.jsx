import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const ChatPage = ()  => {
    const [selectedUser , setSelectedUser] = useState(null);

    return (
        <div className="h-screen flex">
            <Sidebar  setSelectedUser={setSelectedUser}  />
            <ChatWindow selectedUser={selectedUser} />
        </div>      
    );
};

export default ChatPage;