import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'andyderis33@gmail.com') { // Assuming exact admin checks
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#09090b] text-zinc-300 flex items-center justify-center font-mono">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
