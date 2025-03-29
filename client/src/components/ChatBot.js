import React, { useState } from "react";
import "./ChatBot.css";
import bot from "../assets/bot.png";
import add from "../assets/add.png";
import ProfilePic from "../assets/default-profile.png";

function ChatBot() {
  //add state for input and chatlog
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { user: "ai", message: "Hi there! How can I help you?" },
    { user: "me", message: "I want to use the Ai Assistant today" },
  ]);

  async function handleSubmit(e) {
    e.preventDefault();
    //add the input to the chatlog
    setChatLog([...chatLog, { user: "me", message: `${input}` }]);

    setInput("");
    //call the api to get the response
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    setChatLog((prev) => [...prev, { text: data.message, sender: "ai" }]);
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

        <button className="sidemenu_newchat">
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
          <form onSubmit={handleSubmit}>
            <input
              type="textarea"
              placeholder="Type a message..."
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
          <button className="send-btn">send</button>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className="chat_message">
      <div className="chat_message_center">
        <div className="avatar">
          <img src={ProfilePic} alt="profile" />
        </div>
        <div className="chat_msg">{message.message}</div>
      </div>
    </div>
  );
};

export default ChatBot;
