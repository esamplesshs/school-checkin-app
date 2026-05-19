import { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function StudentDashboard({ onLogout }) {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const classes = ['Period 1 - Math', 'Period 2 - Science', 'Period 3 - English', 'Period 4 - History'];
  const destinations = ['Bathroom', 'Nurse', 'Office', 'Library', 'Counselor', 'Other'];

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (!selectedClass || !selectedDestination) {
      setError('Please select both class and destination');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await addDoc(collection(db, 'checkRequests'), {
        studentId: auth.currentUser.uid,
        studentName: auth.currentUser.displayName,
        studentEmail: auth.currentUser.email,
        class: selectedClass,
        destination: selectedDestination,
        reason: reason,
        status: 'pending',
        createdAt: serverTimestamp(),
        approvedAt: null,
        approvedBy: null
      });

      setSuccess('Request submitted! Waiting for teacher approval...');
      setSelectedClass('');
      setSelectedDestination('');
      setReason('');
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Check-In</h1>
          <button
            onClick={onLogout}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Request Hall Pass</h2>
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmitRequest}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where are you going?
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select destination</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for leaving class"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
