import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';

function CreateGroup() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate input
      if (!groupData.name.trim() || !groupData.description.trim() || !groupData.category.trim()) {
        alert('Please fill in all fields');
        return;
      }

      const response = await axios.post('/api/groups/create', groupData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCreatedGroupId(response.data.group._id);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  const handleJoinGroup = async (addToProfile) => {
    try {
      const joinResponse = await axios.post(`/api/groups/${createdGroupId}/join`, {
        groupName: groupData.name,
        groupDescription: groupData.description,
        groupCategory: groupData.category
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (joinResponse.data.success) {
        setShowModal(false);
        
        if (addToProfile) {
          const groupShortcut = {
            _id: createdGroupId,
            name: groupData.name,
            description: groupData.description,
            category: groupData.category
          };

          await axios.put('/api/auth/update-joined-groups', {
            group: groupShortcut
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          // Show Bootstrap alert
          setAlertMessage(`${groupData.name} has been added to your profile!`);
          setShowAlert(true);
          
          // Navigate after delay
          setTimeout(() => {
            navigate('/profile?refresh=' + Date.now());
          }, 3000);
        } else {
          setAlertMessage(`You have joined ${groupData.name}`);
          setShowAlert(true);
          setTimeout(() => {
            navigate('/study-groups');
          }, 3000);
        }
      }
    } catch (joinError) {
      console.error('Error joining group:', joinError);
      setAlertMessage('Failed to join group. Please try again.');
      setShowAlert(true);
    }
  };

  const handleChange = (e) => {
    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value
    });
  };

  const handleFavoriteClick = async (groupId) => {
    try {
      const response = await axios.post(`/api/groups/${groupId}/favorite`, 
        { isFavorite: !isFavorite },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setIsFavorite(!isFavorite);
        alert(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      alert('Failed to update favorite status. Please try again.');
    }
  };

  // Check if token exists and redirect if not
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="container mt-5">
      {showAlert && (
        <div 
          className="alert alert-success alert-dismissible fade show" 
          role="alert"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: '300px',
            textAlign: 'center',
            border: '2px solid #000'
          }}
        >
          <strong>{alertMessage}</strong>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}

      <h2>Create New Group</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Group Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={groupData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={groupData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={groupData.category}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Group
        </button>
      </form>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add to Profile?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Would you like to add this group to your profile?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleJoinGroup(false)}>
            No
          </Button>
          <Button variant="primary" onClick={() => handleJoinGroup(true)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title">{groupData.name}</h5>
            <button 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => handleFavoriteClick(createdGroupId)}
            >
              <FaStar className={isFavorite ? 'filled' : ''} />
            </button>
          </div>
          {/* ... rest of your card content ... */}
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
