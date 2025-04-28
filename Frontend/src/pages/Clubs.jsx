import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Clubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingClub, setEditingClub] = useState(null);
  const [viewingClub, setViewingClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axios.get('/clubs');
      setClubs(response.data.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      toast.error("Failed to fetch clubs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (clubId) => {
    try {
      const response = await axios.get(`/clubs/${clubId}`);
      setViewingClub(response.data.data);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Error fetching club details:', error);
      toast.error("Failed to fetch club details");
    }
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`/clubs/${editingClub._id}`, editingClub);
      setClubs(clubs.map(club => 
        club._id === editingClub._id ? response.data.data : club
      ));
      toast.success("Club updated successfully");
      setIsModalOpen(false);
      setEditingClub(null);
    } catch (error) {
      console.error('Error updating club:', error);
      toast.error("Failed to update club");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingClub(null);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewingClub(null);
  };

  const handleDelete = async (clubId) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;

    try {
      await axios.delete(`/clubs/${clubId}`);
      setClubs(clubs.filter(club => club._id !== clubId));
      toast.success("Club deleted successfully");
    } catch (error) {
      console.error('Error deleting club:', error);
      toast.error("Failed to delete club");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clubs</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Club Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clubs.map((club) => (
                <tr key={club._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {club.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {club.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{club.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        club.status === "active"
                          ? "bg-green-100 text-green-800"
                          : club.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {club.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(club._id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    {user?.role === "superadmin" && (
                      <>
                        <button
                          onClick={() => handleEdit(club)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(club._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {isViewModalOpen && viewingClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Club Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Club Name
                </label>
                <div className="text-gray-900">{viewingClub.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="text-gray-900">{viewingClub.description}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="text-gray-900">{viewingClub.category}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    viewingClub.status === "active"
                      ? "bg-green-100 text-green-800"
                      : viewingClub.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {viewingClub.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin
                </label>
                <div className="text-gray-900">
                  {viewingClub.admin?.name} ({viewingClub.admin?.email})
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleViewModalClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && editingClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Club</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Club Name
                </label>
                <input
                  type="text"
                  value={editingClub.name}
                  onChange={(e) =>
                    setEditingClub({ ...editingClub, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingClub.description}
                  onChange={(e) =>
                    setEditingClub({
                      ...editingClub,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editingClub.category}
                  onChange={(e) =>
                    setEditingClub({ ...editingClub, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editingClub.status}
                  onChange={(e) =>
                    setEditingClub({ ...editingClub, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;
