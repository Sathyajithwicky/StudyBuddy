import React, { useState } from 'react';
import './StudyGroup.css'; // Make sure to create this CSS file

const PhysicsGroup = () => {
  const [activeTab, setActiveTab] = useState('Quizzes');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  
  // Array of study materials
  const studyMaterials = [
    { name: 'Physics Fundamentals.pdf', size: '2.3 MB' },
    { name: 'Mechanics Notes.pdf', size: '2.3 MB' },
    { name: 'Practice Problems.pdf', size: '2.3 MB' },
    { name: 'Formula Sheet.pdf', size: '2.3 MB' },
    { name: 'Past Papers.pdf', size: '2.3 MB' }
  ];

  // Array of quizzes
  const quizzes = [
    { name: 'Mechanics Quiz', size: '20 Questions' },
    { name: 'Thermodynamics Quiz', size: '15 Questions' },
    { name: 'Electromagnetism Quiz', size: '18 Questions' },
    { name: 'Quantum Physics Quiz', size: '12 Questions' },
    { name: 'Relativity Quiz', size: '10 Questions' }
  ];

  // Quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: "What is the acceleration of a vehicle moving at a constant velocity?",
      options: ["0 m/s²", "9.8 m/s²", "1 m/s²", "5 m/s²"],
      correctAnswer: "0 m/s²"
    },
    {
      id: 2,
      question: "What is the unit of linear momentum?",
      options: ["kg m/s", "kg m/s²", "N", "J"],
      correctAnswer: "kg m/s"
    },
    {
      id: 3,
      question: "Which force acts parallel to the surface of contact?",
      options: ["Gravitational force", "Normal force", "Frictional force", "Tension"],
      correctAnswer: "Frictional force"
    },
    {
      id: 4,
      question: "Newton's first law is also known as the law of…?",
      options: ["Acceleration", "Inertia", "Action and reaction", "Energy conservation"],
      correctAnswer: "Inertia"
    },
    {
      id: 5,
      question: "What is the SI unit of force?",
      options: ["Pascal", "Newton", "Joule", "Watt"],
      correctAnswer: "Newton"
    },
    {
      id: 6,
      question: "A ball is thrown straight up. At its highest point, its velocity is…?",
      options: ["Maximum", "Zero", "Equal to initial velocity", "Infinite"],
      correctAnswer: "Zero"
    },
    {
      id: 7,
      question: "The gravitational acceleration (g) on Earth is approximately…?",
      options: ["5.8 m/s²", "9.8 m/s²", "12.8 m/s²", "1.8 m/s²"],
      correctAnswer: "9.8 m/s²"
    },
    {
      id: 8,
      question: "Work is defined as…?",
      options: ["Force × Time", "Force × Distance", "Mass × Acceleration", "Mass × Velocity"],
      correctAnswer: "Force × Distance"
    },
    {
      id: 9,
      question: "A body in motion continues moving unless acted upon by an external force. This is…?",
      options: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", "Law of Gravitation"],
      correctAnswer: "Newton's 1st Law"
    },
    {
      id: 10,
      question: "The ability of an object to resist changes in its motion is called…?",
      options: ["Energy", "Power", "Inertia", "Work"],
      correctAnswer: "Inertia"
    },
    {
      id: 11,
      question: "The product of mass and velocity is called…?",
      options: ["Force", "Momentum", "Work", "Acceleration"],
      correctAnswer: "Momentum"
    },
    {
      id: 12,
      question: "The SI unit of power is…?",
      options: ["Joule", "Watt", "Newton", "Pascal"],
      correctAnswer: "Watt"
    },
    {
      id: 13,
      question: "An object is moving in a circular path at constant speed. What remains constant?",
      options: ["Velocity", "Acceleration", "Speed", "Direction"],
      correctAnswer: "Speed"
    },
    {
      id: 14,
      question: "The force that opposes the motion of an object in fluid is…?",
      options: ["Friction", "Tension", "Drag", "Normal force"],
      correctAnswer: "Drag"
    },
    {
      id: 15,
      question: "Which of the following is a vector quantity?",
      options: ["Speed", "Distance", "Work", "Force"],
      correctAnswer: "Force"
    },
    {
      id: 16,
      question: "The force that acts on an object due to gravity is called…?",
      options: ["Mass", "Weight", "Momentum", "Friction"],
      correctAnswer: "Weight"
    },
    {
      id: 17,
      question: "What is the SI unit of work?",
      options: ["Newton", "Joule", "Watt", "Pascal"],
      correctAnswer: "Joule"
    },
    {
      id: 18,
      question: "If the net force on an object is zero, the object will…?",
      options: ["Accelerate", "Move in a circular path", "Remain at rest or move with constant velocity", "Fall freely"],
      correctAnswer: "Remain at rest or move with constant velocity"
    },
    {
      id: 19,
      question: "The force of action and reaction are…?",
      options: ["Equal in magnitude and opposite in direction", "Equal in magnitude and same direction", "Different in magnitude", "Independent of each other"],
      correctAnswer: "Equal in magnitude and opposite in direction"
    },
    {
      id: 20,
      question: "The acceleration of an object is directly proportional to…?",
      options: ["Its mass", "The net force acting on it", "Its velocity", "Its energy"],
      correctAnswer: "The net force acting on it"
    }
  ];

  // Array of physics videos
  const videos = [
    {
      id: 1,
      title: 'Understanding Quantum Mechanics: Wave-Particle Duality Explained',
      channel: 'Physics Explained',
      views: '899K views',
      timeAgo: '6 hours ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '27:09',
      verified: true,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 2,
      title: 'Newton\'s Laws of Motion - Comprehensive Physics Tutorial',
      channel: 'Science Academy',
      views: '4.2M views',
      timeAgo: '1 day ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '3:14',
      verified: true,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 3,
      title: 'Special Relativity: Understanding Einstein\'s Revolutionary Theory',
      channel: 'Physics World',
      views: '618K views',
      timeAgo: '2 days ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '49:28',
      verified: true,
      live: true,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 4,
      title: 'Electromagnetism Fundamentals - From Maxwell\'s Equations to Applications',
      channel: 'Physics Lectures',
      views: 'Updated today',
      timeAgo: '',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '',
      verified: false,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 5,
      title: 'Thermodynamics: Laws, Entropy and Energy Transfer Explained',
      channel: 'Science Simplified',
      views: '118 views',
      timeAgo: '1 day ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '5:04',
      verified: false,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 6,
      title: 'Quantum Field Theory: Understanding the Fundamental Forces',
      channel: 'Advanced Physics',
      views: '2.7M views',
      timeAgo: '1 month ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '2:12',
      verified: true,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    }
  ];

  const handleDownload = (fileName) => {
    // In a real app, this would be an API call to download the file
    // For now, we'll just show an alert
    alert(`Downloading ${fileName}`);
    
    // You would typically do something like this:
    // const fileUrl = `/api/files/download/${fileName}`;
    // window.open(fileUrl, '_blank');
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setShowQuiz(false);
    setQuizSubmitted(false);
    setUserAnswers({});
  };

  const handleVideoClick = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setQuizSubmitted(false);
    setUserAnswers({});
  };

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    
    quizQuestions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setQuizSubmitted(true);
  };

  // Placeholder content for other tabs
  const renderTabContent = () => {
    switch(activeTab) {
      case 'Study Material':
        return (
          <div className="study-materials-list">
            {studyMaterials.map((material, index) => (
              <div key={index} className="material-item">
                <div className="material-info">
                  <div className="file-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div className="file-details">
                    <div className="file-name">{material.name}</div>
                    <div className="file-size">{material.size}</div>
                  </div>
                </div>
                <button 
                  className="download-button" 
                  onClick={() => handleDownload(material.name)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        );
      case 'Videos':
        return (
          <div className="videos-grid">
            {videos.map((video) => (
              <div key={video.id} className="video-card" onClick={() => handleVideoClick(video.url)}>
                <div className="thumbnail-container">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="video-thumbnail" 
                  />
                  {video.duration && (
                    <div className="video-duration">{video.duration}</div>
                  )}
                  {video.live && (
                    <div className="live-badge">LIVE</div>
                  )}
                </div>
                <div className="video-info">
                  <div className="channel-icon">
                    {video.channel.charAt(0)}
                  </div>
                  <div className="video-details">
                    <h3 className="video-title">{video.title}</h3>
                    <div className="channel-info">
                      <span className="channel-name">{video.channel}</span>
                      {video.verified && (
                        <span className="verified-badge">✓</span>
                      )}
                    </div>
                    <div className="video-meta">
                      <span className="video-views">{video.views}</span>
                      {video.timeAgo && (
                        <>
                          <span className="dot-separator">•</span>
                          <span className="video-time">{video.timeAgo}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="video-options">
                    <button className="options-button">⋮</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'Quizzes':
        if (showQuiz) {
          return (
            <div className="quiz-container">
              <h2>Mechanics Quiz</h2>
              {quizSubmitted ? (
                <div className="quiz-results">
                  <div className="score-display">
                    <h3>Your Score: {score} out of 20</h3>
                    <div className="score-percentage">
                      {Math.round((score / 20) * 100)}%
                    </div>
                  </div>
                  <button 
                    className="retry-button"
                    onClick={() => {
                      setShowQuiz(true);
                      setQuizSubmitted(false);
                      setUserAnswers({});
                    }}
                  >
                    Try Again
                  </button>
                  <button 
                    className="back-button"
                    onClick={() => {
                      setShowQuiz(false);
                      setQuizSubmitted(false);
                    }}
                  >
                    Back to Quizzes
                  </button>
                </div>
              ) : (
                <>
                  <div className="quiz-questions">
                    {quizQuestions.map((question) => (
                      <div key={question.id} className="question-card">
                        <h3>Question {question.id}</h3>
                        <p>{question.question}</p>
                        <div className="options-list">
                          {question.options.map((option, index) => (
                            <div 
                              key={index} 
                              className={`option ${userAnswers[question.id] === option ? 'selected' : ''}`}
                              onClick={() => handleAnswerSelect(question.id, option)}
                            >
                              <span className="option-letter">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="option-text">{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="quiz-actions">
                    <button 
                      className="submit-quiz-button"
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(userAnswers).length < 20}
                    >
                      Submit Quiz
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        } else {
          return (
            <div className="study-materials-list">
              {quizzes.map((quiz, index) => (
                <div key={index} className="material-item">
                  <div className="material-info">
                    <div className="file-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                      </svg>
                    </div>
                    <div className="file-details">
                      <div className="file-name">{quiz.name}</div>
                      <div className="file-size">{quiz.size}</div>
                    </div>
                  </div>
                  <button 
                    className="quiz-button" 
                    onClick={handleStartQuiz}
                  >
                    Attempt Quiz
                  </button>
                </div>
              ))}
            </div>
          );
        }
      case 'Community Chat':
        return <div className="placeholder-content">Community chat will be displayed here</div>;
      case 'Quick Answers':
        return <div className="placeholder-content">Quick answers will be displayed here</div>;
      default:
        return <div className="placeholder-content">Select a tab to view content</div>;
    }
  };

  return (
    <div className="study-group-page">
      <div className="study-group-container">
        <div className="study-group-navigation">
          {['Study Material', 'Videos', 'Quizzes', 'Community Chat', 'Quick Answers'].map((tab) => (
            <button 
              key={tab}
              className={`nav-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="content-container">
          {renderTabContent()}
        </div>
      </div>
      <div className="attribution">
        Video source: <a href="https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK" target="_blank" rel="noopener noreferrer">YouTube</a>
      </div>
    </div>
  );
};

export default PhysicsGroup; 