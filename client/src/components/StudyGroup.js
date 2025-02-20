import React, { useState, useEffect, useRef } from 'react';
import './StudyGroup.css';
import { IoSend } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5001';

function StudyGroup({ subject, materials }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messages/${subject}`);
      if (response.data && Array.isArray(response.data)) {
        // Sort messages by timestamp
        const sortedMessages = response.data.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sortedMessages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [subject]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Create new message object
      const messageData = {
        content: newMessage,
        studyGroup: subject,
        userId: user._id,
        userName: user.firstName,
        timestamp: new Date()
      };

      // Clear input immediately
      setNewMessage('');

      // Add message to local state immediately
      setMessages(prevMessages => [...prevMessages, messageData]);
      scrollToBottom();

      // Send message to server
      await axios.post('/api/messages', messageData);

      // Fetch updated messages
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="study-group-container">
      <div className="group-header">
        <h1>{subject} Study Group</h1>
      </div>

      <div className="study-group-layout">
        {/* Left Side - Study Materials */}
        <div className="materials-section">
          <div className="materials-header">
            <h2>Study Materials</h2>
          </div>
          <div className="materials-list">
            {materials.map((material, index) => (
              <div key={index} className="material-item">
                <span className="material-icon">📄</span>
                <span className="material-name">{material.name}</span>
                <button className="download-btn">Download</button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat Room */}
        <div className="chat-section">
          <div className="chat-header">
            <h2>Group Chat</h2>
          </div>
          <div className="chat-messages" ref={chatContainerRef}>
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div 
                  key={message._id || index}
                  className={`message ${message.userId === user._id ? 'message-own' : 'message-other'}`}
                >
                  <div className="message-header">
                    <span className="message-user">{message.userName}</span>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-content">{message.content}</div>
                </div>
              ))
            ) : (
              <div className="no-messages">No messages yet</div>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="chat-input-area">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              <IoSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudyGroup; 