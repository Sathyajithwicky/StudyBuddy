import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Admin.css';
import { FaUsers, FaUserGraduate, FaBookOpen, FaCalendarAlt, FaCog, FaSignOutAlt, FaBell, FaChartLine, FaTrash, FaEdit, FaFilter, FaSearch, FaTimes, FaFilePdf } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Admin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for study groups
  const [studyGroups, setStudyGroups] = useState([
    { id: 1, name: 'Physics Group A', members: 24, created: '2023-09-10', lastActive: '2023-11-28' },
    { id: 2, name: 'Chemistry Club', members: 18, created: '2023-10-05', lastActive: '2023-11-27' },
    { id: 3, name: 'Biology Study Circle', members: 32, created: '2023-08-20', lastActive: '2023-11-29' },
    { id: 4, name: 'Mathematics Masters', members: 15, created: '2023-07-15', lastActive: '2023-11-25' },
    { id: 5, name: 'Advanced Level Physics', members: 28, created: '2023-06-12', lastActive: '2023-11-30' },
  ]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('');
  
  // State for users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // State for editing user
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    course: ''
  });

  // State for delete confirmation
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.university?.toLowerCase().includes(query) ||
      user.course?.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  };

  // Function to generate PDF report
  const generateUsersPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 185);
    doc.text('User Management Report', 105, 15, { align: 'center' });
    
    // Add date and filter info
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
    
    if (searchQuery) {
      doc.text(`Filter: "${searchQuery}"`, 105, 27, { align: 'center' });
    }
    
    // Prepare table data
    const tableData = filteredUsers.map(user => [
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.university || 'N/A',
      user.course || 'N/A',
      formatDate(user.createdAt),
      user.status || 'active'
    ]);
    
    // Table headers
    const headers = [['Name', 'Email', 'University', 'Course', 'Join Date', 'Status']];
    
    // Add the table
    autoTable(doc, {
      head: headers,
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        textColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 15 }
      },
      margin: { top: 40 }
    });
    
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    // Save the PDF
    doc.save(`users_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No admin token found. Please log in again.');
      }

      const response = await fetch('http://localhost:5001/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      if (!Array.isArray(data.users)) {
        throw new Error('Invalid users data format');
      }
      
      // Sort users by creation date in descending order (newest first)
      const sortedUsers = data.users.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
      if (err.message.includes('token')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Mock data for recent activities
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'joined Physics Group A', time: '2 hours ago' },
    { id: 2, user: 'Alice Brown', action: 'completed Chemistry quiz', time: '5 hours ago' },
    { id: 3, user: 'Mike Wilson', action: 'submitted feedback', time: '1 day ago' },
    { id: 4, user: 'Jane Smith', action: 'updated profile', time: '2 days ago' },
  ];

  // Function to handle editing a user
  const handleEditUser = (user) => {
    if (!user || !user.id) {
      setError('Invalid user data');
      return;
    }
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      university: user.university || '',
      course: user.course || ''
    });
    setShowEditModal(true);
    setError(null);
  };

  // Function to handle edit form changes
  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  // Function to handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!editingUser || !editingUser.id) {
        throw new Error('Invalid user data');
      }

      const response = await fetch(`http://localhost:5001/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          email: editFormData.email,
          university: editFormData.university,
          course: editFormData.course
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id ? { ...user, ...editFormData } : user
        )
      );

      setFilteredUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id ? { ...user, ...editFormData } : user
        )
      );

      setShowEditModal(false);
      setEditingUser(null);
      setSuccessMessage('User updated successfully');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error updating user:', err);
    }
  };

  // Function to handle deleting a user
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Function to confirm user deletion
  const confirmDeleteUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      setFilteredUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      setSuccessMessage('User deleted successfully');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  // Function to cancel user deletion
  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Function to handle user status toggle
  const handleStatusToggle = async (user) => {
    try {
      const token = localStorage.getItem('adminToken');
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`http://localhost:5001/api/users/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user status');
      }

      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );

      setFilteredUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );

      setSuccessMessage(`User status updated to ${newStatus}`);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error updating user status:', err);
    }
  };

  // Study Group Functions
  const handleAddGroup = () => {
    const newGroup = {
      id: Date.now(),
      name: 'New Study Group',
      members: 0,
      created: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    };
    
    setStudyGroups([...studyGroups, newGroup]);
    handleEditGroup(newGroup);
  };

  const handleFilterChange = (e) => {
    setSubjectFilter(e.target.value);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
  };

  const handleSaveGroupName = () => {
    if (newGroupName.trim() === '') return;
    
    setStudyGroups(groups => 
      groups.map(group => 
        group.id === editingGroup.id 
          ? { ...group, name: newGroupName } 
          : group
      )
    );
    
    setEditingGroup(null);
    setNewGroupName('');
  };

  const handleConfirmDelete = (group) => {
    setDeleteConfirmGroup(group);
  };

  const handleDeleteGroup = () => {
    setStudyGroups(groups => 
      groups.filter(group => group.id !== deleteConfirmGroup.id)
    );
    setDeleteConfirmGroup(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmGroup(null);
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setNewGroupName('');
  };

  // Filter groups based on the selected subject
  const filteredGroups = subjectFilter 
    ? studyGroups.filter(group => group.name.toLowerCase().includes(subjectFilter.toLowerCase()))
    : studyGroups;

  // Fetch users when the component mounts or when activeTab changes to 'users'
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  return (
    <div className="admin-dashboard">
      {/* Admin sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <div className="admin-sidebar-menu">
          <button 
            className={`admin-sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartLine /> Dashboard
          </button>
          <button
            className={`admin-sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Users
          </button>
          <button 
            className={`admin-sidebar-item ${activeTab === 'study-groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('study-groups')}
          >
            <FaUserGraduate /> Study Groups
          </button>
          <button
            className={`admin-sidebar-item ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FaBookOpen /> Content
          </button>
          <button
            className={`admin-sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
        </div>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      
      {/* Admin main content */}
      <div className="admin-main">
        {/* Admin header */}
        <div className="admin-header">
          <div className="admin-header-title">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'study-groups' && 'Study Groups'}
              {activeTab === 'content' && 'Content Management'}
              {activeTab === 'settings' && 'System Settings'}
            </h1>
          </div>
          
          <div className="admin-header-actions">
            <div className="admin-search">
              <input type="text" placeholder="Search..." />
              <button><FaSearch /></button>
            </div>
            <div className="admin-notifications">
              <button>
                <FaBell />
                <span className="notification-badge">3</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Admin content based on active tab */}
        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              {/* Stats cards */}
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon"><FaUsers /></div>
                  <div className="stat-details">
                    <h3>Total Users</h3>
                    <p className="stat-number">254</p>
                    <p className="stat-trend positive">+12% this month</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon"><FaUserGraduate /></div>
                  <div className="stat-details">
                    <h3>Study Groups</h3>
                    <p className="stat-number">{studyGroups.length}</p>
                    <p className="stat-trend positive">+3 new groups</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon"><FaBookOpen /></div>
                  <div className="stat-details">
                    <h3>Active Quizzes</h3>
                    <p className="stat-number">42</p>
                    <p className="stat-trend negative">-5% completion rate</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon"><FaCalendarAlt /></div>
                  <div className="stat-details">
                    <h3>Today's Sessions</h3>
                    <p className="stat-number">8</p>
                    <p className="stat-trend neutral">Same as yesterday</p>
                  </div>
                </div>
              </div>
              
              {/* Recent activity and summary sections */}
              <div className="dashboard-rows">
                {/* Recent activity */}
                <div className="dashboard-panel">
                  <div className="panel-header">
                    <h3>Recent Activity</h3>
                  </div>
                  <div className="activity-list">
                    {recentActivities.map(activity => (
                      <div className="activity-item" key={activity.id}>
                        <div className="activity-content">
                          <strong>{activity.user}</strong> {activity.action}
                        </div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                  <div className="panel-footer">
                    <button className="view-all-btn">View All Activities</button>
                  </div>
                </div>
                
                {/* User summary */}
                <div className="dashboard-panel">
                  <div className="panel-header">
                    <h3>User Summary</h3>
                  </div>
                  <div className="summary-content">
                    <div className="summary-item">
                      <div className="summary-label">New Users (This Week)</div>
                      <div className="summary-value">28</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">Active Users</div>
                      <div className="summary-value">198</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">Inactive Users</div>
                      <div className="summary-value">56</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">Average Session Time</div>
                      <div className="summary-value">45 minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Users Tab Content */}
          {activeTab === 'users' && (
            <div className="admin-content">
              <div className="admin-section-header">
                <h2>User Management</h2>
                <div className="admin-section-actions">
                  <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="search-input"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                  <button 
                    className="generate-pdf-btn"
                    onClick={generateUsersPDF}
                    title="Generate PDF report"
                  >
                    <FaFilePdf /> Generate PDF
                  </button>
                </div>
              </div>
              
              {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              {loading ? (
                <div className="loading-message">Loading users...</div>
              ) : (
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>University</th>
                        <th>Course</th>
                        <th>Join Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{`${user.firstName} ${user.lastName}`}</td>
                          <td>{user.email}</td>
                          <td>{user.university}</td>
                          <td>{user.course}</td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <button
                              className={`status-toggle ${user.status || 'active'}`}
                              onClick={() => handleStatusToggle(user)}
                              title={`Click to ${user.status === 'active' ? 'deactivate' : 'activate'} user`}
                            >
                              {user.status || 'active'}
                            </button>
                          </td>
                          <td className="action-buttons">
                            <button 
                              className="edit-btn" 
                              onClick={() => handleEditUser(user)}
                              title="Edit user"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDeleteUser(user)}
                              title="Delete user"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="no-results">
                      <p>No users found matching your search criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Study Groups Tab Content */}
          {activeTab === 'study-groups' && (
            <div className="study-groups-content">
              <div className="group-actions">
                <button className="add-group-btn" onClick={handleAddGroup}>
                  Create New Group
                </button>
                <div className="group-filters">
                  <button className="filter-btn"><FaFilter /> Filter</button>
                  <select 
                    className="subject-filter"
                    value={subjectFilter}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Subjects</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="mathematics">Mathematics</option>
                  </select>
                </div>
              </div>
              
              <div className="groups-summary">
                <div className="summary-box">
                  <h4>Total Groups</h4>
                  <p>{studyGroups.length}</p>
                </div>
                <div className="summary-box">
                  <h4>Total Members</h4>
                  <p>{studyGroups.reduce((total, group) => total + group.members, 0)}</p>
                </div>
                <div className="summary-box">
                  <h4>Active This Week</h4>
                  <p>{studyGroups.filter(group => 
                    new Date(group.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}</p>
                </div>
              </div>
              
              <div className="groups-grid">
                {filteredGroups.map(group => (
                  <div className="group-card" key={group.id}>
                    <div className="group-card-header">
                      <h3>{group.name}</h3>
                      <div className="group-actions">
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEditGroup(group)}
                          title="Edit group name"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleConfirmDelete(group)}
                          title="Delete group"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="group-card-body">
                      <div className="group-stats">
                        <div className="group-stat">
                          <div className="stat-label">Members</div>
                          <div className="stat-value">{group.members}</div>
                        </div>
                        <div className="group-stat">
                          <div className="stat-label">Created</div>
                          <div className="stat-value">{group.created}</div>
                        </div>
                        <div className="group-stat">
                          <div className="stat-label">Last Active</div>
                          <div className="stat-value">{group.lastActive}</div>
                        </div>
                      </div>
                    </div>
                    <div className="group-card-footer">
                      <button className="view-group-btn">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredGroups.length === 0 && (
                <div className="no-results">
                  <p>No study groups match your filter criteria.</p>
                  <button 
                    className="reset-filter-btn"
                    onClick={() => setSubjectFilter('')}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="content-management">
              <div className="content-tabs">
                <button className="content-tab active">Quizzes</button>
                <button className="content-tab">Study Materials</button>
                <button className="content-tab">Announcements</button>
                <button className="content-tab">Feedback</button>
              </div>
              
              <div className="content-panel">
                <div className="content-header">
                  <h3>Quiz Management</h3>
                  <button className="add-content-btn">Add New Quiz</button>
                </div>
                
                <div className="content-list">
                  <div className="content-item">
                    <div className="content-info">
                      <h4>Physics Mechanics Quiz</h4>
                      <div className="content-meta">
                        <span>Created: Oct 15, 2023</span>
                        <span>Questions: 25</span>
                        <span>Difficulty: Advanced</span>
                      </div>
                    </div>
                    <div className="content-actions">
                      <button className="edit-btn"><FaEdit /></button>
                      <button className="delete-btn"><FaTrash /></button>
                    </div>
                  </div>
                  
                  <div className="content-item">
                    <div className="content-info">
                      <h4>Chemistry Organic Compounds</h4>
                      <div className="content-meta">
                        <span>Created: Nov 2, 2023</span>
                        <span>Questions: 20</span>
                        <span>Difficulty: Intermediate</span>
                      </div>
                    </div>
                    <div className="content-actions">
                      <button className="edit-btn"><FaEdit /></button>
                      <button className="delete-btn"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-content">
              <div className="settings-panel">
                <div className="settings-section">
                  <h3>General Settings</h3>
                  <div className="setting-item">
                    <div className="setting-label">Site Name</div>
                    <div className="setting-input">
                      <input type="text" defaultValue="Study Buddy" />
                    </div>
                  </div>
                  <div className="setting-item">
                    <div className="setting-label">Site Description</div>
                    <div className="setting-input">
                      <textarea rows="2" defaultValue="A collaborative learning platform for students" />
                    </div>
                  </div>
                </div>
                
                <div className="settings-section">
                  <h3>Security Settings</h3>
                  <div className="setting-item">
                    <div className="setting-label">Two-Factor Authentication</div>
                    <div className="setting-input">
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="settings-actions">
                  <button className="save-settings-btn">Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>University</label>
                <input
                  type="text"
                  name="university"
                  value={editFormData.university}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Course</label>
                <input
                  type="text"
                  name="course"
                  value={editFormData.course}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">Save Changes</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h2>Confirm Delete User</h2>
              <button className="close-modal" onClick={cancelDeleteUser}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the user "{userToDelete.firstName} {userToDelete.lastName}"?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="delete-confirm-btn" 
                onClick={confirmDeleteUser}
              >
                Delete User
              </button>
              <button 
                className="cancel-btn" 
                onClick={cancelDeleteUser}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {editingGroup && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit Study Group</h2>
              <button className="close-modal" onClick={handleCancelEdit}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Group Name:</label>
                <input 
                  type="text" 
                  value={newGroupName} 
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="save-btn" 
                onClick={handleSaveGroupName}
                disabled={newGroupName.trim() === ''}
              >
                Save Changes
              </button>
              <button 
                className="cancel-btn" 
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Group Confirmation Modal */}
      {deleteConfirmGroup && (
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-modal" onClick={handleCancelDelete}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the study group "{deleteConfirmGroup.name}"?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="delete-confirm-btn" 
                onClick={handleDeleteGroup}
              >
                Delete
              </button>
              <button 
                className="cancel-btn" 
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;