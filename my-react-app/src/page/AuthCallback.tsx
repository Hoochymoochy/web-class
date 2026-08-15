import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const callbackError = searchParams.get('error');
    if (callbackError) {
      setError(callbackError);
      return;
    }

    const token = searchParams.get('token');
    const userId = searchParams.get('userId') ?? searchParams.get('id');
    const email = searchParams.get('email') ?? '';
    const name = searchParams.get('name') ?? '';

    if (!token || !userId) {
      setError('Missing authentication details from Google sign-in.');
      return;
    }

    saveSession({
      token,
      userId,
      email,
      name,
    });

    navigate('/', { replace: true });
  }, [navigate, saveSession, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-serif">
      {error ? (
        <>
          <p className="mb-4 text-red-500">{error}</p>
          <a href="/login" className="underline">
            Back to login
          </a>
        </>
      ) : (
        <p>Completing Google sign-in...</p>
      )}
    </div>
  );
}

export default AuthCallback;
