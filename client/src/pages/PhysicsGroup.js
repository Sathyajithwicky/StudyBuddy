import React from 'react';
import StudyGroup from '../components/StudyGroup';

const materials = [
  { name: 'Physics Fundamentals.pdf', url: '#' },
  { name: 'Mechanics Notes.pdf', url: '#' },
  { name: 'Practice Problems.pdf', url: '#' },
  { name: 'Formula Sheet.pdf', url: '#' },
  { name: 'Past Papers.pdf', url: '#' }
];

function PhysicsGroup() {
  return <StudyGroup subject="Physics" materials={materials} />;
}

export default PhysicsGroup; 