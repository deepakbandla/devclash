import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader, ArrowRight, Sparkles } from 'lucide-react';
import authAPI from '../api/authAPI';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.email.trim()) { setError('Email is required'); return false; }
        if (!formData.email.includes('@')) { setError('Please enter a valid email'); return false; }
        if (!formData.password) { setError('Password is required'); return false; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError('');
        try {
            const response = await authAPI.login(formData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setSuccess('Welcome back! Redirecting…');
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .vision-root {
                    min-height: 100vh;
                    background: #05060f;
                    display: flex;
                    font-family: 'DM Sans', sans-serif;
                    color: #e8e4f0;
                    overflow: hidden;
                    position: relative;
                }

                /* ── Atmospheric background ── */
                .vision-bg {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }
                .vision-bg::before {
                    content: '';
                    position: absolute;
                    top: -30%;
                    right: -10%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%);
                    animation: drift 14s ease-in-out infinite alternate;
                }
                .vision-bg::after {
                    content: '';
                    position: absolute;
                    bottom: -20%;
                    left: -15%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 65%);
                    animation: drift 18s ease-in-out infinite alternate-reverse;
                }
                @keyframes drift {
                    from { transform: translate(0, 0) scale(1); }
                    to   { transform: translate(30px, -30px) scale(1.06); }
                }

                /* grid overlay */
                .grid-overlay {
                    position: fixed;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                    z-index: 0;
                }

                /* ── Left panel ── */
                .left-panel {
                    display: none;
                    flex: 1;
                    flex-direction: column;
                    justify-content: center;
                    padding: 80px 64px;
                    position: relative;
                    z-index: 1;
                }
                @media(min-width: 1024px) { .left-panel { display: flex; } }

                .left-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(99,102,241,0.15);
                    border: 1px solid rgba(99,102,241,0.3);
                    color: #a5b4fc;
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    padding: 6px 14px;
                    border-radius: 100px;
                    width: fit-content;
                    margin-bottom: 32px;
                    animation: fadeUp 0.8s ease both;
                }

                .left-headline {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(42px, 4vw, 60px);
                    font-weight: 800;
                    line-height: 1.05;
                    letter-spacing: -1.5px;
                    margin-bottom: 24px;
                    animation: fadeUp 0.8s 0.1s ease both;
                }
                .left-headline .accent {
                    background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .left-sub {
                    font-size: 17px;
                    color: #9089a8;
                    line-height: 1.65;
                    max-width: 420px;
                    margin-bottom: 56px;
                    animation: fadeUp 0.8s 0.2s ease both;
                }

                .stat-row {
                    display: flex;
                    gap: 40px;
                    animation: fadeUp 0.8s 0.3s ease both;
                }
                .stat-item { display: flex; flex-direction: column; gap: 4px; }
                .stat-number {
                    font-family: 'Syne', sans-serif;
                    font-size: 28px;
                    font-weight: 700;
                    color: #e8e4f0;
                }
                .stat-label { font-size: 13px; color: #6b6580; }

                .divider-v {
                    width: 1px;
                    background: rgba(255,255,255,0.07);
                    align-self: stretch;
                }

                /* ── Right panel (form) ── */
                .right-panel {
                    display: flex;
                    flex: 0 0 auto;
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    position: relative;
                    z-index: 1;
                }
                @media(min-width: 1024px) {
                    .right-panel {
                        width: 520px;
                        padding: 60px 56px;
                        border-left: 1px solid rgba(255,255,255,0.06);
                        min-height: 100vh;
                    }
                }

                .form-card {
                    width: 100%;
                    max-width: 400px;
                    animation: fadeUp 0.6s ease both;
                }

                /* Logo mark */
                .logo-mark {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 48px;
                }
                .logo-icon {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Syne', sans-serif;
                    font-size: 20px;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 0 24px rgba(99,102,241,0.4);
                }
                .logo-text {
                    font-family: 'Syne', sans-serif;
                    font-size: 22px;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    color: #e8e4f0;
                }

                .form-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 28px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    color: #f0ecf8;
                    margin-bottom: 8px;
                }
                .form-subtitle {
                    font-size: 15px;
                    color: #6b6580;
                    margin-bottom: 40px;
                }

                /* Alerts */
                .alert {
                    padding: 12px 16px;
                    border-radius: 10px;
                    font-size: 14px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .alert-error {
                    background: rgba(239,68,68,0.1);
                    border: 1px solid rgba(239,68,68,0.25);
                    color: #fca5a5;
                }
                .alert-success {
                    background: rgba(34,197,94,0.1);
                    border: 1px solid rgba(34,197,94,0.25);
                    color: #86efac;
                }

                /* Fields */
                .field { margin-bottom: 20px; }
                .field-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 500;
                    color: #9089a8;
                    margin-bottom: 8px;
                    letter-spacing: 0.03em;
                }
                .input-wrap { position: relative; }
                .vision-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    padding: 14px 18px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    color: #e8e4f0;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    -webkit-appearance: none;
                }
                .vision-input::placeholder { color: #4a4460; }
                .vision-input:focus {
                    border-color: rgba(99,102,241,0.5);
                    background: rgba(255,255,255,0.06);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }
                .vision-input:disabled { opacity: 0.5; cursor: not-allowed; }
                .vision-input.has-icon { padding-right: 48px; }

                .eye-btn {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6b6580;
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                }
                .eye-btn:hover { color: #a5b4fc; }

                /* Extras row */
                .extras-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 28px;
                    margin-top: -4px;
                }
                .remember-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #6b6580;
                    user-select: none;
                }
                .remember-label input[type=checkbox] {
                    width: 16px;
                    height: 16px;
                    accent-color: #6366f1;
                    cursor: pointer;
                }
                .forgot-link {
                    font-size: 14px;
                    color: #818cf8;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .forgot-link:hover { color: #c4b5fd; }

                /* Submit */
                .submit-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border: none;
                    border-radius: 12px;
                    padding: 15px;
                    font-family: 'Syne', sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    letter-spacing: 0.03em;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
                    box-shadow: 0 4px 24px rgba(99,102,241,0.35);
                    margin-bottom: 28px;
                }
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 32px rgba(99,102,241,0.5);
                }
                .submit-btn:active:not(:disabled) { transform: translateY(0); }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .spin { animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Divider */
                .or-divider {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .or-divider::before, .or-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                }
                .or-text { font-size: 13px; color: #4a4460; white-space: nowrap; }

                /* Sign up link */
                .signup-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 14px;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 500;
                    color: #9089a8;
                    text-decoration: none;
                    transition: border-color 0.2s, color 0.2s, background 0.2s;
                }
                .signup-btn:hover {
                    border-color: rgba(99,102,241,0.4);
                    color: #c4b5fd;
                    background: rgba(99,102,241,0.06);
                }
                .signup-btn span { font-weight: 600; color: #818cf8; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="vision-root">
                <div className="vision-bg" />
                <div className="grid-overlay" />

                {/* Left panel */}
                <div className="left-panel">
                    <div className="left-badge">
                        <Sparkles size={12} />
                        For ambitious students
                    </div>
                    <h1 className="left-headline">
                        Build your<br />
                        <span className="accent">academic vision</span><br />
                        one step at a time.
                    </h1>
                    <p className="left-sub">
                        VISION connects students with tools, resources, and a community that accelerates learning and career growth.
                    </p>
                    <div className="stat-row">
                        <div className="stat-item">
                            <span className="stat-number">24k+</span>
                            <span className="stat-label">Active students</span>
                        </div>
                        <div className="divider-v" />
                        <div className="stat-item">
                            <span className="stat-number">180+</span>
                            <span className="stat-label">Universities</span>
                        </div>
                        <div className="divider-v" />
                        <div className="stat-item">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">Satisfaction</span>
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="right-panel">
                    <div className="form-card">
                        <div className="logo-mark">
                            <div className="logo-icon">V</div>
                            <span className="logo-text">VISION</span>
                        </div>

                        <h2 className="form-title">Welcome back</h2>
                        <p className="form-subtitle">Sign in to continue your journey</p>

                        {success && <div className="alert alert-success">✓ {success}</div>}
                        {error   && <div className="alert alert-error">✕ {error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label className="field-label" htmlFor="email">Email address</label>
                                <input
                                    id="email"
                                    className="vision-input"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@university.edu"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>

                            <div className="field">
                                <label className="field-label" htmlFor="password">Password</label>
                                <div className="input-wrap">
                                    <input
                                        id="password"
                                        className="vision-input has-icon"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowPassword(p => !p)}
                                        tabIndex={-1}
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="extras-row">
                                <label className="remember-label">
                                    <input type="checkbox" disabled={loading} />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading
                                    ? <><Loader size={18} className="spin" /> Signing in…</>
                                    : <>Sign In <ArrowRight size={16} /></>
                                }
                            </button>
                        </form>

                        <div className="or-divider"><span className="or-text">Don't have an account?</span></div>

                        <Link to="/register" className="signup-btn">
                            Create your account <span>→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
