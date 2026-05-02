import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'andyderis33@gmail.com') {
          navigate('/admin');
        } else {
          setError('Unauthorized. Please use the correct admin account.');
        }
      }
    });
    return unsub;
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] font-sans selection:bg-zinc-800 selection:text-zinc-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-100 mb-6">Admin Sign In</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button 
          onClick={handleLogin}
          className="bg-zinc-100 text-zinc-900 px-6 py-3 rounded text-sm font-medium hover:bg-zinc-300 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
