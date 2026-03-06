import { useState } from 'react';
import BlurText from "./../Components/BlurText";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername ]= useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !username) {
            setError('All fields are required');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/oauth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    name: username,
                    password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed');
                return;
            }

            const data = await response.json();
            console.log(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.id.id);
            window.location.href = '/';
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
                text="Sign up for an account"
                delay={200}
                animateBy="words"
                direction="top"
                className="text-2xl mb-8"
            />

            <form onSubmit={handleRegister} className="flex flex-col space-y-4 p-4 w-full max-w-md card-bg rounded-sm">
                <label className="text-xl">Email</label>    
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-black/10 border-2 p-2" 
                />
                
                <label>Username</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    {loading ? 'Signing up...' : 'Sign up'}
                </button>

                <div className="flex justify-between items-center">
                    <p>Have an account?</p>
                    <a href="/login" className="flex items-center gap-1 cursor-pointer hover:underline">
                        Login in
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </a>
                </div>
            </form>
        </div>
    );
}

export default Register;