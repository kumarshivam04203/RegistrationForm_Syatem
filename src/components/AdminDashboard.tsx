import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, LogOut } from 'lucide-react';
import { Submission } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    gender: '',
  });
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete'>('view');

  // Mock data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const mockData: Submission[] = Array.from({ length: 50 }, (_, i) => ({
        id: `SUB${1000 + i}`,
        fullName: `User ${i + 1}`,
        dateOfBirth: new Date(1980 + Math.floor(i / 10), i % 12, (i % 28) + 1).toISOString().split('T')[0],
        gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
        mobile: `98765${43210 + i}`,
        email: `user${i + 1}@example.com`,
        aadhaar: `${123456789000 + i}`,
        pan: `ABCDE${1234 + i}F`,
        permanentAddress: `${123 + i} Main Street, Apartment ${i + 1}`,
        state: i % 5 === 0 ? 'Maharashtra' : i % 5 === 1 ? 'Karnataka' : i % 5 === 2 ? 'Tamil Nadu' : i % 5 === 3 ? 'Delhi' : 'Gujarat',
        city: i % 4 === 0 ? 'Mumbai' : i % 4 === 1 ? 'Bangalore' : i % 4 === 2 ? 'Chennai' : 'Delhi',
        pincode: `${400000 + i}`,
        photoUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        createdAt: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
        updatedAt: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
      }));
      
      setSubmissions(mockData);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Filter and search submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          submission.mobile.includes(searchTerm) ||
                          submission.aadhaar.includes(searchTerm);
    
    const matchesFilters = (filters.state === '' || submission.state === filters.state) &&
                          (filters.city === '' || submission.city === filters.city) &&
                          (filters.gender === '' || submission.gender === filters.gender);
    
    return matchesSearch && matchesFilters;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle view submission
  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setModalType('view');
    setShowModal(true);
  };

  // Handle edit submission
  const handleEditSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setModalType('edit');
    setShowModal(true);
  };

  // Handle delete submission
  const handleDeleteSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setModalType('delete');
    setShowModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedSubmission) {
      // In a real implementation, we would send this to the backend
      // For now, we'll just update the local state
      setSubmissions(submissions.filter(s => s.id !== selectedSubmission.id));
      setShowModal(false);
    }
  };

  // Get unique states, cities, and genders for filters
  const uniqueStates = Array.from(new Set(submissions.map(s => s.state))).sort();
  const uniqueCities = Array.from(new Set(submissions.map(s => s.city))).sort();
  const uniqueGenders = Array.from(new Set(submissions.map(s => s.gender))).sort();

  // Reset filters
  const resetFilters = () => {
    setFilters({
      state: '',
      city: '',
      gender: '',
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name, email, mobile, or Aadhaar"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="relative">
                <select
                  value={filters.state}
                  onChange={(e) => {
                    setFilters({ ...filters, state: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All States</option>
                  {uniqueStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <select
                  value={filters.city}
                  onChange={(e) => {
                    setFilters({ ...filters, city: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Cities</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <select
                  value={filters.gender}
                  onChange={(e) => {
                    setFilters({ ...filters, gender: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Genders</option>
                  {uniqueGenders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {loading ? (
            <div className="p-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-600">No submissions found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full object-cover" src={submission.photoUrl} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{submission.fullName}</div>
                            <div className="text-sm text-gray-500 capitalize">{submission.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.mobile}</div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.city}</div>
                        <div className="text-sm text-gray-500">{submission.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewSubmission(submission)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditSubmission(submission)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubmission(submission)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && filteredSubmissions.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredSubmissions.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredSubmissions.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {modalType === 'view' && (
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Submission Details
                      </h3>
                      
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <img 
                            src={selectedSubmission.photoUrl} 
                            alt="User" 
                            className="w-full h-48 object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <video 
                            src={selectedSubmission.videoUrl} 
                            controls 
                            className="w-full h-48 object-cover rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 border-t pt-4">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.fullName}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.dateOfBirth}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Gender</dt>
                            <dd className="mt-1 text-sm text-gray-900 capitalize">{selectedSubmission.gender}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.mobile}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.email}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Aadhaar</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.aadhaar}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">PAN</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.pan}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.permanentAddress}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">City</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.city}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">State</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.state}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Pincode</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedSubmission.pincode}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(selectedSubmission.createdAt).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {modalType === 'delete' && (
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Delete Submission
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete the submission for {selectedSubmission.fullName}? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {modalType === 'view' && (
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                )}
                
                {modalType === 'delete' && (
                  <>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;