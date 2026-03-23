import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Target, Zap, AlertTriangle, CheckCircle, ArrowLeft, TrendingUp } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, questions } = location.state || { results: [], questions: [] };

  const correctCount = results.filter(r => r.isCorrect).length;
  const accuracy = results.length ? Math.round((correctCount / results.length) * 100) : 0;
  const avgTime = results.length
    ? results.reduce((acc, r) => acc + r.timeTaken, 0) / results.length
    : 0;
  const benchmark = 60;
  const speedStatus = avgTime < benchmark ? "Faster than AI" : "Needs Speed Work";
  const weakAreas = [...new Set(
    results.filter(r => !r.isCorrect).map(r => {
      const q = questions.find(q => q._id === r.questionId);
      return q ? q.subTopic || "General Concept" : "General Concept";
    })
  )];

  const accuracyColor = accuracy >= 80 ? '#4ade80' : accuracy >= 50 ? '#facc15' : '#f87171';
  const accuracyGlow  = accuracy >= 80 ? 'rgba(74,222,128,0.25)' : accuracy >= 50 ? 'rgba(250,204,21,0.25)' : 'rgba(248,113,113,0.25)';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .res-root {
          min-height: 100vh;
          background: #05060f;
          font-family: 'DM Sans', sans-serif;
          color: #e8e4f0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 24px 80px;
          position: relative;
          overflow-x: hidden;
        }

        .res-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
        }
        .res-bg::before {
          content: '';
          position: absolute; top: -20%; right: 0%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 65%);
          animation: resbg 18s ease-in-out infinite alternate;
        }
        .res-bg::after {
          content: '';
          position: absolute; bottom: -15%; left: -5%;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 65%);
          animation: resbg 22s ease-in-out infinite alternate-reverse;
        }
        @keyframes resbg {
          from { transform: translate(0,0); }
          to   { transform: translate(20px,-20px); }
        }
        .res-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* ── Wrapper ── */
        .res-wrap {
          position: relative; z-index: 1;
          width: 100%; max-width: 720px;
          animation: rFU 0.6s ease both;
        }

        /* ── Header ── */
        .res-header {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 40px;
        }
        .res-logo-icon {
          width: 42px; height: 42px; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: white;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
          flex-shrink: 0;
        }
        .res-header-text { flex: 1; }
        .res-eyebrow {
          font-size: 12px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: #6366f1; margin-bottom: 4px;
        }
        .res-title {
          font-family: 'Syne', sans-serif; font-size: 26px;
          font-weight: 800; letter-spacing: -0.5px; color: #f0ecf8;
        }

        /* ── Stat cards ── */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px; margin-bottom: 28px;
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 26px 24px;
          display: flex; flex-direction: column; gap: 10px;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          animation: rFU 0.6s ease both;
        }
        .stat-card:nth-child(2) { animation-delay: 0.08s; }
        .stat-card:nth-child(3) { animation-delay: 0.16s; }
        .stat-card:hover { transform: translateY(-3px); }

        .stat-icon-row {
          display: flex; align-items: center; justify-content: space-between;
        }
        .stat-icon-wrap {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-sub {
          font-size: 12px; font-weight: 500; letter-spacing: 0.04em;
          text-transform: uppercase; color: #6b6580;
        }
        .stat-value {
          font-family: 'Syne', sans-serif; font-size: 38px;
          font-weight: 800; line-height: 1; letter-spacing: -1px;
        }
        .stat-note { font-size: 13px; color: #6b6580; }

        /* ── Divider card ── */
        .section-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 28px;
          margin-bottom: 20px;
          animation: rFU 0.6s 0.24s ease both;
        }
        .section-title {
          font-family: 'Syne', sans-serif; font-size: 16px;
          font-weight: 700; color: #e8e4f0; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }

        /* Weak areas */
        .weak-alert {
          display: flex; gap: 14px; align-items: flex-start;
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 14px; padding: 18px;
          margin-bottom: 12px;
        }
        .weak-alert-icon { flex-shrink: 0; margin-top: 2px; color: #f87171; }
        .weak-alert-label {
          font-size: 13px; font-weight: 600; color: #fca5a5; margin-bottom: 6px;
        }
        .weak-alert-text { font-size: 14px; color: #9089a8; line-height: 1.6; }
        .weak-alert-text strong { color: #fca5a5; font-weight: 600; }

        .success-alert {
          display: flex; gap: 14px; align-items: flex-start;
          background: rgba(74,222,128,0.07);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 14px; padding: 18px;
        }
        .success-alert-icon { flex-shrink: 0; margin-top: 2px; color: #4ade80; }
        .success-alert-label {
          font-size: 13px; font-weight: 600; color: #86efac; margin-bottom: 6px;
        }
        .success-alert-text { font-size: 14px; color: #9089a8; line-height: 1.6; }

        /* Tags */
        .tags-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .tag {
          font-size: 13px; font-weight: 500; padding: 5px 12px; border-radius: 100px;
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.25);
          color: #fca5a5;
        }

        /* ── Back button ── */
        .back-btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; border-radius: 14px;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600;
          letter-spacing: 0.03em; color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 24px rgba(99,102,241,0.35);
          animation: rFU 0.6s 0.32s ease both;
        }
        .back-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.5);
        }
        .back-btn:active { transform: translateY(0); }

        @keyframes rFU {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="res-root">
        <div className="res-bg" />
        <div className="res-grid" />

        <div className="res-wrap">
          {/* Header */}
          <div className="res-header">
            <div className="res-logo-icon">V</div>
            <div className="res-header-text">
              <div className="res-eyebrow">Session complete</div>
              <h1 className="res-title">Test Analysis</h1>
            </div>
          </div>

          {/* Stat cards */}
          <div className="stat-grid">
            {/* Accuracy */}
            <div
              className="stat-card"
              style={{ borderColor: `${accuracyColor}30` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${accuracyGlow}`; e.currentTarget.style.borderColor = `${accuracyColor}50`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${accuracyColor}30`; }}
            >
              <div className="stat-icon-row">
                <div className="stat-icon-wrap" style={{ background: `${accuracyColor}18` }}>
                  <Target size={18} color={accuracyColor} />
                </div>
                <span className="stat-sub">Accuracy</span>
              </div>
              <div className="stat-value" style={{ color: accuracyColor }}>{accuracy}%</div>
              <div className="stat-note">{correctCount} of {results.length} correct</div>
            </div>

            {/* Speed */}
            <div
              className="stat-card"
              style={{ borderColor: 'rgba(34,211,238,0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,211,238,0.18)'; e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)'; }}
            >
              <div className="stat-icon-row">
                <div className="stat-icon-wrap" style={{ background: 'rgba(34,211,238,0.12)' }}>
                  <Zap size={18} color="#22d3ee" />
                </div>
                <span className="stat-sub">Avg. Speed</span>
              </div>
              <div className="stat-value" style={{ color: '#22d3ee' }}>{Math.round(avgTime)}s</div>
              <div className="stat-note">{speedStatus}</div>
            </div>

            {/* Weak areas */}
            <div
              className="stat-card"
              style={{ borderColor: 'rgba(251,191,36,0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(251,191,36,0.15)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.2)'; }}
            >
              <div className="stat-icon-row">
                <div className="stat-icon-wrap" style={{ background: 'rgba(251,191,36,0.12)' }}>
                  <TrendingUp size={18} color="#fbbf24" />
                </div>
                <span className="stat-sub">Weak Areas</span>
              </div>
              <div className="stat-value" style={{ color: '#fbbf24', fontSize: weakAreas.length === 0 ? '38px' : '28px' }}>
                {weakAreas.length > 0 ? weakAreas.length : '0'}
              </div>
              <div className="stat-note">{weakAreas.length === 0 ? 'None detected!' : 'topic(s) to review'}</div>
            </div>
          </div>

          {/* Deep dive */}
          <div className="section-card">
            <div className="section-title">
              <AlertTriangle size={16} color="#fbbf24" />
              Topic Deep Dive
            </div>

            {weakAreas.length > 0 ? (
              <>
                <div className="weak-alert">
                  <AlertTriangle size={18} className="weak-alert-icon" />
                  <div>
                    <div className="weak-alert-label">Areas to improve</div>
                    <div className="weak-alert-text">
                      You struggled with <strong>{weakAreas.join(", ")}</strong>. The AI will prioritize these topics in your next session.
                    </div>
                  </div>
                </div>
                <div className="tags-row">
                  {weakAreas.map(area => (
                    <span className="tag" key={area}>{area}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="success-alert">
                <CheckCircle size={18} className="success-alert-icon" />
                <div>
                  <div className="success-alert-label">Mastery Detected!</div>
                  <div className="success-alert-text">
                    Excellent work — no weak areas found. You're ready to advance to the next difficulty level.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Back */}
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default Results;