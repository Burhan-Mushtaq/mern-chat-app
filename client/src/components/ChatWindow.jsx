import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import axios from "axios";

const ChatWindow = ({ selectedUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
  const markAsRead = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    await axios.put(
      `http://localhost:5000/api/messages/read/${selectedUser._id}/${currentUser._id}`
    );
  };

  if (selectedUser) markAsRead();
}, [selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));

        const res = await axios.get(
          `http://localhost:5000/api/messages/${currentUser._id}/${selectedUser._id}`
        );

      setMessages(res.data);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({behavior : "smooth"});
      }, 100);
      } catch (err) {
      console.log(err);
      }
    };

  if (selectedUser) {
    fetchMessages();
    }
  }, [selectedUser]);

    useEffect(() => {
      if (!selectedUser) return;

      const roomId = [currentUserId, selectedUser._id].sort().join("_");

      socket.emit("join_room", roomId);

      return () => {
        socket.off("receive_message");
      };
      }, [selectedUser]);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const msgData = {
      sender: currentUserId,
      receiver: selectedUser._id,
      text: message,
    };

    try {
     socket.emit("send_message", msgData);
      setMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("Send error", err);
    }
  };

  return (
    <div className="flex flex-col h-full">

      <div className="p-4 bg-white border-b shadow-sm">
        <h2 className="font-semibold text-lg">
          {selectedUser.username}
        </h2>
        <p className="text-sm text-gray-500">{selectedUser.email}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs  ${
                msg.sender === currentUserId
                  ? "bg-green-500 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.text}

              <span className="text-xs block text-right opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString([],{
                  hour: "2-digit",
                  minute: "2-digit"
              })}</span>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;