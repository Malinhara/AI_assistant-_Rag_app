"use client";
import { useState } from "react";
import Sidemenu from "../componets/sidemenu/sidemenu";



// Define a type for chat messages
interface Message {
  text: string;
  from: "user" | "bot";
}

export default function Chatui() {
  const [message, setMessage] = useState<string>(""); // Store the input message
  const [messages, setMessages] = useState<Message[]>([]); // Store chat history

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, from: "user" }, // Add user message to chat
      ]);
      setMessage(""); // Clear the input field after sending

      // Simulate a bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "This is a bot response.", from: "bot" }, // Example bot response
        ]);
      }, 1000);
    }
  };

  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left navigation panel */}
      {<Sidemenu/>}
      <div className="flex flex-col flex-grow w-full h-full bg-white">
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg mb-2 max-w-xs ${
                  msg.from === "user" ? "bg-indigo-600 text-white" : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input field and Send button */}
        <div className="p-4 border-t">
          <div className="flex text-black">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-l-md focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 text-white py-2 px-4 rounded-r-md hover:bg-indigo-700">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
