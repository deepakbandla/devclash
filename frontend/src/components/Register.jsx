import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader, Check, X, ArrowRight, Sparkles } from 'lucide-react';
import authAPI from '../api/authAPI';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const passwordRequirements = {
        length:    formData.password.length >= 6,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number:    /[0-9]/.test(formData.password),
    };
    const isPasswordStrong = Object.values(passwordRequirements).every(Boolean);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.username.trim())          { setError('Username is required'); return false; }
        if (formData.username.length < 3)       { setError('Username must be at least 3 characters'); return false; }
        if (!formData.email.trim())             { setError('Email is required'); return false; }
        if (!formData.email.includes('@'))      { setError('Please enter a valid email'); return false; }
        if (!formData.password)                 { setError('Password is required'); return false; }
        if (!isPasswordStrong)                  { setError('Password does not meet strength requirements'); return false; }
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError('');
        try {
            await authAPI.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            setSuccess('Account created! Redirecting to sign in…');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const req = [
        { key: 'length',    label: 'At least 6 characters' },
        { key: 'uppercase', label: 'One uppercase letter' },
        { key: 'lowercase', label: 'One lowercase letter' },
        { key: 'number',    label: 'One number' },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .vision-reg-root {
                    min-height: 100vh;
                    background: #05060f;
                    display: flex;
                    font-family: 'DM Sans', sans-serif;
                    color: #e8e4f0;
                    overflow-x: hidden;
                    position: relative;
                }

                .vision-reg-bg {
                    position: fixed; inset: 0; pointer-events: none; z-index: 0;
                }
                .vision-reg-bg::before {
                    content: '';
                    position: absolute; top: -20%; left: -10%;
                    width: 600px; height: 600px;
                    background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%);
                    animation: regdrift 16s ease-in-out infinite alternate;
                }
                .vision-reg-bg::after {
                    content: '';
                    position: absolute; bottom: -20%; right: -10%;
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(244,114,182,0.14) 0%, transparent 65%);
                    animation: regdrift 20s ease-in-out infinite alternate-reverse;
                }
                @keyframes regdrift {
                    from { transform: translate(0,0) scale(1); }
                    to   { transform: translate(20px,-20px) scale(1.05); }
                }
                .reg-grid {
                    position: fixed; inset: 0; pointer-events: none; z-index: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 40px 40px;
                }

                /* ── Layout ── */
                .reg-split {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    position: relative;
                    z-index: 1;
                }
                @media(min-width: 1024px) { .reg-split { flex-direction: row; } }

                .reg-left {
                    display: none;
                    flex-direction: column;
                    justify-content: center;
                    padding: 80px 64px;
                }
                @media(min-width: 1024px) { .reg-left { display: flex; flex: 1; } }

                .reg-badge {
                    display: inline-flex;
                    align-items: center; gap: 8px;
                    background: rgba(139,92,246,0.15);
                    border: 1px solid rgba(139,92,246,0.3);
                    color: #c4b5fd;
                    font-size: 12px; font-weight: 500;
                    letter-spacing: 0.08em; text-transform: uppercase;
                    padding: 6px 14px; border-radius: 100px;
                    width: fit-content; margin-bottom: 32px;
                    animation: fU 0.8s ease both;
                }
                .reg-headline {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(38px, 3.8vw, 56px);
                    font-weight: 800; line-height: 1.05;
                    letter-spacing: -1.5px; margin-bottom: 24px;
                    animation: fU 0.8s 0.1s ease both;
                }
                .reg-headline .accent {
                    background: linear-gradient(135deg, #8b5cf6, #c084fc, #f472b6);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                }
                .reg-sub {
                    font-size: 17px; color: #9089a8; line-height: 1.65;
                    max-width: 400px; margin-bottom: 48px;
                    animation: fU 0.8s 0.2s ease both;
                }
                .feature-list { display: flex; flex-direction: column; gap: 16px; animation: fU 0.8s 0.3s ease both; }
                .feature-item {
                    display: flex; align-items: center; gap: 14px;
                    font-size: 15px; color: #9089a8;
                }
                .feature-dot {
                    width: 8px; height: 8px; border-radius: 50%;
                    background: linear-gradient(135deg, #8b5cf6, #c084fc);
                    flex-shrink: 0;
                }

                /* ── Form side ── */
                .reg-right {
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 48px 24px;
                    overflow-y: auto;
                }
                @media(min-width: 1024px) {
                    .reg-right {
                        width: 520px;
                        padding: 60px 56px;
                        border-left: 1px solid rgba(255,255,255,0.06);
                        min-height: 100vh;
                        align-items: center;
                    }
                }

                .reg-card { width: 100%; max-width: 400px; animation: fU 0.6s ease both; }

                .logo-mark {
                    display: flex; align-items: center; gap: 12px; margin-bottom: 40px;
                }
                .logo-icon {
                    width: 44px; height: 44px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: white;
                    box-shadow: 0 0 24px rgba(99,102,241,0.4);
                }
                .logo-text {
                    font-family: 'Syne', sans-serif; font-size: 22px;
                    font-weight: 800; letter-spacing: 0.12em; color: #e8e4f0;
                }

                .reg-title {
                    font-family: 'Syne', sans-serif; font-size: 26px;
                    font-weight: 700; letter-spacing: -0.5px; color: #f0ecf8; margin-bottom: 6px;
                }
                .reg-subtitle { font-size: 15px; color: #6b6580; margin-bottom: 32px; }

                .alert {
                    padding: 12px 16px; border-radius: 10px; font-size: 14px;
                    margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
                }
                .alert-error  { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.25);  color: #fca5a5; }
                .alert-success{ background: rgba(34,197,94,0.1);   border: 1px solid rgba(34,197,94,0.25);   color: #86efac; }

                .field { margin-bottom: 18px; }
                .field-label {
                    display: block; font-size: 13px; font-weight: 500;
                    color: #9089a8; margin-bottom: 7px; letter-spacing: 0.03em;
                }
                .input-wrap { position: relative; }
                .vision-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px; padding: 13px 18px;
                    font-family: 'DM Sans', sans-serif; font-size: 15px;
                    color: #e8e4f0; outline: none;
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
                    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
                    background: none; border: none; cursor: pointer;
                    color: #6b6580; display: flex; align-items: center; transition: color 0.2s;
                }
                .eye-btn:hover { color: #a5b4fc; }

                /* Password strength */
                .pw-reqs {
                    margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
                }
                .pw-req {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12px; transition: color 0.2s;
                }
                .pw-req.met   { color: #4ade80; }
                .pw-req.unmet { color: #6b6580; }

                /* Terms */
                .terms-row {
                    display: flex; align-items: flex-start; gap: 10px;
                    margin-bottom: 24px; cursor: pointer;
                }
                .terms-row input[type=checkbox] {
                    width: 16px; height: 16px; margin-top: 2px;
                    accent-color: #6366f1; cursor: pointer; flex-shrink: 0;
                }
                .terms-text { font-size: 13px; color: #6b6580; line-height: 1.5; }
                .terms-text a { color: #818cf8; text-decoration: none; }
                .terms-text a:hover { color: #c4b5fd; text-decoration: underline; }

                /* Submit */
                .submit-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border: none; border-radius: 12px; padding: 15px;
                    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600;
                    letter-spacing: 0.03em; color: white; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
                    box-shadow: 0 4px 24px rgba(99,102,241,0.35);
                    margin-bottom: 24px;
                }
                .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(99,102,241,0.5); }
                .submit-btn:active:not(:disabled) { transform: translateY(0); }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .spin { animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .or-divider {
                    display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
                }
                .or-divider::before, .or-divider::after {
                    content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.07);
                }
                .or-text { font-size: 13px; color: #4a4460; white-space: nowrap; }

                .signin-btn {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    width: 100%; padding: 14px;
                    background: transparent; border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
                    color: #9089a8; text-decoration: none;
                    transition: border-color 0.2s, color 0.2s, background 0.2s;
                }
                .signin-btn:hover {
                    border-color: rgba(99,102,241,0.4); color: #c4b5fd;
                    background: rgba(99,102,241,0.06);
                }
                .signin-btn span { font-weight: 600; color: #818cf8; }

                @keyframes fU {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="vision-reg-root">
                <div className="vision-reg-bg" />
                <div className="reg-grid" />

                <div className="reg-split">
                    {/* Left */}
                    <div className="reg-left">
                        <div className="reg-badge"><Sparkles size={12} /> Join 24k+ students</div>
                        <h1 className="reg-headline">
                            Your future starts<br />
                            with a single<br />
                            <span className="accent">decision.</span>
                        </h1>
                        <p className="reg-sub">
                            Sign up for VISION and access everything you need to excel — resources, community, and career tools all in one place.
                        </p>
                        <div className="feature-list">
                            {['Personalized learning paths', 'Study groups & peer support', 'Career mentorship network', 'Real-time progress tracking'].map(f => (
                                <div className="feature-item" key={f}>
                                    <div className="feature-dot" />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="reg-right">
                        <div className="reg-card">
                            <div className="logo-mark">
                                <div className="logo-icon">V</div>
                                <span className="logo-text">VISION</span>
                            </div>

                            <h2 className="reg-title">Create your account</h2>
                            <p className="reg-subtitle">Start your journey today — it's free</p>

                            {success && <div className="alert alert-success">✓ {success}</div>}
                            {error   && <div className="alert alert-error">✕ {error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="field-label" htmlFor="username">Username</label>
                                    <input id="username" className="vision-input" type="text" name="username"
                                        value={formData.username} onChange={handleChange}
                                        placeholder="your_handle" disabled={loading} autoComplete="username" />
                                </div>

                                <div className="field">
                                    <label className="field-label" htmlFor="email">Email address</label>
                                    <input id="email" className="vision-input" type="email" name="email"
                                        value={formData.email} onChange={handleChange}
                                        placeholder="you@university.edu" disabled={loading} autoComplete="email" />
                                </div>

                                <div className="field">
                                    <label className="field-label" htmlFor="password">Password</label>
                                    <div className="input-wrap">
                                        <input id="password" className="vision-input has-icon"
                                            type={showPassword ? 'text' : 'password'} name="password"
                                            value={formData.password} onChange={handleChange}
                                            placeholder="••••••••" disabled={loading} autoComplete="new-password" />
                                        <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <div className="pw-reqs">
                                            {req.map(r => (
                                                <div key={r.key} className={`pw-req ${passwordRequirements[r.key] ? 'met' : 'unmet'}`}>
                                                    {passwordRequirements[r.key]
                                                        ? <Check size={12} />
                                                        : <X size={12} />}
                                                    {r.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="field">
                                    <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
                                    <div className="input-wrap">
                                        <input id="confirmPassword" className="vision-input has-icon"
                                            type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                                            value={formData.confirmPassword} onChange={handleChange}
                                            placeholder="••••••••" disabled={loading} autoComplete="new-password" />
                                        <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(p => !p)} tabIndex={-1}>
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <label className="terms-row">
                                    <input type="checkbox" required disabled={loading} />
                                    <span className="terms-text">
                                        I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                                    </span>
                                </label>

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading
                                        ? <><Loader size={18} className="spin" /> Creating account…</>
                                        : <>Create Account <ArrowRight size={16} /></>
                                    }
                                </button>
                            </form>

                            <div className="or-divider"><span className="or-text">Already have an account?</span></div>
                            <Link to="/login" className="signin-btn">Sign In <span>→</span></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
