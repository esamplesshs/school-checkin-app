import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

function TeacherDashboard({ onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Get current user's class list
    // For now, show all pending requests
    const q = query(collection(db, 'checkRequests'), where('status', '==', 'pending'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => (({
        id: doc.id,
        ...doc.data()
      })));
      setRequests(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await updateDoc(doc(db, 'checkRequests', requestId), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const handleDeny = async (requestId) => {
    try {
      await updateDoc(doc(db, 'checkRequests', requestId), {
        status: 'denied',
        approvedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error denying request:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <button
            onClick={onLogout}
            className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-6">Pending Requests</h2>
        
        {loading ? (
          <div className="text-center text-gray-600">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
            No pending requests
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Student</p>
                    <p className="font-semibold">{req.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Class</p>
                    <p className="font-semibold">{req.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-semibold">{req.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold">
                      {req.createdAt?.toDate?.().toLocaleTimeString() || 'N/A'}
                    </p>
                  </div>
                </div>
                
                {req.reason && (
                  <div className="mb-4 bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Reason: {req.reason}</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeny(req.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default TeacherDashboard;
