import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './GroupChat.css';

function GroupChat({ groupId, groupName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const { user, token } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!token) {
      setError('Please log in to view messages');
      return;
    }

    try {
      const response = await axios.get(`/api/messages/${groupId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load messages');
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [groupId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please log in to send messages');
      return;
    }
    if (!newMessage.trim()) return;

    try {
      await axios.post('/api/messages', {
        content: newMessage,
        groupId,
        senderName: `${user.firstName} ${user.lastName}`
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to send message');
      }
    }
  };

  if (!token) {
    return (
      <div className="group-chat">
        <div className="chat-header">
          <h3>{groupName} Chat</h3>
        </div>
        <div className="messages-container">
          <div className="error-message">
            Please log in to participate in the chat
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group-chat">
      <div className="chat-header">
        <h3>{groupName} Chat</h3>
      </div>
      <div className="messages-container">
        {error && <div className="error-message">{error}</div>}
        {messages.map((message) => (
          <div 
            key={message._id} 
            className={`message ${message.sender === user.id ? 'sent' : 'received'}`}
          >
            <div className="message-sender">{message.senderName}</div>
            <div className="message-content">{message.content}</div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default GroupChat; 