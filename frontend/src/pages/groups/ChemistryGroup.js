import React from 'react';
import StudyGroup from '../../components/StudyGroup';

const materials = [
  { name: 'Chemistry Fundamentals.pdf', url: '#' },
  { name: 'Organic Chemistry Notes.pdf', url: '#' },
  { name: 'Chemical Reactions Practice.pdf', url: '#' }
];

const videos = [
  { title: 'Introduction to Chemical Bonding', thumbnail: '/chemistry-thumb-1.jpg' },
  { title: 'Organic Chemistry Basics', thumbnail: '/chemistry-thumb-2.jpg' },
  { title: 'Balancing Chemical Equations', thumbnail: '/chemistry-thumb-3.jpg' }
];

function ChemistryGroup() {
  return <StudyGroup subject="Chemistry" materials={materials} videos={videos} />;
}

export default ChemistryGroup; 