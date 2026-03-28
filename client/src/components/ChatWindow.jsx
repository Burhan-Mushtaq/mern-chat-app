import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";

const ChatWindow = ({ selectedUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});


  const currentUser = "user0";


  const room = selectedUser
    ? [currentUser, selectedUser.id].sort().join("_")
    : "";

  
  useEffect(() => {
    if (room) {
      socket.emit("join_room", room);
    }
  }, [room]);


  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => ({
        ...prev,
        [data.room]: [...(prev[data.room] || []), data],
      }));
    };

    socket.on("receive_message", handleMessage);

     return () => {
     socket.off("receive_message", handleMessage); // ✅ IMPORTANT
     };
    } , []);


  const sendMessage = () => {
    if (!message.trim() || !room) return;

    const msgData = {
      text: message,
      room,
      sender: currentUser,
    };

    
    setMessages((prev) => ({
      ...prev,
      [room]: [...(prev[room] || []), msgData],
    }));

    socket.emit("send_message", msgData);
    setMessage("");
  };

  return (
    <div className="w-3/4 flex flex-col bg-gray-100">
      
      {/* Header */}
      <div className="p-4 bg-white shadow">
        <h2 className="font-bold">
          {selectedUser ? selectedUser.name : "Select a user"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {(messages[room] || []).map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === currentUser
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                msg.sender === currentUser
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      
      <div className="p-3 bg-white flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
