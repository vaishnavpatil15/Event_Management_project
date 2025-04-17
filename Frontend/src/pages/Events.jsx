import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const selectedDate = new Date(editingEvent.date);

    if (!editingEvent.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!editingEvent.date) {
      newErrors.date = "Date is required";
    } else if (selectedDate < today) {
      newErrors.date = "Date must be in the future";
    }

    if (!editingEvent.time) {
      newErrors.time = "Time is required";
    }

    if (!editingEvent.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!editingEvent.maxParticipants) {
      newErrors.maxParticipants = "Maximum participants is required";
    } else if (
      editingEvent.maxParticipants < editingEvent.currentParticipants
    ) {
      newErrors.maxParticipants =
        "Maximum participants cannot be less than current participants";
    }

    if (!editingEvent.registrationFee) {
      newErrors.registrationFee = "Registration fee is required";
    } else if (editingEvent.registrationFee < 0) {
      newErrors.registrationFee = "Registration fee cannot be negative";
    }

    if (!editingEvent.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!editingEvent.organizer.trim()) {
      newErrors.organizer = "Organizer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (event) => {
    setEditingEvent({ ...event });
    setShowEditModal(true);
    setErrors({});
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === editingEvent._id ? editingEvent : event
        )
      );
      setShowEditModal(false);
      setEditingEvent(null);
      setErrors({});
      toast.success("Event updated successfully");
    } catch (error) {
      toast.error("Failed to update event");
      console.error("Error updating event:", error);
    }
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setEditingEvent(null);
    setErrors({});
  };

  const handleDelete = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
        toast.success("Event deleted successfully");
      } catch (error) {
        toast.error("Failed to delete event");
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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
        <h1 className="text-2xl font-bold">Events</h1>
        {user?.role === "admin" && (
          <Link
            to="/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Event
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Fee
                </th>
                {user?.role === "admin" && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.currentParticipants || 0}/{event.maxParticipants}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${event.registrationFee}
                    </div>
                  </td>
                  {user?.role === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Edit Event</h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editingEvent.title}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={editingEvent.date}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.date ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={editingEvent.time}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.time ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editingEvent.location}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="maxParticipants"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maximum Participants
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={editingEvent.maxParticipants}
                    onChange={handleInputChange}
                    min={editingEvent.currentParticipants}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.maxParticipants
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.maxParticipants && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.maxParticipants}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="registrationFee"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Registration Fee ($)
                  </label>
                  <input
                    type="number"
                    id="registrationFee"
                    name="registrationFee"
                    value={editingEvent.registrationFee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.registrationFee
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.registrationFee && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.registrationFee}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={editingEvent.category}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="organizer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Organizer
                </label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={editingEvent.organizer}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.organizer ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.organizer && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.organizer}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editingEvent.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="requirements"
                  className="block text-sm font-medium text-gray-700"
                >
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={editingEvent.requirements}
                  onChange={handleInputChange}
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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

export default Events;
