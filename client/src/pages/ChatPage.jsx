import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const ChatPage = ()  => {
    return (
        <div className="h-screen flex">
            <Sidebar />
            <ChatWindow />
        </div>      
    );
};

export default ChatPage;