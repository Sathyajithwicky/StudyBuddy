import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaUsers, FaUserGraduate, FaBookOpen, FaCalendarAlt, FaCog, FaSignOutAlt, FaBell, FaChartLine, FaTrash, FaEdit, FaFilter, FaSearch, FaTimes, FaStar, FaComment } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  // State for active content tab
  const [activeContentTab, setActiveContentTab] = useState('quizzes');
  
  // Add feedback state
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState(null);
  
  // Get auth context
  const { token } = useAuth();
  
  // State for editing study group
  const [editingGroup, setEditingGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState('');
  
  // State for delete confirmation
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState(null);
  
  // Mock data for users
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', joinDate: '2023-10-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', joinDate: '2023-09-22', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Student', joinDate: '2023-11-05', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Student', joinDate: '2023-10-30', status: 'Active' },
    { id: 5, name: 'Mike Wilson', email: 'mike@example.com', role: 'Student', joinDate: '2023-08-18', status: 'Active' },
  ];
  
  // Update the initial studyGroups state with all groups from JoinGroup.js
  const [studyGroups, setStudyGroups] = useState([
    { id: 1, name: "Physics Study Group", level: "advanced", subject: "Physics", members: 5, maxMembers: 10, created: '2023-09-10', lastActive: '2023-11-28' },
    { id: 2, name: "Combined Mathematics Study Group", level: "advanced", subject: "Combined Mathematics", members: 5, maxMembers: 10, created: '2023-10-05', lastActive: '2023-11-27' },
    { id: 4, name: "Chemistry Study Group", level: "advanced", subject: "Chemistry", members: 5, maxMembers: 10, created: '2023-08-20', lastActive: '2023-11-29' },
    { id: 5, name: "Biology Study Group", level: "advanced", subject: "Biology", members: 5, maxMembers: 10, created: '2023-07-15', lastActive: '2023-11-25' },
    { id: 6, name: "Chemistry Study Group", level: "advanced", subject: "Chemistry", members: 5, maxMembers: 10, created: '2023-09-15', lastActive: '2023-11-26' },
    { id: 8, name: "Agricultural Science Study Group", level: "advanced", subject: "Agricultural Science", members: 5, maxMembers: 10, created: '2023-08-10', lastActive: '2023-11-25' },
    { id: 9, name: "Business Studies Study Group", level: "advanced", subject: "Business Studies", members: 5, maxMembers: 10, created: '2023-07-20', lastActive: '2023-11-27' },
    { id: 10, name: "Accounting Study Group", level: "advanced", subject: "Accounting", members: 5, maxMembers: 10, created: '2023-06-15', lastActive: '2023-11-28' },
    { id: 11, name: "Economics Study Group", level: "advanced", subject: "Economics", members: 5, maxMembers: 10, created: '2023-05-10', lastActive: '2023-11-29' },
    { id: 12, name: "Business Statistics Study Group", level: "advanced", subject: "Business Statistics", members: 5, maxMembers: 10, created: '2023-04-05', lastActive: '2023-11-30' },
    { id: 13, name: "Information and Communication Technology (ICT) Study Group", level: "advanced", subject: "Information and Communication Technology (ICT)", members: 5, maxMembers: 10, created: '2023-03-01', lastActive: '2023-11-28' },
    { id: 14, name: "Buddhism Study Group", level: "advanced", subject: "Buddhism", members: 5, maxMembers: 10, created: '2023-02-15', lastActive: '2023-11-27' },
    { id: 15, name: "Hinduism Study Group", level: "advanced", subject: "Hinduism", members: 5, maxMembers: 10, created: '2023-01-20', lastActive: '2023-11-26' },
    { id: 16, name: "Islam Study Group", level: "advanced", subject: "Islam", members: 5, maxMembers: 10, created: '2023-01-10', lastActive: '2023-11-25' },
    { id: 17, name: "Christianity Study Group", level: "advanced", subject: "Christianity", members: 5, maxMembers: 10, created: '2023-02-05', lastActive: '2023-11-24' },
    { id: 18, name: "Sinhala Study Group", level: "advanced", subject: "Sinhala", members: 5, maxMembers: 10, created: '2023-03-10', lastActive: '2023-11-23' },
    { id: 19, name: "Tamil Study Group", level: "advanced", subject: "Tamil", members: 5, maxMembers: 10, created: '2023-04-15', lastActive: '2023-11-22' },
    { id: 20, name: "English Study Group", level: "advanced", subject: "English", members: 5, maxMembers: 10, created: '2023-05-20', lastActive: '2023-11-21' },
    { id: 21, name: "Pali Study Group", level: "advanced", subject: "Pali", members: 5, maxMembers: 10, created: '2023-06-25', lastActive: '2023-11-20' },
    { id: 22, name: "Sanskrit Study Group", level: "advanced", subject: "Sanskrit", members: 5, maxMembers: 10, created: '2023-07-30', lastActive: '2023-11-19' },
    { id: 23, name: "Arabic Study Group", level: "advanced", subject: "Arabic", members: 5, maxMembers: 10, created: '2023-08-05', lastActive: '2023-11-18' },
    { id: 24, name: "Hindi Study Group", level: "advanced", subject: "Hindi", members: 5, maxMembers: 10, created: '2023-09-10', lastActive: '2023-11-17' },
    { id: 25, name: "Japanese Study Group", level: "advanced", subject: "Japanese", members: 5, maxMembers: 10, created: '2023-10-15', lastActive: '2023-11-16' },
    { id: 26, name: "Chinese Study Group", level: "advanced", subject: "Chinese", members: 5, maxMembers: 10, created: '2023-11-20', lastActive: '2023-11-15' },
    { id: 27, name: "Korean Study Group", level: "advanced", subject: "Korean", members: 5, maxMembers: 10, created: '2023-01-25', lastActive: '2023-11-14' },
    { id: 28, name: "Malay Study Group", level: "advanced", subject: "Malay", members: 5, maxMembers: 10, created: '2023-02-28', lastActive: '2023-11-13' },
    { id: 29, name: "French Study Group", level: "advanced", subject: "French", members: 5, maxMembers: 10, created: '2023-03-05', lastActive: '2023-11-12' },
    { id: 30, name: "German Study Group", level: "advanced", subject: "German", members: 5, maxMembers: 10, created: '2023-04-10', lastActive: '2023-11-11' },
    { id: 31, name: "Russian Study Group", level: "advanced", subject: "Russian", members: 5, maxMembers: 10, created: '2023-05-15', lastActive: '2023-11-10' },
    { id: 32, name: "Political Science Study Group", level: "advanced", subject: "Political Science", members: 5, maxMembers: 10, created: '2023-06-20', lastActive: '2023-11-09' },
    { id: 33, name: "History (Sri Lankan, Indian, European, Modern World) Study Group", level: "advanced", subject: "History (Sri Lankan, Indian, European, Modern World)", members: 5, maxMembers: 10, created: '2023-07-25', lastActive: '2023-11-08' },
    { id: 34, name: "Geography Study Group", level: "advanced", subject: "Geography", members: 5, maxMembers: 10, created: '2023-08-30', lastActive: '2023-11-07' },
    { id: 35, name: "Logic and Scientific Method Study Group", level: "advanced", subject: "Logic and Scientific Method", members: 5, maxMembers: 10, created: '2023-09-05', lastActive: '2023-11-06' },
    { id: 36, name: "Mass Media and Communication Studies Study Group", level: "advanced", subject: "Mass Media and Communication Studies", members: 5, maxMembers: 10, created: '2023-10-10', lastActive: '2023-11-05' },
    { id: 37, name: "Aesthetic Subjects (Dancing, Music [Western or Eastern], Drama, Art) Study Group", level: "advanced", subject: "Aesthetic Subjects (Dancing, Music [Western or Eastern], Drama, Art)", members: 5, maxMembers: 10, created: '2023-11-15', lastActive: '2023-11-04' },
    { id: 38, name: "Home Science Study Group", level: "advanced", subject: "Home Science", members: 5, maxMembers: 10, created: '2023-01-20', lastActive: '2023-11-03' },
    { id: 39, name: "Accounting or Business Statistics Study Group", level: "advanced", subject: "Accounting or Business Statistics", members: 5, maxMembers: 10, created: '2023-02-25', lastActive: '2023-11-02' },
    { id: 40, name: "Agriculture or Mathematics Study Group", level: "advanced", subject: "Agriculture or Mathematics", members: 5, maxMembers: 10, created: '2023-03-30', lastActive: '2023-11-01' },
    { id: 41, name: "Engineering Technology Study Group", level: "advanced", subject: "Engineering Technology", members: 5, maxMembers: 10, created: '2023-04-05', lastActive: '2023-10-31' },
    { id: 42, name: "Science for Technology Study Group", level: "advanced", subject: "Science for Technology", members: 5, maxMembers: 10, created: '2023-05-10', lastActive: '2023-10-30' },
    { id: 43, name: "Bio-system Technology Study Group", level: "advanced", subject: "Bio-system Technology", members: 5, maxMembers: 10, created: '2023-06-15', lastActive: '2023-10-29' },
    { id: 44, name: "Information and Communication Technology (ICT) Study Group", level: "advanced", subject: "Information and Communication Technology (ICT)", members: 5, maxMembers: 10, created: '2023-07-20', lastActive: '2023-10-28' },
    { id: 45, name: "Engineering Technology Study Group", level: "advanced", subject: "Engineering Technology", members: 5, maxMembers: 10, created: '2023-08-25', lastActive: '2023-10-27' },
    { id: 46, name: "Science for Technology Study Group", level: "advanced", subject: "Science for Technology", members: 5, maxMembers: 10, created: '2023-09-30', lastActive: '2023-10-26' },
    { id: 47, name: "Bio-system Technology Study Group", level: "advanced", subject: "Bio-system Technology", members: 5, maxMembers: 10, created: '2023-10-05', lastActive: '2023-10-25' },
    { id: 48, name: "Chemistry Basics", level: "ordinary", subject: "Chemistry", members: 3, maxMembers: 8, created: '2023-11-10', lastActive: '2023-10-24' },
    { id: 49, name: "Computer Science 101", level: "university", subject: "CS", members: 6, maxMembers: 12, created: '2023-01-15', lastActive: '2023-10-23' },
    { id: 50, name: "Biology Advanced", level: "london-al", subject: "Biology", members: 4, maxMembers: 10, created: '2023-02-20', lastActive: '2023-10-22' },
    { id: 51, name: "Mathematics", level: "london-ol", subject: "Math", members: 7, maxMembers: 15, created: '2023-03-25', lastActive: '2023-10-21' }
  ]);
  
  // Mock data for recent activities
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'joined Physics Group A', time: '2 hours ago' },
    { id: 2, user: 'Alice Brown', action: 'completed Chemistry quiz', time: '5 hours ago' },
    { id: 3, user: 'Mike Wilson', action: 'submitted feedback', time: '1 day ago' },
    { id: 4, user: 'Jane Smith', action: 'updated profile', time: '2 days ago' },
  ];
  
  // Update the useEffect to handle the initial load properly
  useEffect(() => {
    // Check if we have study groups in localStorage
    const savedGroups = localStorage.getItem('studyGroups');
    
    if (savedGroups) {
      // If we have saved groups, use those
      setStudyGroups(JSON.parse(savedGroups));
    } else {
      // If not in localStorage, save our initial state
      localStorage.setItem('studyGroups', JSON.stringify(studyGroups));
    }
  }, []); // Empty dependency array means this runs once on component mount
  
  // Function to handle editing a group
  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
    setNewGroupSubject(group.subject);
  };
  
  // Function to save edited group name
  const handleSaveGroupName = () => {
    if (newGroupName.trim() === '' || newGroupSubject.trim() === '') {
      alert('Group name and subject are required');
      return;
    }
    
    // Check if we're creating a new group or editing an existing one
    if (!studyGroups.some(group => group.id === editingGroup.id)) {
      // Creating a new group
      const newGroup = {
        ...editingGroup,
        name: newGroupName,
        subject: newGroupSubject
      };
      
      const updatedGroups = [...studyGroups, newGroup];
      setStudyGroups(updatedGroups);
      localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
    } else {
      // Editing an existing group
      const updatedGroups = studyGroups.map(group => 
        group.id === editingGroup.id 
          ? { ...group, name: newGroupName, subject: newGroupSubject } 
          : group
      );
      
      setStudyGroups(updatedGroups);
      localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
    }
    
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupSubject('');
  };
  
  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupSubject('');
  };
  
  // Function to confirm delete
  const handleConfirmDelete = (group) => {
    setDeleteConfirmGroup(group);
  };
  
  // Function to delete group
  const handleDeleteGroup = () => {
    // Update the local state
    const updatedGroups = studyGroups.filter(group => group.id !== deleteConfirmGroup.id);
    setStudyGroups(updatedGroups);
    
    // Save to localStorage to sync with JoinGroup.js
    localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
    
    setDeleteConfirmGroup(null);
  };
  
  // Function to cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirmGroup(null);
  };
  
  // Function to add a new study group
  const handleAddGroup = () => {
    // Set editing state to a special value that indicates we're creating a new group
    setEditingGroup({
      id: Date.now(),
      name: 'New Study Group',
      level: 'advanced',
      subject: '',
      members: 0,
      maxMembers: 10,
      created: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    });
    
    // Initialize the form fields
    setNewGroupName('New Study Group');
    setNewGroupSubject('');
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

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 12; // Show 12 groups per page

  // Calculate pagination
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

  // Function to change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Update the group card rendering in the study-groups tab
  const renderGroupCard = (group) => (
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
            <div className="stat-label">Level</div>
            <div className="stat-value">{group.level}</div>
          </div>
          <div className="group-stat">
            <div className="stat-label">Members</div>
            <div className="stat-value">{group.members}/{group.maxMembers}</div>
          </div>
          <div className="group-stat">
            <div className="stat-label">Subject</div>
            <div className="stat-value">{group.subject}</div>
          </div>
        </div>
      </div>
      <div className="group-card-footer">
        <button className="view-group-btn">View Details</button>
                </div>
              </div>
  );

  // Update the filter options to match the subjects
  const subjects = [...new Set(studyGroups.map(group => group.subject))];

  // Update the study groups section to use pagination
  const studyGroupsContent = (
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
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
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
        {currentGroups.map(renderGroupCard)}
      </div>
      
      {filteredGroups.length > 0 ? (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          
          {/* Generate page buttons */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={currentPage === pageNum ? 'active' : ''}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={() => handlePageChange(totalPages)} 
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      ) : (
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
        );

  // Fetch feedback data when the feedback tab is selected
  useEffect(() => {
    if (activeTab === 'content' && activeContentTab === 'feedback') {
      fetchFeedbacks();
    }
  }, [activeTab, activeContentTab, token]);
  
  // Function to fetch feedback data
  const fetchFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      
      if (!token) {
        // Instead of showing an error, use mock data when no token is available
        const mockFeedbacks = [
          {
            _id: 1,
            name: "John Smith",
            email: "john@example.com",
            isAnonymous: false,
            rating: 4,
            feedbackType: "General",
            message: "I really enjoy using this platform for my studies. The interface is intuitive and the study groups are very helpful.",
            suggestions: "It would be great to have more interactive quizzes.",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            _id: 2,
            name: "Anonymous User",
            email: "anonymous@example.com",
            isAnonymous: true,
            rating: 5,
            feedbackType: "Feature Request",
            message: "The study group feature is amazing! I've been able to connect with other students studying the same subjects.",
            suggestions: "Could you add video conferencing for study groups?",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            _id: 3,
            name: "Sarah Johnson",
            email: "sarah@example.com",
            isAnonymous: false,
            rating: 3,
            feedbackType: "Bug Report",
            message: "I found a small issue with the quiz timer. Sometimes it doesn't stop when I submit my answers.",
            suggestions: null,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            _id: 4,
            name: "David Lee",
            email: "david@example.com",
            isAnonymous: false,
            rating: 4,
            feedbackType: "General",
            message: "The content is well organized and easy to navigate. I appreciate the effort put into creating this platform.",
            suggestions: "More advanced topics for university level would be appreciated.",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            _id: 5,
            name: "Anonymous User",
            email: "anonymous2@example.com",
            isAnonymous: true,
            rating: 2,
            feedbackType: "Bug Report",
            message: "I'm having trouble with the profile page. My study groups aren't showing up correctly.",
            suggestions: "Please fix the profile page issues.",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setFeedbacks(mockFeedbacks);
        setFeedbackError(null);
        setFeedbackLoading(false);
        return;
      }
      
      // If token is available, try to fetch from API
      const response = await axios.get('http://localhost:5001/api/feedback/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
        setFeedbackError(null);
      } else {
        // If API request fails, fall back to mock data
        const mockFeedbacks = [
          // Same mock data as above
          {
            _id: 1,
            name: "John Smith",
            email: "john@example.com",
            isAnonymous: false,
            rating: 4,
            feedbackType: "General",
            message: "I really enjoy using this platform for my studies. The interface is intuitive and the study groups are very helpful.",
            suggestions: "It would be great to have more interactive quizzes.",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          // ... other mock feedback items
        ];
        
        setFeedbacks(mockFeedbacks);
        console.log('Using mock feedback data due to API error');
      }
      
      setFeedbackLoading(false);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      
      // Fall back to mock data on error
      const mockFeedbacks = [
        // Same mock data as above
        {
          _id: 1,
          name: "John Smith",
          email: "john@example.com",
          isAnonymous: false,
          rating: 4,
          feedbackType: "General",
          message: "I really enjoy using this platform for my studies. The interface is intuitive and the study groups are very helpful.",
          suggestions: "It would be great to have more interactive quizzes.",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        // ... other mock feedback items
      ];
      
      setFeedbacks(mockFeedbacks);
      console.log('Using mock feedback data due to API error');
      setFeedbackLoading(false);
    }
  };
  
  // Function to handle content tab change
  const handleContentTabChange = (tab) => {
    setActiveContentTab(tab);
  };
  
  // Render feedback content
  const renderFeedbackContent = () => {
    if (feedbackLoading) {
      return <div className="loading-state">Loading feedbacks...</div>;
    }
    
    if (feedbackError) {
      return <div className="error-state">{feedbackError}</div>;
    }
    
    if (!feedbacks || feedbacks.length === 0) {
      return <div className="empty-state">No feedback available yet.</div>;
    }
    
        return (
      <div className="feedback-list">
        <div className="feedback-summary">
          <div className="summary-box">
            <h4>Total Feedback</h4>
            <p>{feedbacks.length}</p>
          </div>
          <div className="summary-box">
            <h4>Average Rating</h4>
            <p>
              {(feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0) / feedbacks.length).toFixed(1)}
              <FaStar className="star-icon" />
            </p>
          </div>
          <div className="summary-box">
            <h4>Recent Feedback</h4>
            <p>{feedbacks.filter(f => new Date(f.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
                  </div>
                </div>
        
        {feedbacks.map((feedback, index) => (
          <div key={feedback._id || index} className="feedback-item">
            <div className="feedback-header">
              <h3>{feedback.name || 'Anonymous'}</h3>
              <div className="rating-display">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < feedback.rating ? "star-filled" : "star-empty"} 
                  />
                ))}
                <span className="rating-text">{feedback.rating}/5</span>
              </div>
            </div>
            <div className="feedback-details">
              <p><strong>Type:</strong> {feedback.feedbackType}</p>
              <p><strong>Email:</strong> {feedback.isAnonymous ? 'Anonymous' : feedback.email}</p>
            </div>
            <p className="feedback-text">{feedback.message}</p>
            {feedback.suggestions && (
              <div className="feedback-suggestions">
                <strong>Suggestions:</strong>
                <p>{feedback.suggestions}</p>
              </div>
            )}
            <div className="feedback-meta">
              <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
              <div className="feedback-actions">
                <button className="reply-btn"><FaComment /> Reply</button>
              </div>
            </div>
          </div>
        ))}
          </div>
        );
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
          <button className="admin-logout-btn">
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
          
          {activeTab === 'users' && (
            <div className="users-content">
              <div className="users-actions">
                <button className="add-user-btn">Add New User</button>
                <div className="users-filters">
                  <button className="filter-btn"><FaFilter /> Filter</button>
                  <select className="role-filter">
                    <option value="">All Roles</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select className="status-filter">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.joinDate}</td>
                        <td>
                          <span className={`status-badge ${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <button className="edit-btn"><FaEdit /></button>
                          <button className="delete-btn"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="pagination">
                <button>&laquo;</button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>&raquo;</button>
              </div>
            </div>
          )}
          
          {activeTab === 'study-groups' && studyGroupsContent}
          
          {activeTab === 'content' && (
            <div className="content-management">
              <div className="content-tabs">
                <button 
                  className={`content-tab ${activeContentTab === 'quizzes' ? 'active' : ''}`}
                  onClick={() => handleContentTabChange('quizzes')}
                >
                  Quizzes
                </button>
                <button 
                  className={`content-tab ${activeContentTab === 'materials' ? 'active' : ''}`}
                  onClick={() => handleContentTabChange('materials')}
                >
                  Study Materials
                </button>
                <button 
                  className={`content-tab ${activeContentTab === 'announcements' ? 'active' : ''}`}
                  onClick={() => handleContentTabChange('announcements')}
                >
                  Announcements
                </button>
                <button 
                  className={`content-tab ${activeContentTab === 'feedback' ? 'active' : ''}`}
                  onClick={() => handleContentTabChange('feedback')}
                >
                  Feedback
                </button>
              </div>
              
              <div className="content-panel">
                {activeContentTab === 'quizzes' && (
                  <>
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
                  </>
                )}
                
                {activeContentTab === 'materials' && (
                  <>
                    <div className="content-header">
                      <h3>Study Materials</h3>
                      <button className="add-content-btn">Add New Material</button>
                    </div>
                    
                    <div className="content-list">
                      <div className="empty-state">No study materials added yet.</div>
                    </div>
                  </>
                )}
                
                {activeContentTab === 'announcements' && (
                  <>
                    <div className="content-header">
                      <h3>Announcements</h3>
                      <button className="add-content-btn">Create Announcement</button>
                    </div>
                    
                    <div className="content-list">
                      <div className="empty-state">No announcements created yet.</div>
                    </div>
                  </>
                )}
                
                {activeContentTab === 'feedback' && (
                  <>
                    <div className="content-header">
                      <h3>User Feedback</h3>
                      <button className="refresh-btn" onClick={fetchFeedbacks}>
                        Refresh Feedback
                      </button>
                    </div>
                    
                    {renderFeedbackContent()}
                  </>
                )}
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
              <h2>{studyGroups.some(group => group.id === editingGroup.id) ? 'Edit Study Group' : 'Create New Group'}</h2>
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
              <div className="form-group">
                <label>Subject:</label>
                <input 
                  type="text" 
                  value={newGroupSubject} 
                  onChange={(e) => setNewGroupSubject(e.target.value)}
                  placeholder="Enter subject"
                />
              </div>
              <div className="form-group">
                <label>Level:</label>
                <select 
                  value={editingGroup.level}
                  onChange={(e) => setEditingGroup({...editingGroup, level: e.target.value})}
                >
                  <option value="advanced">Advanced Level</option>
                  <option value="ordinary">Ordinary Level</option>
                  <option value="university">University</option>
                  <option value="london-al">London A/L</option>
                  <option value="london-ol">London O/L</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="save-btn" 
                onClick={handleSaveGroupName}
                disabled={newGroupName.trim() === '' || newGroupSubject.trim() === ''}
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