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
  const [alertType, setAlertType] = useState('success');
  const [groupCreated, setGroupCreated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate input
      if (!groupData.name.trim() || !groupData.description.trim() || !groupData.category.trim()) {
        setAlertMessage('Please fill in all fields');
        setAlertType('danger');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
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
        setGroupCreated(true);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setAlertMessage('Failed to create group. Please try again.');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
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
          // Add group to joined groups
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

          setAlertMessage(`${groupData.name} has been added to your profile!`);
          setAlertType('success');
          setShowAlert(true);
          
          // Navigate after delay
          setTimeout(() => {
            setShowAlert(false);
            navigate('/');
          }, 3000);
        } else {
          setAlertMessage(`You have joined ${groupData.name}`);
          setAlertType('success');
          setShowAlert(true);
          
          setTimeout(() => {
            setShowAlert(false);
            navigate('/');
          }, 3000);
        }
      }
    } catch (joinError) {
      console.error('Error joining group:', joinError);
      setAlertMessage('Failed to join group. Please try again.');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleChange = (e) => {
    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value
    });
  };

  const handleFavoriteClick = async (groupId) => {
    if (!groupId) {
      setAlertMessage('Please create a group first');
      setAlertType('warning');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    
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
        setAlertMessage(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
        setAlertType('success');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      setAlertMessage('Failed to update favorite status. Please try again.');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
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
          className={`alert alert-${alertType} alert-dismissible fade show`}
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

      {/* Only show the card if a group has been created */}
      {groupCreated && (
        <div className="card mt-4">
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
            <p className="card-text">{groupData.description}</p>
            <p className="card-text"><small className="text-muted">Category: {groupData.category}</small></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateGroup;
