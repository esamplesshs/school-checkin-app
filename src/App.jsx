import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Loading from './components/Loading';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // TODO: Fetch user role from Firestore based on currentUser.uid
        setUserRole('student'); // Placeholder - will be updated with DB lookup
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="/" element={<Login />} />
        ) : (
          <>
            {userRole === 'student' && <Route path="/" element={<StudentDashboard onLogout={handleLogout} />} />}
            {userRole === 'teacher' && <Route path="/" element={<TeacherDashboard onLogout={handleLogout} />} />}
            {userRole === 'admin' && <Route path="/" element={<AdminDashboard onLogout={handleLogout} />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
        {!user && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  );
}

export default App;
