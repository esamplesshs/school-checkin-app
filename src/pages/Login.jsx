import { useState } from 'react';
import { signInWithPopup, OAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new OAuthProvider('microsoft.com');
      provider.addScopes('email', 'profile');
      provider.setCustomParameters({
        tenant: 'common',
        prompt: 'select_account'
      });
      
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          School Check-In
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Track student movement on campus
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleMicrosoftLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 23 23" fill="currentColor">
                <path d="M11.4 5.5h5.8v5.8h-5.8V5.5zm6.3 6.3h5.8v5.8h-5.8v-5.8zM0 5.5h5.8v5.8H0V5.5zm6.3 6.3h5.8v5.8H6.3v-5.8z"/>
              </svg>
              Sign in with Microsoft
            </>
          )}
        </button>
        
        <p className="text-gray-500 text-xs text-center mt-6">
          Use your school Microsoft account to sign in
        </p>
      </div>
    </div>
  );
}

export default Login;
