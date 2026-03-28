import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, BookOpen, Swords, BarChart2, Flame, Trophy, Clock } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // Parse user data safely
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : { name: 'Rudra', email: 'rudra@nitrr.ac.in' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const cards = [
        {
            icon: <BookOpen size={22} />,
            color: '#6366f1',
            glow: 'rgba(99,102,241,0.25)',
            title: 'Study Resources',
            desc: 'Access curated materials, notes, and courses tailored to your goals.',
            tag: '240+ resources',
            path: '/resources' 
        },
        {
            icon: <Swords size={22} />,
            color: '#ec4899',
            glow: 'rgba(236,72,153,0.25)',
            title: 'Challenges',
            desc: 'Test yourself with timed quizzes and compete on the leaderboard.',
            tag: 'New today',
            path: '/practice' // LINKS TO YOUR TEST SYSTEM
        },
        {
            icon: <BarChart2 size={22} />,
            color: '#8b5cf6',
            glow: 'rgba(139,92,246,0.25)',
            title: 'Progress',
            desc: 'Track your learning streaks, scores, and improvement over time.',
            tag: '↑ 12% this week',
            path: '/results' // LINKS TO ANALYSIS
        },
    ];

    const stats = [
        { icon: <Flame size={18} />, value: '7 days', label: 'Current streak', color: '#f97316' },
        { icon: <Trophy size={18} />, value: '#142', label: 'Leaderboard rank', color: '#eab308' },
        { icon: <Clock size={18} />, value: '24 hrs', label: 'Study time', color: '#22d3ee' },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .dash-root {
                    min-height: 100vh;
                    background: #05060f;
                    font-family: 'DM Sans', sans-serif;
                    color: #e8e4f0;
                    position: relative;
                    overflow-x: hidden;
                }

                .dash-bg {
                    position: fixed; inset: 0; pointer-events: none; z-index: 0;
                }
                .dash-bg::before {
                    content: '';
                    position: absolute; top: -10%; right: 5%;
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%);
                    animation: bgdrift 18s ease-in-out infinite alternate;
                }
                .dash-bg::after {
                    content: '';
                    position: absolute; bottom: 10%; left: -5%;
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 65%);
                    animation: bgdrift 22s ease-in-out infinite alternate-reverse;
                }
                @keyframes bgdrift {
                    from { transform: translate(0,0); }
                    to   { transform: translate(20px,-20px); }
                }
                .dash-grid {
                    position: fixed; inset: 0; pointer-events: none; z-index: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 40px 40px;
                }

                .dash-nav {
                    position: sticky; top: 0; z-index: 10;
                    background: rgba(5,6,15,0.8);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    padding: 0 32px;
                    height: 64px;
                    display: flex; align-items: center; justify-content: space-between;
                }

                .nav-left { display: flex; align-items: center; gap: 12px; }
                .nav-logo-icon {
                    width: 36px; height: 36px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: white;
                    box-shadow: 0 0 16px rgba(99,102,241,0.35);
                }
                .nav-logo-text {
                    font-family: 'Syne', sans-serif; font-size: 18px;
                    font-weight: 800; letter-spacing: 0.1em; color: #e8e4f0;
                }

                .nav-right { display: flex; align-items: center; gap: 16px; }
                .nav-user {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 14px; color: #e8e4f0; font-weight: 600;
                }
                .nav-user-dot {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: white;
                }
                .logout-btn {
                    display: flex; align-items: center; gap: 6px;
                    padding: 8px 16px;
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 10px;
                    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
                    color: #fca5a5; cursor: pointer;
                    transition: all 0.2s;
                }
                .logout-btn:hover {
                    background: rgba(239,68,68,0.14);
                    border-color: rgba(239,68,68,0.35);
                }

                .dash-content {
                    position: relative; z-index: 1;
                    max-width: 1080px;
                    margin: 0 auto;
                    padding: 56px 24px 80px;
                }

                .welcome-section { margin-bottom: 56px; animation: dFU 0.6s ease both; }
                .welcome-eyebrow {
                    font-size: 13px; font-weight: 500; letter-spacing: 0.08em;
                    text-transform: uppercase; color: #6366f1; margin-bottom: 12px;
                }
                .welcome-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(32px, 4vw, 48px);
                    font-weight: 800; letter-spacing: -1px; line-height: 1.1;
                    color: #f0ecf8; margin-bottom: 14px;
                }
                .welcome-title .grad {
                    background: linear-gradient(135deg, #818cf8, #c084fc);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                }
                .welcome-sub { font-size: 16px; color: #6b6580; max-width: 520px; line-height: 1.6; }

                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                    gap: 16px; margin-bottom: 48px;
                    animation: dFU 0.6s 0.1s ease both;
                }
                .stat-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px; padding: 20px 22px;
                    display: flex; flex-direction: column; gap: 8px;
                }
                .stat-icon-wrap {
                    width: 32px; height: 32px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                }
                .stat-value {
                    font-family: 'Syne', sans-serif; font-size: 22px;
                    font-weight: 700; color: #f0ecf8;
                }
                .stat-lbl { font-size: 13px; color: #6b6580; }

                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    animation: dFU 0.6s 0.2s ease both;
                }
                .feat-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px; padding: 28px;
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .feat-card:hover { transform: translateY(-5px); }

                .card-icon-wrap {
                    width: 48px; height: 48px; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 18px;
                }
                .card-title {
                    font-family: 'Syne', sans-serif; font-size: 17px;
                    font-weight: 700; color: #f0ecf8; margin-bottom: 8px;
                }
                .card-desc { font-size: 14px; color: #6b6580; line-height: 1.6; margin-bottom: 18px; }
                .card-tag {
                    display: inline-flex; align-items: center;
                    font-size: 12px; font-weight: 600;
                    padding: 4px 12px; border-radius: 100px;
                }

                @keyframes dFU {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="dash-root">
                <div className="dash-bg" />
                <div className="dash-grid" />

                <nav className="dash-nav">
                    <div className="nav-left">
                        <div className="nav-logo-icon">V</div>
                        <span className="nav-logo-text">VISION</span>
                    </div>
                    <div className="nav-right">
                        <div className="nav-user">
                            <span className="user-name">{user.name || user.username}</span>
                            <div className="nav-user-dot">
                                {(user.name || user.username || 'U')[0].toUpperCase()}
                            </div>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            <LogOut size={15} />
                            Sign out
                        </button>
                    </div>
                </nav>

                <div className="dash-content">
                    <div className="welcome-section">
                        <div className="welcome-eyebrow">Dashboard</div>
                        <h1 className="welcome-title">
                            Good to see you,<br />
                            <span className="grad">{user.name || user.username || 'Student'}</span> 👋
                        </h1>
                        <p className="welcome-sub">
                            You're on a 7-day streak. Keep it going — your next milestone is just 3 days away.
                        </p>
                    </div>

                    <div className="stats-row">
                        {stats.map(s => (
                            <div className="stat-card" key={s.label}>
                                <div className="stat-icon-wrap" style={{ background: `${s.color}18` }}>
                                    <span style={{ color: s.color }}>{s.icon}</span>
                                </div>
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-lbl">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="section-label" style={{marginBottom: '20px', fontWeight: 700}}>Explore</div>
                    <div className="cards-grid">
                        {cards.map(c => (
                            <div
                                className="feat-card"
                                key={c.title}
                                onClick={() => navigate(c.path)}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = `${c.color}60`;
                                    e.currentTarget.style.boxShadow = `0 12px 40px ${c.glow}`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div className="card-icon-wrap" style={{ background: `${c.color}18` }}>
                                    <span style={{ color: c.color }}>{c.icon}</span>
                                </div>
                                <div className="card-title">{c.title}</div>
                                <div className="card-desc">{c.desc}</div>
                                <span className="card-tag" style={{ background: `${c.color}15`, color: c.color }}>
                                    {c.tag}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;