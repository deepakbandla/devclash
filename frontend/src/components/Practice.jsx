import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Added
import { Brain, ChevronRight, Layers } from 'lucide-react';

const Practice = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [allAttempts, setAllAttempts] = useState([]); // Track all answers

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5001/api/practice/generate-test',
          { topic: "Data Structures", difficulty: "Medium", numQuestions: 3 },
          { headers: { 'x-auth-token': token } }
        );
        setQuestions(res.data);
        setStartTime(Date.now());
        setLoading(false);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = async (selectedOption) => {
    if (submitting || selected) return;
    
    setSelected(selectedOption);
    setSubmitting(true);

    const timeTaken = (Date.now() - startTime) / 1000;
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // Save this specific result to our local tracking state
    const currentResult = { 
      questionId: currentQuestion._id, 
      isCorrect, 
      timeTaken 
    };
    
    const updatedAttempts = [...allAttempts, currentResult];
    setAllAttempts(updatedAttempts);

    try {
      const token = localStorage.getItem('token');
      // Sync with backend for long-term adaptive learning
      await axios.post('http://localhost:5001/api/practice/submit-test', {
        results: [currentResult]
      }, { headers: { 'x-auth-token': token } });

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setStartTime(Date.now());
          setSelected(null);
          setSubmitting(false);
        } else {
          // Finish Test: Pass all collected data to Results page
          navigate('/results', { 
            state: { 
              results: updatedAttempts, 
              questions: questions 
            } 
          });
        }
      }, 700);
    } catch (err) {
      console.error("Submission failed", err);
      setSubmitting(false);
    }
  };

  // ... (Keep the rest of your beautiful CSS/JSX here)
  if (loading) return (
    <div className="prac-root">
       <div className="loading-wrap">
          <div className="loading-icon"><Brain size={28} color="white" /></div>
          <div className="loading-title">Generating your test</div>
          <div className="loading-dots"><span /><span /><span /></div>
       </div>
    </div>
  );

  return (
    <>
      {/* (Your existing <style> block here) */}
      <div className="prac-root">
        <div className="prac-bg" />
        <div className="prac-grid" />
        <div className="prac-card">
            <div className="prac-topbar">
              <div className="prac-logo">
                <div className="prac-logo-icon">V</div>
                <span className="prac-logo-text">VISION</span>
              </div>
              <div className="prac-meta">
                <span className="prac-badge badge-topic">
                  <Layers size={11} />
                  {questions[currentIndex].topic}
                </span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">Question progress</span>
                <span className="progress-count">{currentIndex + 1} / {questions.length}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="question-text">{questions[currentIndex].questionText}</div>

            <div className="options-list">
              {questions[currentIndex].options.map((opt, i) => {
                const letters = ['A', 'B', 'C', 'D'];
                const isSelected = selected === opt;
                return (
                  <button
                    key={i}
                    className={`option-btn${isSelected ? ' selected' : ''}`}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selected || submitting}
                  >
                    <span className="opt-letter">{letters[i]}</span>
                    <span className="opt-text">{opt}</span>
                    <ChevronRight size={16} className="option-arrow" />
                  </button>
                );
              })}
            </div>
          </div>
      </div>
    </>
  );
};

export default Practice;