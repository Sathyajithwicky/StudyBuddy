import React from 'react';
import StudyGroup from '../../components/StudyGroup';

const materials = [
  { name: 'Cell Biology.pdf', url: '#' },
  { name: 'Genetics Notes.pdf', url: '#' },
  { name: 'Evolution Practice Questions.pdf', url: '#' }
];

const videos = [
  { title: 'Cell Structure and Function', thumbnail: '/biology-thumb-1.jpg' },
  { title: 'DNA and RNA', thumbnail: '/biology-thumb-2.jpg' },
  { title: 'Natural Selection', thumbnail: '/biology-thumb-3.jpg' }
];

function BiologyGroup() {
  return <StudyGroup subject="Biology" materials={materials} videos={videos} />;
}

export default BiologyGroup; 