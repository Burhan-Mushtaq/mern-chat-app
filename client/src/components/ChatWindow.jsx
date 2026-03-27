import { useEffect , useState } from "react";
import socket from "../socket";


const ChatWindow = () => {

    const [message , setMessage] = useState("");

    const [messages , setMessages] = useState([]);

    useEffect(() => {
    const handleMessage = (data) => {
    console.log("Received:", data);
    setMessages((prev) => [...prev, data]);
    };

     socket.on("receive_message", handleMessage);

     return () => {
     socket.off("receive_message", handleMessage); 
     };
    } , []);


    const sendMessage = () => {
        if(message.trim() === "") return;

        const msgData = {
            text : message,
            sender : "me",
        }

        socket.emit("send_message", msgData);
        setMessage("");
  };

    return (
    <div className="w-3/4 flex flex-col bg-gray-100">
      
      
      <div className="p-4 bg-white shadow">
        <h2 className="font-bold">Chat</h2>
      </div>

      
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "me"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                msg.sender === "me"
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
