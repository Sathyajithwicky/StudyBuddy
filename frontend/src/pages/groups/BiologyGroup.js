import React, { useState } from 'react';
import '../StudyGroup.css'; // Make sure to create this CSS file

const BiologyGroup = () => {
  const [activeTab, setActiveTab] = useState('Study Material');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  
  // Array of study materials
  const studyMaterials = [
    { name: 'Cell Biology Fundamentals.pdf', size: '2.3 MB' },
    { name: 'Genetics Notes.pdf', size: '2.3 MB' },
    { name: 'Human Anatomy.pdf', size: '2.3 MB' },
    { name: 'Ecology Study Guide.pdf', size: '2.3 MB' },
    { name: 'Past Papers.pdf', size: '2.3 MB' }
  ];

  // Array of quizzes
  const quizzes = [
    { name: 'Cell Biology Quiz', size: '20 Questions' },
    { name: 'Genetics Quiz', size: '15 Questions' },
    { name: 'Human Systems Quiz', size: '18 Questions' },
    { name: 'Ecology Quiz', size: '12 Questions' },
    { name: 'Evolution Quiz', size: '10 Questions' }
  ];

  // Quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Golgi Body", "Endoplasmic Reticulum"],
      correctAnswer: "Mitochondria"
    },
    {
      id: 2,
      question: "Which of these is NOT a nucleotide base found in DNA?",
      options: ["Adenine", "Uracil", "Guanine", "Cytosine"],
      correctAnswer: "Uracil"
    },
    {
      id: 3,
      question: "What is the process by which plants convert light energy into chemical energy?",
      options: ["Cellular Respiration", "Photosynthesis", "Fermentation", "Glycolysis"],
      correctAnswer: "Photosynthesis"
    },
    {
      id: 4,
      question: "Which blood type is known as the universal donor?",
      options: ["Type A", "Type B", "Type AB", "Type O-"],
      correctAnswer: "Type O-"
    },
    {
      id: 5,
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Brain", "Skin", "Liver"],
      correctAnswer: "Skin"
    },
    {
      id: 6,
      question: "Which of these is a function of the liver?",
      options: ["Pumping blood", "Filtering toxins", "Producing insulin", "Digesting food"],
      correctAnswer: "Filtering toxins"
    },
    {
      id: 7,
      question: "What is the process of cell division called?",
      options: ["Meiosis", "Mitosis", "Binary Fission", "Budding"],
      correctAnswer: "Mitosis"
    },
    {
      id: 8,
      question: "Which of these is NOT a type of blood vessel?",
      options: ["Artery", "Vein", "Capillary", "Lymph"],
      correctAnswer: "Lymph"
    },
    {
      id: 9,
      question: "What is the basic unit of heredity?",
      options: ["Cell", "Chromosome", "Gene", "DNA"],
      correctAnswer: "Gene"
    },
    {
      id: 10,
      question: "Which organelle is responsible for protein synthesis?",
      options: ["Ribosome", "Lysosome", "Vacuole", "Nucleus"],
      correctAnswer: "Ribosome"
    },
    {
      id: 11,
      question: "What is the process of breaking down glucose to produce energy called?",
      options: ["Photosynthesis", "Cellular Respiration", "Fermentation", "Digestion"],
      correctAnswer: "Cellular Respiration"
    },
    {
      id: 12,
      question: "Which of these is NOT a function of proteins?",
      options: ["Energy storage", "Enzyme catalysis", "Transport", "Structure"],
      correctAnswer: "Energy storage"
    },
    {
      id: 13,
      question: "What is the name for a group of similar organisms that can interbreed?",
      options: ["Genus", "Family", "Species", "Order"],
      correctAnswer: "Species"
    },
    {
      id: 14,
      question: "Which of these is a greenhouse gas?",
      options: ["Nitrogen", "Oxygen", "Carbon dioxide", "Hydrogen"],
      correctAnswer: "Carbon dioxide"
    },
    {
      id: 15,
      question: "What is the pH of a neutral solution?",
      options: ["0", "7", "14", "10"],
      correctAnswer: "7"
    }
  ];

  // Array of biology videos
  const videos = [
    {
      id: 1,
      title: 'Understanding Cell Biology: Structure and Function',
      channel: 'Biology Explained',
      views: '899K views',
      timeAgo: '6 hours ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '27:09',
      verified: true,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 2,
      title: 'Genetics and DNA Replication',
      channel: 'Biology Academy',
      views: '4.2M views',
      timeAgo: '1 day ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '3:14',
      verified: true,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 3,
      title: 'Human Body Systems',
      channel: 'Biology World',
      views: '618K views',
      timeAgo: '2 days ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '49:28',
      verified: true,
      live: true,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    }
  ];

  const handleDownload = (fileName) => {
    alert(`Downloading ${fileName}`);
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
              <h2>Biology Quiz</h2>
              {quizSubmitted ? (
                <div className="quiz-results">
                  <div className="score-display">
                    <h3>Your Score: {score} out of {quizQuestions.length}</h3>
                    <div className="score-percentage">
                      {Math.round((score / quizQuestions.length) * 100)}%
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
                      disabled={Object.keys(userAnswers).length < quizQuestions.length}
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                    </div>
                    <div className="file-details">
                      <div className="file-name">{quiz.name}</div>
                      <div className="file-size">{quiz.size}</div>
                    </div>
                  </div>
                  <button 
                    className="start-quiz-button" 
                    onClick={handleStartQuiz}
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <div className="study-group-container">
      <div className="group-header">
        <h1>Biology Study Group</h1>
      </div>
      <div className="study-group-navigation">
        <button 
          className={`nav-button ${activeTab === 'Study Material' ? 'active' : ''}`}
          onClick={() => handleTabChange('Study Material')}
        >
          Study Material
        </button>
        <button 
          className={`nav-button ${activeTab === 'Videos' ? 'active' : ''}`}
          onClick={() => handleTabChange('Videos')}
        >
          Videos
        </button>
        <button 
          className={`nav-button ${activeTab === 'Quizzes' ? 'active' : ''}`}
          onClick={() => handleTabChange('Quizzes')}
        >
          Quizzes
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BiologyGroup;