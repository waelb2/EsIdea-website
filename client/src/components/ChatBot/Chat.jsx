import React, { useState } from "react";
import { BsChatSquare, BsXCircle } from "react-icons/bs"; // Import chat icon from React Icons
import { GoogleGenerativeAI } from "@google/generative-ai";
import profilePic from "../../assets/profile-pic.png";
import aiProfilePic from "../../assets/ai-profile-pic.png";
import Aichatbot from "../../assets/Aichatbot.png";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showChat, setShowChat] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_KEY); // Replace 'YOUR_API_KEY' with your actual API key

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const chat = model.startChat({
        history: messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          maxOutputTokens: 10000000,
        },
      });

      const result = await chat.sendMessage(inputText);
      const response = result.response.text();

      setMessages([
        ...messages,
        { text: inputText, sender: "user" },
        { text: response, sender: "ai" },
      ]);
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
  };
  const [tooltip, setToolTip] = useState(false);
  return (
    <div className="fixed z-20 bottom-2 left-4 w-5/12">
      <div
        className={`bg-white border-slate-600 border-2 rounded-lg shadow-2xl ${
          showChat ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-between p-2">
          <button onClick={toggleChat}>
            <BsXCircle className="text-3xl text-gray-500 hover:text-gray-700 cursor-pointer" />
          </button>
          <button
            onClick={handleClearConversation}
            className="text-sm text-gray-500 hover:text-red-500 cursor-pointer"
          >
            Clear Conversation
          </button>
        </div>
        <div className="h-52 overflow-y-auto px-4">
          {messages.map((message, index) => (
            <Message key={index} text={message.text} sender={message.sender} />
          ))}
        </div>
        <div className="flex p-2">
          <input
            type="text"
            className="flex-1 border rounded-md p-2 mr-2"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
      <div
        className={`fixed bottom-16 left-4 ${showChat ? "hidden" : "block"}`}
      >
        <button className="relative" onClick={toggleChat}>
          <img
            onMouseOver={() => {
              setToolTip(true);
            }}
            onMouseLeave={() => {
              setToolTip(false);
            }}
            className="text-3xl w-10 cursor-pointer"
            src={Aichatbot}
            alt="Chat Bot"
          />
          <p
            className={`absolute py-0.5 px-1 text-sm rounded-md bg-realWhite ml-3 left-full top-1/2 -translate-y-1/2 transition-opacity duration-500 whitespace-nowrap ${
              tooltip ? "opacity-100" : "opacity-0"
            }`}
          >
            Chat Bot
          </p>
        </button>
      </div>
    </div>
  );
};

const Message = ({ text, sender }) => {
  const messageClass =
    sender === "user" ? "bg-blue-200 self-end" : "bg-gray-200";
  const senderProfilePic = sender === "user" ? profilePic : aiProfilePic;

  return (
    <div className={`flex rounded-lg p-2 my-4 ${messageClass}`}>
      <div className="min-w-8">
        <img
          src={senderProfilePic}
          alt="Profile Pic"
          className="w-8 h-8 rounded-full"
        />
      </div>

      <div>
        <p className="px-4 text-md">{text}</p>
      </div>
    </div>
  );
};

export default Chat;
