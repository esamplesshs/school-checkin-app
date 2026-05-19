import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';

function AdminDashboard({ onLogout }) {
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to all requests for real-time updates
    const q = query(collection(db, 'checkRequests'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => (({
        id: doc.id,
        ...doc.data()
      })));
      setAllRequests(data);
      setFilteredRequests(data);
      
      // Extract unique students
      const uniqueStudents = [...new Set(data.map(req => req.studentName))];
      setStudents(uniqueStudents);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleStudentFilter = (studentName) => {
    setSelectedStudent(studentName);
    if (studentName) {
      setFilteredRequests(allRequests.filter(req => req.studentName === studentName));
    } else {
      setFilteredRequests(allRequests);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-purple-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-3xl font-bold text-gray-800">{allRequests.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Currently Out</p>
            <p className="text-3xl font-bold text-blue-600">
              {allRequests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Pending Approval</p>
            <p className="text-3xl font-bold text-yellow-600">
              {allRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Unique Students</p>
            <p className="text-3xl font-bold text-purple-600">{students.length}</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Student
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => handleStudentFilter(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Students</option>
            {students.map((student) => (
              <option key={student} value={student}>{student}</option>
            ))}
          </select>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-lg font-bold p-6 border-b">Activity Log</h2>
          
          {loading ? (
            <div className="p-6 text-center text-gray-600">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No requests found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Destination</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{req.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{req.class}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{req.destination}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {req.createdAt?.toDate?.().toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
