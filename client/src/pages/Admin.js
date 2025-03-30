import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Admin.css';
import { FaUsers, FaUserGraduate, FaBookOpen, FaCalendarAlt, FaCog, FaSignOutAlt, FaBell, FaChartLine, FaTrash, FaEdit, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

const Admin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for editing study group
  const [editingGroup, setEditingGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  
  // State for delete confirmation
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState(null);
  
  // State for users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Function to handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredUsers(users); // Users are already sorted
      return;
    }

    const filtered = users.filter(user => 
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.university?.toLowerCase().includes(query) ||
      user.course?.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered); // Maintain the sort order as filtered users come from sorted users
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
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      // Sort users by creation date in descending order (newest first)
      const sortedUsers = (data.users || []).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers); // Initialize filtered users with sorted users
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
  
  // Fetch users when the component mounts or when activeTab changes to 'users'
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);
  
  // Mock data for study groups with state - expanded with more normal study groups
  const [studyGroups, setStudyGroups] = useState([
    { id: 1, name: 'Physics Group A', members: 24, created: '2023-09-10', lastActive: '2023-11-28' },
    { id: 2, name: 'Chemistry Club', members: 18, created: '2023-10-05', lastActive: '2023-11-27' },
    { id: 3, name: 'Biology Study Circle', members: 32, created: '2023-08-20', lastActive: '2023-11-29' },
    { id: 4, name: 'Mathematics Masters', members: 15, created: '2023-07-15', lastActive: '2023-11-25' },
    { id: 5, name: 'Advanced Level Physics', members: 28, created: '2023-06-12', lastActive: '2023-11-30' },
    { id: 6, name: 'Organic Chemistry Group', members: 16, created: '2023-07-25', lastActive: '2023-11-28' },
    { id: 7, name: 'Combined Mathematics', members: 22, created: '2023-08-05', lastActive: '2023-11-29' },
    { id: 8, name: 'Molecular Biology Study', members: 19, created: '2023-09-18', lastActive: '2023-11-26' },
    { id: 9, name: 'Mechanics & Thermodynamics', members: 21, created: '2023-05-30', lastActive: '2023-11-27' },
    { id: 10, name: 'Calculus Group', members: 25, created: '2023-06-22', lastActive: '2023-11-30' },
    { id: 11, name: 'Quantum Physics', members: 14, created: '2023-07-10', lastActive: '2023-11-25' },
    { id: 12, name: 'Cellular Biology', members: 23, created: '2023-08-15', lastActive: '2023-11-29' },
    { id: 13, name: 'Inorganic Chemistry', members: 17, created: '2023-09-05', lastActive: '2023-11-28' },
    { id: 14, name: 'Statistics & Probability', members: 20, created: '2023-10-10', lastActive: '2023-11-27' },
    { id: 15, name: 'Algebra & Geometry', members: 26, created: '2023-05-15', lastActive: '2023-11-30' },
  ]);
  
  // Mock data for recent activities
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'joined Physics Group A', time: '2 hours ago' },
    { id: 2, user: 'Alice Brown', action: 'completed Chemistry quiz', time: '5 hours ago' },
    { id: 3, user: 'Mike Wilson', action: 'submitted feedback', time: '1 day ago' },
    { id: 4, user: 'Jane Smith', action: 'updated profile', time: '2 days ago' },
  ];
  
  // Function to handle logout
  const handleLogout = () => {
    logout(); // Clear auth state
    navigate('/login'); // Redirect to login page
  };
  
  // Function to handle editing a group
  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
  };
  
  // Function to save edited group name
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
  
  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingGroup(null);
    setNewGroupName('');
  };
  
  // Function to confirm delete
  const handleConfirmDelete = (group) => {
    setDeleteConfirmGroup(group);
  };
  
  // Function to delete group
  const handleDeleteGroup = () => {
    setStudyGroups(groups => 
      groups.filter(group => group.id !== deleteConfirmGroup.id)
    );
    setDeleteConfirmGroup(null);
  };
  
  // Function to cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirmGroup(null);
  };
  
  // Function to add a new study group
  const handleAddGroup = () => {
    const newGroup = {
      id: Date.now(),
      name: 'New Study Group',
      members: 0,
      created: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    };
    
    setStudyGroups([...studyGroups, newGroup]);
    handleEditGroup(newGroup); // Immediately open edit modal for the new group
  };
  
  // Filter study groups by subject (for the filter dropdown)
  const [subjectFilter, setSubjectFilter] = useState('');
  
  // Function to handle subject filter change
  const handleFilterChange = (e) => {
    setSubjectFilter(e.target.value);
  };
  
  // Filter groups based on the selected subject
  const filteredGroups = subjectFilter 
    ? studyGroups.filter(group => group.name.toLowerCase().includes(subjectFilter.toLowerCase()))
    : studyGroups;

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to handle editing a user
  const handleEditUser = (user) => {
    console.log('Editing user:', user);
    // TODO: Implement edit user functionality
  };

  // Function to handle deleting a user
  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5001/api/users/account`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        // Refresh the users list
        fetchUsers();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting user:', err);
      }
    }
  };

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
                </div>
              </div>
              
              {loading ? (
                <div className="loading-message">Loading users...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
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
                        <tr key={user._id}>
                          <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.email}</td>
                          <td>{user.university}</td>
                          <td>{user.course}</td>
                          <td>{formatDate(user.createdAt)}</td>
                        <td>
                            <span className={`status-badge ${user.status?.toLowerCase() || 'active'}`}>
                              {user.status || 'Active'}
                          </span>
                        </td>
                        <td className="action-buttons">
                            <button className="edit-btn" onClick={() => handleEditUser(user)}>
                              <FaEdit />
                            </button>
                            <button className="delete-btn" onClick={() => handleDeleteUser(user)}>
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
          
          {activeTab === 'study-groups' && (
            <div className="study-groups-content">
              <div className="group-actions">
                <button className="add-group-btn" onClick={handleAddGroup}>Create New Group</button>
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
                    <option value="calculus">Calculus</option>
                    <option value="organic">Organic Chemistry</option>
                    <option value="molecular">Molecular Biology</option>
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
                      
                      <div className="content-item">
                        <div className="content-info">
                          <h4>Biology Cell Structure</h4>
                          <div className="content-meta">
                            <span>Created: Oct 28, 2023</span>
                            <span>Questions: 15</span>
                            <span>Difficulty: Beginner</span>
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
                  <div className="setting-item">
                    <div className="setting-label">Maintenance Mode</div>
                    <div className="setting-input">
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="settings-section">
                  <h3>Email Settings</h3>
                  <div className="setting-item">
                    <div className="setting-label">SMTP Server</div>
                    <div className="setting-input">
                      <input type="text" defaultValue="smtp.example.com" />
                    </div>
                  </div>
                  <div className="setting-item">
                    <div className="setting-label">SMTP Port</div>
                    <div className="setting-input">
                      <input type="text" defaultValue="587" />
                    </div>
                  </div>
                  <div className="setting-item">
                    <div className="setting-label">Send Notification Emails</div>
                    <div className="setting-input">
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
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
                  <div className="setting-item">
                    <div className="setting-label">Session Timeout (minutes)</div>
                    <div className="setting-input">
                      <input type="number" defaultValue="30" />
                    </div>
                  </div>
                </div>
                
                <div className="settings-actions">
                  <button className="save-settings-btn">Save Changes</button>
                  <button className="reset-settings-btn">Reset to Default</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Group Modal */}
      {editingGroup && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit Study Group</h2>
              <button className="close-modal" onClick={handleCancelEdit}><FaTimes /></button>
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
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmGroup && (
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-modal" onClick={handleCancelDelete}><FaTimes /></button>
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