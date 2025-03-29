import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import './FAQPage.css';  // Import the CSS file for styling

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Change this based on user role
  const [error, setError] = useState('');

  // 📌 Check user role (admin or not)
  useEffect(() => {
    // Assuming you have an authentication function to check if the user is an admin
    const user = JSON.parse(localStorage.getItem('user')); // Get the user from localStorage or your authentication state
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  // 📌 Fetch FAQs
  useEffect(() => {
    axios.get('/api/faq')
      .then(response => setFaqs(response.data))
      .catch(error => {
        console.error('Error fetching FAQs:', error);
        setError('Error fetching FAQs. Please try again later.');
      });
  }, []);

  // 📌 Create a new FAQ
  const handleCreateFAQ = () => {
    if (!newQuestion) {
      setError('Please enter a question.');
      return;
    }

    axios.post('/api/faq', { question: newQuestion })
      .then(response => {
        setFaqs([...faqs, response.data]);
        setNewQuestion('');
        setError('');
      })
      .catch(error => {
        console.error('Error creating FAQ:', error);
        setError('Error creating FAQ. Please try again later.');
      });
  };

  // 📌 Edit FAQ
  const handleEditFAQ = (id, question) => {
    if (!question) {
      setError('Question cannot be empty.');
      return;
    }

    axios.put(`/api/faq/${id}`, { question })
      .then(response => {
        setFaqs(faqs.map(faq => (faq._id === id ? response.data : faq)));
        setEditingId(null);
        setError('');
      })
      .catch(error => {
        console.error('Error updating FAQ:', error);
        setError('Error updating FAQ. Please try again later.');
      });
  };

  // 📌 Delete FAQ
  const handleDeleteFAQ = (id) => {
    axios.delete(`/api/faq/${id}`)
      .then(() => {
        setFaqs(faqs.filter(faq => faq._id !== id));
        setError('');
      })
      .catch(error => {
        console.error('Error deleting FAQ:', error);
        setError('Error deleting FAQ. Please try again later.');
      });
  };

  // 📌 Approve & Answer FAQ (Admin Only)
  const handleApproveFAQ = (id) => {
    if (!answer) {
      setError('Answer cannot be empty.');
      return;
    }

    axios.put(`/api/faq/approve/${id}`, { answer })
      .then(response => {
        setFaqs(faqs.map(faq => (faq._id === id ? response.data.faq : faq)));
        setAnswer('');
        setError('');
      })
      .catch(error => {
        console.error('Error approving FAQ:', error);
        setError('Error approving FAQ. Please try again later.');
      });
  };

  return (
    <div className="faq-page">
      <h2>Frequently Asked Questions</h2>

      {/* 📌 Add a New FAQ */}
      <div className="faq-create">
        <input
          type="text"
          placeholder="Ask a question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button onClick={handleCreateFAQ}>Submit</button>
      </div>

      {/* 📌 Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* 📌 Display FAQs */}
      <ul className="faq-list">
        {faqs.map((faq) => (
          <li key={faq._id} className="faq-item">
            {editingId === faq._id ? (
              <input
                type="text"
                value={faq.question}
                onChange={(e) => setFaqs(
                  faqs.map(f => f._id === faq._id ? { ...f, question: e.target.value } : f)
                )}
              />
            ) : (
              <strong>{faq.question}</strong>
            )}

            {faq.answer ? <p>Answer: {faq.answer}</p> : <p>Status: {faq.status}</p>}

            {/* 📌 User Controls */}
            {faq.status === 'pending' && (
              <>
                {editingId === faq._id ? (
                  <button onClick={() => handleEditFAQ(faq._id, faq.question)}>Save</button>
                ) : (
                  <button onClick={() => setEditingId(faq._id)}>Edit</button>
                )}
                <button onClick={() => handleDeleteFAQ(faq._id)}>Delete</button>
              </>
            )}

            {/* 📌 Admin Controls */}
            {isAdmin && faq.status === 'pending' && (
              <div className="faq-approve">
                <input
                  type="text"
                  placeholder="Answer this question..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <button onClick={() => handleApproveFAQ(faq._id)}>Approve & Answer</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQPage;
