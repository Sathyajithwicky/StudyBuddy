import React from 'react';
import GroupChat from '../../components/GroupChat';
import './PhysicsGroup.css';

function PhysicsGroup() {
  return (
    <div className="group-page">
      <div className="group-info">
        <h2>Physics Study Group</h2>
        <p>Welcome to the Physics study group! Share your knowledge and ask questions.</p>
      </div>
      
      <div className="group-content">
        <div className="group-resources">
          {/* Add your resources section here */}
        </div>
        
        <GroupChat 
          groupId="physics_group" 
          groupName="Physics Study Group"
        />
      </div>
    </div>
  );
}

export default PhysicsGroup; 