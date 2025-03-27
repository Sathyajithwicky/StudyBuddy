import React, { useState, useEffect } from 'react';
import './Notifications.css';
import { FaBell, FaCheckCircle, FaUserFriends, FaBook, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

const Notifications = () => {
  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'group_invite',
      title: 'New Group Invitation',
      message: 'You have been invited to join Physics Study Group',
      time: '2 hours ago',
      read: false,
      icon: <FaUserFriends />,
      action: 'View Group'
    },
    {
      id: 2,
      type: 'exam_reminder',
      title: 'Upcoming Exam',
      message: 'Your Chemistry exam is scheduled in 3 days',
      time: '1 day ago',
      read: false,
      icon: <FaCalendarAlt />,
      action: 'View Calendar'
    },
    {
      id: 3,
      type: 'new_material',
      title: 'New Study Material',
      message: 'New study materials have been added to Biology Study Group',
      time: '3 days ago',
      read: true,
      icon: <FaBook />,
      action: 'View Materials'
    },
    {
      id: 4,
      type: 'system',
      title: 'Welcome to Study Buddy',
      message: 'Thank you for joining Study Buddy! Explore our features to enhance your learning experience.',
      time: '1 week ago',
      read: true,
      icon: <FaInfoCircle />,
      action: 'Explore Features'
    }
  ]);

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };

  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="notifications-title">
          <FaBell className="notifications-icon" />
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-count">{unreadCount} unread</span>
          )}
        </div>
        <div className="notifications-actions">
          {unreadCount > 0 && (
            <button className="mark-read-btn" onClick={markAllAsRead}>
              <FaCheckCircle /> Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="clear-all-btn" onClick={clearAllNotifications}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <FaBell className="empty-icon" />
          <p>No notifications yet</p>
          <p className="empty-subtitle">When you get notifications, they'll show up here</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-icon">
                {notification.icon}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className="notification-time">{notification.time}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-actions">
                  <button className="action-btn">{notification.action}</button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {!notification.read && <div className="unread-indicator"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications; 