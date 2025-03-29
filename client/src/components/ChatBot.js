import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";
import bot from "../assets/bot.png";
import add from "../assets/add.png";
import ProfilePic from "../assets/default-profile.png";

function ChatBot() {
  //add state for input and chatlog
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const chatLogRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat log whenever it updates
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog]);

  function clearChatLog() {
    setChatLog([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Add the input to the chat log
    setChatLog((prev) => [...prev, { user: "me", message: input }]);

    const userMessage = input; // Capture the user's input
    setInput("");

    // Call the API to get the response
    const response = await fetch("http://localhost:5001/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage, // Send only the user's input
      }),
    });

    const data = await response.json();
    // Add the response to the chat log
    setChatLog((prev) => [...prev, { user: "ai", message: data.message }]);
    console.log(data.message);
  }

  return (
    <div className="chatbot">
      <aside className="sidemenu">
        <div className="sidemenu_header">
          <h2>AI Assistant</h2>
          <img src={bot} alt="bot" />
        </div>

        <div className="sidemenu_chats">
          <div className="sidemenu_chat">
            <div className="chat_details">
              <h3>Manuja</h3> {/* need to add the name of the user */}
              <p>Hi there! How can I help you?</p>
            </div>
          </div>
        </div>

        <button className="sidemenu_newchat" onClick={clearChatLog}>
          New Chat
          <img src={add} alt="add" />
        </button>

        <div className="sidemenu_body"></div>
      </aside>

      <section className="chatbox">
        <div className="chat_log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div
          className="
        chat-input-holder"
        >
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type a message..."
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
          <button className="send-btn" onClick={handleSubmit}>
            send
          </button>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div
      className={`chat_message ${
        message.user === "ai" ? "chat_message_ai" : "chat_message_me"
      }`}
    >
      <div className="chat_message_center">
        <div className={`avatar ${message.user === "ai" ? "bot" : "me"}`}>
          {message.user === "ai" ? (
            <img src={bot} alt="profile" />
          ) : (
            <img src={ProfilePic} alt="profile" />
          )}
        </div>
        <div className="chat_msg">{message.message}</div>
      </div>
    </div>
  );
};

export default ChatBot;
