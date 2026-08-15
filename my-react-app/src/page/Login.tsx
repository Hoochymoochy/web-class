import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BlurText from './../Components/BlurText';
import GoogleSignInButton from './../Components/GoogleSignInButton';
import { useAuth } from '../auth/AuthContext';
import { BACKEND_URL } from '../config';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { saveSession } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('All fields are required');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/oauth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || errorData.message || 'Login failed');
                return;
            }

            const data = await response.json();
            saveSession({
                token: data.token,
                userId: data.id,
                email: data.email,
                name: data.name,
            });
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center flex-col font-serif min-h-screen">
            <BlurText
                text="Sign in to your account"
                delay={200}
                animateBy="words"
                direction="top"
                className="text-2xl mb-8"
            />

            <form onSubmit={handleLogin} className="flex flex-col space-y-4 p-4 w-full max-w-md rounded-sm card-bg">
                <GoogleSignInButton />

                <div className="flex items-center gap-3 text-sm text-black/60">
                    <span className="h-px flex-1 bg-black/10" />
                    or sign in with email
                    <span className="h-px flex-1 bg-black/10" />
                </div>

                <label className="text-xl">Email</label>    
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-black/10 border-2 p-2" 
                />
                
                <label>Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-black/10 border-2 p-2" 
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-black/10 rounded-md p-2 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="flex justify-between items-center">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="flex items-center gap-1 cursor-pointer hover:underline">
                        Sign up
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
