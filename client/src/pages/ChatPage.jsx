import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));

        const res = await axios.get(`http://localhost:5000/api/users/${currentUser._id}`);

        const filtered = res.data.filter(
          (user) => user._id !== currentUser._id
        );

        setUsers(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("user_online", currentUser._id);
    }
  }, []);

  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("online_users");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      <div className="w-1/4 bg-white border-r flex flex-col">


        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="font-bold text-lg">Chats</h2>
          <button
            onClick={handleLogout}
            className="text-red-500 text-sm"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedUser?._id === user._id ? "bg-gray-200" : ""
                }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{user.username}</p>

                <span
                  className={`h-3 w-3 rounded-full ${onlineUsers.includes(user._id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                    }`}
                ></span>
              </div>

              <div className="flex gap-2">

              <p className="text-sm text-gray-500 truncate">
                {user.lastMessage || "No messages yet"}</p>

                {user.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                    {user.unreadCount}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400">
                {user.lastMessageTime &&
                  new Date(user.lastMessageTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>

              <p className="text-xs">
                {onlineUsers.includes(user._id)
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-3/4 flex flex-col">
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;