import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';

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
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      const joinResponse = await axios.post(`/api/groups/${createdGroupId}/join`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (joinResponse.data.success) {
        setShowModal(false);
        if (addToProfile) {
          setShowConfirmation(true);
          setTimeout(() => {
            setShowConfirmation(false);
            navigate('/profile?refresh=' + Date.now());
          }, 2000);
        } else {
          navigate('/study-groups');
        }
      }
    } catch (joinError) {
      console.error('Error joining group:', joinError);
      alert('Failed to join group. Please try again.');
    }
  };

  const handleChange = (e) => {
    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value
    });
  };

  // Check if token exists and redirect if not
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="container mt-5">
      {showConfirmation && (
        <div className="alert alert-success" role="alert">
          Group successfully added to your profile!
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
    </div>
  );
}

export default CreateGroup;
