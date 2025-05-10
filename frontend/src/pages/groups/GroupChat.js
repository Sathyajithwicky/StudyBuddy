import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './GroupChat.css';

function GroupChat({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    }
  };

  useEffect(() => {
    fetchMessages();
    // Set up polling to fetch new messages
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      console.log('Token from storage:', token); // Debug log

      if (!token) {
        setError('Not authenticated. Please log in again.');
        return;
      }

      const response = await axios.post('/api/messages', {
        content: newMessage,
        groupId,
        senderName: `${user.firstName} ${user.lastName}`
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Message sent successfully:', response.data);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="chat-container">
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