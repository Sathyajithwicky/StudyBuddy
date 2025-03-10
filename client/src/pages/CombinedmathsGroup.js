import React, { useState } from 'react';
import './StudyGroup.css'; // Using the same CSS file as Physics group

const CombinedMathsGroup = () => {
  const [activeTab, setActiveTab] = useState('Study Material');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  
  // Array of study materials
  const studyMaterials = [
    { name: 'Calculus Fundamentals.pdf', size: '2.5 MB' },
    { name: 'Statistics and Probability.pdf', size: '3.1 MB' },
    { name: 'Pure Mathematics Notes.pdf', size: '2.8 MB' },
    { name: 'Applied Mathematics Formula Sheet.pdf', size: '1.7 MB' },
    { name: 'Past Papers and Solutions.pdf', size: '4.2 MB' }
  ];

  // Array of quizzes
  const quizzes = [
    { name: 'Calculus Quiz', size: '20 Questions' },
    { name: 'Statistics Quiz', size: '15 Questions' },
    { name: 'Algebra and Functions Quiz', size: '18 Questions' },
    { name: 'Vectors and Mechanics Quiz', size: '12 Questions' },
    { name: 'Differential Equations Quiz', size: '10 Questions' }
  ];

  // Quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: "What is the derivative of f(x) = x²?",
      options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
      correctAnswer: "f'(x) = 2x"
    },
    {
      id: 2,
      question: "What is the integral of f(x) = 2x?",
      options: ["∫f(x)dx = x² + C", "∫f(x)dx = x² + 2C", "∫f(x)dx = 2x² + C", "∫f(x)dx = x + C"],
      correctAnswer: "∫f(x)dx = x² + C"
    },
    {
      id: 3,
      question: "In statistics, what does the standard deviation measure?",
      options: ["Central tendency", "Dispersion or variation", "Correlation", "Probability"],
      correctAnswer: "Dispersion or variation"
    },
    {
      id: 4,
      question: "What is the formula for the area of a circle?",
      options: ["A = πr", "A = 2πr", "A = πr²", "A = 2πr²"],
      correctAnswer: "A = πr²"
    },
    {
      id: 5,
      question: "What is the value of sin(π/2)?",
      options: ["0", "1", "-1", "undefined"],
      correctAnswer: "1"
    },
    {
      id: 6,
      question: "What is the limit of (1+1/n)^n as n approaches infinity?",
      options: ["0", "1", "e", "infinity"],
      correctAnswer: "e"
    },
    {
      id: 7,
      question: "What is the solution to the equation x² - 4 = 0?",
      options: ["x = ±2", "x = ±4", "x = 2", "x = 4"],
      correctAnswer: "x = ±2"
    },
    {
      id: 8,
      question: "What is the dot product of two perpendicular vectors?",
      options: ["1", "0", "-1", "Undefined"],
      correctAnswer: "0"
    },
    {
      id: 9,
      question: "What is the formula for the volume of a sphere?",
      options: ["V = 4πr²", "V = (4/3)πr³", "V = πr³", "V = (4/3)πr²"],
      correctAnswer: "V = (4/3)πr³"
    },
    {
      id: 10,
      question: "What is the derivative of sin(x)?",
      options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
      correctAnswer: "cos(x)"
    },
    {
      id: 11,
      question: "In a normal distribution, what percentage of data falls within one standard deviation of the mean?",
      options: ["50%", "68%", "95%", "99.7%"],
      correctAnswer: "68%"
    },
    {
      id: 12,
      question: "What is the formula for the nth term of an arithmetic sequence?",
      options: ["an = a₁ + (n-1)d", "an = a₁ × r^(n-1)", "an = n × a₁", "an = a₁ + n × d"],
      correctAnswer: "an = a₁ + (n-1)d"
    },
    {
      id: 13,
      question: "What is the value of cos(π)?",
      options: ["0", "1", "-1", "undefined"],
      correctAnswer: "-1"
    },
    {
      id: 14,
      question: "What is the formula for the distance between two points (x₁,y₁) and (x₂,y₂)?",
      options: ["d = |x₂ - x₁| + |y₂ - y₁|", "d = √[(x₂ - x₁)² + (y₂ - y₁)²]", "d = (x₂ - x₁) × (y₂ - y₁)", "d = max(|x₂ - x₁|, |y₂ - y₁|)"],
      correctAnswer: "d = √[(x₂ - x₁)² + (y₂ - y₁)²]"
    },
    {
      id: 15,
      question: "What is the derivative of e^x?",
      options: ["e^x", "xe^(x-1)", "e^x × ln(x)", "0"],
      correctAnswer: "e^x"
    },
    {
      id: 16,
      question: "What is the formula for the sum of the first n natural numbers?",
      options: ["n(n+1)", "n(n+1)/2", "n²", "n(n-1)/2"],
      correctAnswer: "n(n+1)/2"
    },
    {
      id: 17,
      question: "What is the value of log₁₀(100)?",
      options: ["1", "2", "10", "100"],
      correctAnswer: "2"
    },
    {
      id: 18,
      question: "What is the formula for the area of a triangle using base and height?",
      options: ["A = bh", "A = (1/2)bh", "A = (1/3)bh", "A = b + h"],
      correctAnswer: "A = (1/2)bh"
    },
    {
      id: 19,
      question: "What is the solution to the quadratic equation ax² + bx + c = 0?",
      options: ["x = (-b ± √(b² - 4ac))/2a", "x = -b/a", "x = -c/b", "x = b² - 4ac"],
      correctAnswer: "x = (-b ± √(b² - 4ac))/2a"
    },
    {
      id: 20,
      question: "What is the definition of a continuous function?",
      options: ["A function with no gaps or breaks", "A function that is differentiable everywhere", "A function that is always increasing", "A function with a finite range"],
      correctAnswer: "A function with no gaps or breaks"
    }
  ];

  // Array of mathematics videos
  const videos = [
    {
      id: 1,
      title: 'Calculus Made Easy: Understanding Limits and Derivatives',
      channel: 'Math Explained',
      views: '899K views',
      timeAgo: '6 hours ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '27:09',
      verified: true,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 2,
      title: 'Statistics Fundamentals: Probability Distributions Explained',
      channel: 'Math Academy',
      views: '4.2M views',
      timeAgo: '1 day ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '3:14',
      verified: true,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 3,
      title: 'Linear Algebra: Vectors, Matrices and Transformations',
      channel: 'Math World',
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
      title: 'Differential Equations: From Theory to Applications',
      channel: 'Math Lectures',
      views: 'Updated today',
      timeAgo: '',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '',
      verified: false,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 5,
      title: 'Trigonometry: Understanding Sine, Cosine and Tangent',
      channel: 'Math Simplified',
      views: '118 views',
      timeAgo: '1 day ago',
      thumbnail: 'https://img.youtube.com/vi/cqUcqLL_dyA/maxresdefault.jpg',
      duration: '5:04',
      verified: false,
      url: 'https://youtu.be/cqUcqLL_dyA?si=_j0iAB0DGtmeo-oK'
    },
    {
      id: 6,
      title: 'Complex Numbers and Their Applications in Engineering',
      channel: 'Advanced Mathematics',
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
      case 'Quizzes':
        if (showQuiz) {
          return (
            <div className="quiz-container">
              <h2>Calculus Quiz</h2>
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
      case 'Discussion':
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

export default CombinedMathsGroup;