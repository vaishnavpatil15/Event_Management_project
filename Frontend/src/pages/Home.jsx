import { useState, useEffect } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    requirements: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  const handleRegister = () => {
    setShowRegistrationForm(true);
  };

  const handleCloseRegistration = () => {
    setShowRegistrationForm(false);
    setRegistrationData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      requirements: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        toast.error('Please login to register for events');
        return;
      }

      // Validate required fields
      if (!registrationData.name || !registrationData.email || !registrationData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }

      const response = await axios.post('/event-registrations/register', {
        eventId: selectedEvent._id,
        userId: user._id,
        name: registrationData.name,
        email: registrationData.email,
        phone: registrationData.phone,
        organization: registrationData.organization || '',
        requirements: registrationData.requirements || ''
      });

      if (response.data.success) {
        toast.success('Registration submitted successfully!');
        handleCloseRegistration();
        handleCloseDetails();
        // Refresh events to update participant count
        fetchEvents();
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit registration');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[500px] rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <h1 className="text-5xl font-bold">Welcome to Event Manager</h1>
            <p className="text-xl">Discover and manage amazing events</p>
            <button 
              onClick={() => navigate('/events')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Explore Events
            </button>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{event.currentParticipants} / {event.maxParticipants} attendees</span>
                </div>
                <button
                  onClick={() => handleViewDetails(event)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <img
                src={selectedEvent.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Organizer</h3>
                  <p className="mt-1">{selectedEvent.organizer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1">{selectedEvent.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                  <p className="mt-1">
                    {new Date(selectedEvent.date).toLocaleDateString()} at{" "}
                    {selectedEvent.time}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1">{selectedEvent.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Registration</h3>
                  <p className="mt-1">
                    {selectedEvent.currentParticipants} / {selectedEvent.maxParticipants} participants
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Registration Fee</h3>
                  <p className="mt-1">${selectedEvent.registrationFee}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{selectedEvent.description}</p>
              </div>
              {selectedEvent.requirements && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Requirements</h3>
                  <p className="mt-1">{selectedEvent.requirements}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Registration Deadline</h3>
                <p className="mt-1">
                  {new Date(selectedEvent.registrationDeadline).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleRegister}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form Modal */}
      {showRegistrationForm && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">
                Register for {selectedEvent.title}
              </h2>
              <button
                onClick={handleCloseRegistration}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={registrationData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-medium text-gray-700"
                >
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={registrationData.organization}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="requirements"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={registrationData.requirements}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseRegistration}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
