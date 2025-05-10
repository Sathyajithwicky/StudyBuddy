import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinGroup.css';
import { useAuth } from '../context/AuthContext';

function JoinGroup() {
  const { token, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [studyGroups, setStudyGroups] = useState([]);
  const navigate = useNavigate();
  
  // Load study groups from localStorage or use default data
  useEffect(() => {
    const savedGroups = localStorage.getItem('studyGroups');
    
    if (savedGroups) {
      setStudyGroups(JSON.parse(savedGroups));
    } else {
      // Default study groups data
      const defaultGroups = [
        { id: 1, name: "Physics Study Group", level: "advanced", subject: "Physics", members: 5, maxMembers: 10 },
        { id: 2, name: "Combined Mathematics Study Group", level: "advanced", subject: "Combined Mathematics", members: 5, maxMembers: 10 },
        { id: 4, name: "Chemistry Study Group", level: "advanced", subject: "Chemistry", members: 5, maxMembers: 10 },
        { id: 5, name: "Biology Study Group", level: "advanced", subject: "Biology", members: 5, maxMembers: 10 },
        { id: 6, name: "Chemistry Study Group", level: "advanced", subject: "Chemistry", members: 5, maxMembers: 10 },
        { id: 8, name: "Agricultural Science Study Group", level: "advanced", subject: "Agricultural Science", members: 5, maxMembers: 10 },
        { id: 9, name: "Business Studies Study Group", level: "advanced", subject: "Business Studies", members: 5, maxMembers: 10 },
        { id: 10, name: "Accounting Study Group", level: "advanced", subject: "Accounting", members: 5, maxMembers: 10 },
        { id: 11, name: "Economics Study Group", level: "advanced", subject: "Economics", members: 5, maxMembers: 10 },
        { id: 12, name: "Business Statistics Study Group", level: "advanced", subject: "Business Statistics", members: 5, maxMembers: 10 },
        { id: 13, name: "Information and Communication Technology (ICT) Study Group", level: "advanced", subject: "Information and Communication Technology (ICT)", members: 5, maxMembers: 10 },
        { id: 14, name: "Buddhism Study Group", level: "advanced", subject: "Buddhism", members: 5, maxMembers: 10 },
        { id: 15, name: "Hinduism Study Group", level: "advanced", subject: "Hinduism", members: 5, maxMembers: 10 },
        { id: 16, name: "Islam Study Group", level: "advanced", subject: "Islam", members: 5, maxMembers: 10 },
        { id: 17, name: "Christianity Study Group", level: "advanced", subject: "Christianity", members: 5, maxMembers: 10 },
        { id: 18, name: "Sinhala Study Group", level: "advanced", subject: "Sinhala", members: 5, maxMembers: 10 },
        { id: 19, name: "Tamil Study Group", level: "advanced", subject: "Tamil", members: 5, maxMembers: 10 },
        { id: 20, name: "English Study Group", level: "advanced", subject: "English", members: 5, maxMembers: 10 },
        { id: 21, name: "Pali Study Group", level: "advanced", subject: "Pali", members: 5, maxMembers: 10 },
        { id: 22, name: "Sanskrit Study Group", level: "advanced", subject: "Sanskrit", members: 5, maxMembers: 10 },
        { id: 23, name: "Arabic Study Group", level: "advanced", subject: "Arabic", members: 5, maxMembers: 10 },
        { id: 24, name: "Hindi Study Group", level: "advanced", subject: "Hindi", members: 5, maxMembers: 10 },
        { id: 25, name: "Japanese Study Group", level: "advanced", subject: "Japanese", members: 5, maxMembers: 10 },
        { id: 26, name: "Chinese Study Group", level: "advanced", subject: "Chinese", members: 5, maxMembers: 10 },
        { id: 27, name: "Korean Study Group", level: "advanced", subject: "Korean", members: 5, maxMembers: 10 },
        { id: 28, name: "Malay Study Group", level: "advanced", subject: "Malay", members: 5, maxMembers: 10 },
        { id: 29, name: "French Study Group", level: "advanced", subject: "French", members: 5, maxMembers: 10 },
        { id: 30, name: "German Study Group", level: "advanced", subject: "German", members: 5, maxMembers: 10 },
        { id: 31, name: "Russian Study Group", level: "advanced", subject: "Russian", members: 5, maxMembers: 10 },
        { id: 32, name: "Political Science Study Group", level: "advanced", subject: "Political Science", members: 5, maxMembers: 10 },
        { id: 33, name: "History (Sri Lankan, Indian, European, Modern World) Study Group", level: "advanced", subject: "History (Sri Lankan, Indian, European, Modern World)", members: 5, maxMembers: 10 },
        { id: 34, name: "Geography Study Group", level: "advanced", subject: "Geography", members: 5, maxMembers: 10 },
        { id: 35, name: "Logic and Scientific Method Study Group", level: "advanced", subject: "Logic and Scientific Method", members: 5, maxMembers: 10 },
        { id: 36, name: "Mass Media and Communication Studies Study Group", level: "advanced", subject: "Mass Media and Communication Studies", members: 5, maxMembers: 10 },
        { id: 37, name: "Aesthetic Subjects (Dancing, Music [Western or Eastern], Drama, Art) Study Group", level: "advanced", subject: "Aesthetic Subjects (Dancing, Music [Western or Eastern], Drama, Art)", members: 5, maxMembers: 10 },
        { id: 38, name: "Home Science Study Group", level: "advanced", subject: "Home Science", members: 5, maxMembers: 10 },
        { id: 39, name: "Accounting or Business Statistics Study Group", level: "advanced", subject: "Accounting or Business Statistics", members: 5, maxMembers: 10 },
        { id: 40, name: "Agriculture or Mathematics Study Group", level: "advanced", subject: "Agriculture or Mathematics", members: 5, maxMembers: 10 },
        { id: 41, name: "Engineering Technology Study Group", level: "advanced", subject: "Engineering Technology", members: 5, maxMembers: 10 },
        { id: 42, name: "Science for Technology Study Group", level: "advanced", subject: "Science for Technology", members: 5, maxMembers: 10 },
        { id: 43, name: "Bio-system Technology Study Group", level: "advanced", subject: "Bio-system Technology", members: 5, maxMembers: 10 },
        { id: 44, name: "Information and Communication Technology (ICT) Study Group", level: "advanced", subject: "Information and Communication Technology (ICT)", members: 5, maxMembers: 10 },
        { id: 45, name: "Engineering Technology Study Group", level: "advanced", subject: "Engineering Technology", members: 5, maxMembers: 10 },
        { id: 46, name: "Science for Technology Study Group", level: "advanced", subject: "Science for Technology", members: 5, maxMembers: 10 },
        { id: 47, name: "Bio-system Technology Study Group", level: "advanced", subject: "Bio-system Technology", members: 5, maxMembers: 10 },
        { id: 48, name: "Chemistry Basics", level: "ordinary", subject: "Chemistry", members: 3, maxMembers: 8 },
        { id: 49, name: "Computer Science 101", level: "university", subject: "CS", members: 6, maxMembers: 12 },
        { id: 50, name: "Biology Advanced", level: "london-al", subject: "Biology", members: 4, maxMembers: 10 },
        { id: 51, name: "Mathematics", level: "london-ol", subject: "Math", members: 7, maxMembers: 15 }
      ];
      
      setStudyGroups(defaultGroups);
      localStorage.setItem('studyGroups', JSON.stringify(defaultGroups));
    }
  }, []);
  
  // Add useEffect to check auth status
  useEffect(() => {
    console.log('Auth Status:', { token, user });
  }, [token, user]);

  // Define categories here
  const categories = [
    { id: 'all', name: 'All Groups' },
    { id: 'advanced', name: 'Advanced Level' },
    { id: 'ordinary', name: 'Ordinary Level' },
    { id: 'university', name: 'University' },
    { id: 'london-al', name: 'London A/L' },
    { id: 'london-ol', name: 'London O/L' }
  ];
  
  // Filter groups based on selected category and search term
  const filteredGroups = studyGroups
    .filter(group => selectedCategory === 'all' || group.level === selectedCategory)
    .filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleJoinGroup = (subject) => {
    const routes = {
      'Physics': '/physics-group',
      'Chemistry': '/chemistry-group',
      'Biology': '/biology-group',
      'Combined Mathematics': '/combinedmaths-group'
      // Add more mappings for other subjects
    };
    
    navigate(routes[subject] || '/join-group');
  };

  const handleAddToProfile = (e, group) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    
    if (!token) {
      alert('Please log in to add groups to your profile');
      navigate('/login');
      return;
    }
    
    setSelectedGroup(group);
    setShowConfirmation(true);
  };

  const handleConfirmAdd = async () => {
    try {
      if (!selectedGroup) return;
      
      setIsLoading(true);

      // Format the group name by combining level and subject
      const levelName = categories.find(cat => cat.id === selectedGroup.level)?.name || '';
      const groupName = `${levelName} ${selectedGroup.subject}`;

      // Create the group object
      const groupObj = {
        id: selectedGroup.id,
        examName: groupName, // We use examName for consistency
        subject: selectedGroup.subject,
        level: selectedGroup.level
      };
      
      // Add to "myStudyGroups" in localStorage
      let myGroups = JSON.parse(localStorage.getItem('myStudyGroups') || '[]');
      
      // Check if group already exists
      const groupExists = myGroups.some(g => g.id === groupObj.id);
      if (!groupExists) {
        myGroups.push(groupObj);
        localStorage.setItem('myStudyGroups', JSON.stringify(myGroups));
        
        // Show success message
        alert(`${groupName} has been added to your profile`);
        
        // Navigate to profile or reload if already there
        if (window.location.pathname === '/profile') {
          window.location.reload();
        } else {
          navigate('/profile');
        }
      } else {
        alert('This group is already in your profile');
      }
    } catch (error) {
      console.error('Error adding group to profile:', error);
      alert('Failed to add group to profile. Please try again.');
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
      setSelectedGroup(null);
    }
  };

  return (
    <div className="join-group-container">
      <h1>Join a Study Group</h1>
      
      {/* Confirmation Popup */}
      {showConfirmation && selectedGroup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Do you want to add this group to your profile?</p>
            <p className="exam-name-preview">
              {`${categories.find(cat => cat.id === selectedGroup.level)?.name} ${selectedGroup.subject}`}
            </p>
            <div className="popup-buttons">
              <button 
                onClick={handleConfirmAdd} 
                className="popup-btn confirm-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Yes'}
              </button>
              <button 
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedGroup(null);
                }} 
                className="popup-btn cancel-btn"
                disabled={isLoading}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="search-and-filter">
        <input
          type="text"
          placeholder="Search by group name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="study-groups-grid">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <div key={group.id} className="group-card" onClick={() => handleJoinGroup(group.subject)}>
              <h3>{group.name}</h3>
              <div className="group-info">
                <p><strong>Subject:</strong> {group.subject}</p>
                <p><strong>Members:</strong> {group.members}/{group.maxMembers}</p>
                <p className="level-tag">{categories.find(cat => cat.id === group.level)?.name}</p>
              </div>
              <button className="join-btn">Enter Group</button>
              <button 
                className="add-to-profile-btn"
                onClick={(e) => handleAddToProfile(e, group)}
              >
                Add to profile
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No study groups found matching your search.</p>
        )}
      </div>
    </div>
  );
}

export default JoinGroup;
