import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader, Check, X } from 'lucide-react';
import authAPI from '../api/authAPI';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const passwordRequirements = {
        length: formData.password.length >= 6,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
    };

    const isPasswordStrong = Object.values(passwordRequirements).every(req => req);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!isPasswordStrong) {
            setError('Password does not meet strength requirements');
            return false;
        }
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
            
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            {/* Register Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg mb-4">
                            <span className="text-2xl font-bold text-white">D</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Join DevClash</h1>
                        <p className="text-purple-200 text-sm mt-2">Start your competitive coding journey</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm">
                                ✓ {success}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                                ✕ {error}
                            </div>
                        )}

                        {/* Username Input */}
                        <div>
                            <label className="block text-white font-medium mb-2 text-sm">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                disabled={loading}
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-white font-medium mb-2 text-sm">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                disabled={loading}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-white font-medium mb-2 text-sm">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition pr-12"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-200 transition"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Password strength indicator */}
                            <div className="mt-2 space-y-1 text-xs">
                                <div className="flex items-center gap-2">
                                    {passwordRequirements.length ? (
                                        <Check size={14} className="text-green-400" />
                                    ) : (
                                        <X size={14} className="text-red-400" />
                                    )}
                                    <span className={passwordRequirements.length ? 'text-green-300' : 'text-red-300'}>
                                        At least 6 characters
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {passwordRequirements.uppercase ? (
                                        <Check size={14} className="text-green-400" />
                                    ) : (
                                        <X size={14} className="text-red-400" />
                                    )}
                                    <span className={passwordRequirements.uppercase ? 'text-green-300' : 'text-red-300'}>
                                        One uppercase letter
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {passwordRequirements.lowercase ? (
                                        <Check size={14} className="text-green-400" />
                                    ) : (
                                        <X size={14} className="text-red-400" />
                                    )}
                                    <span className={passwordRequirements.lowercase ? 'text-green-300' : 'text-red-300'}>
                                        One lowercase letter
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {passwordRequirements.number ? (
                                        <Check size={14} className="text-green-400" />
                                    ) : (
                                        <X size={14} className="text-red-400" />
                                    )}
                                    <span className={passwordRequirements.number ? 'text-green-300' : 'text-red-300'}>
                                        One number
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-white font-medium mb-2 text-sm">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition pr-12"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-200 transition"
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <label className="flex items-center text-purple-200 hover:text-white cursor-pointer transition text-sm">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-purple-300 text-purple-400 bg-white/10 accent-purple-400"
                                disabled={loading}
                                required
                            />
                            <span className="ml-2">
                                I agree to the{' '}
                                <a href="#" className="text-purple-300 hover:text-purple-200 underline">
                                    Terms of Service
                                </a>
                            </span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white/5 text-purple-300">Already have an account?</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <Link
                        to="/login"
                        className="block w-full text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-4 rounded-lg border border-white/30 transition"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
