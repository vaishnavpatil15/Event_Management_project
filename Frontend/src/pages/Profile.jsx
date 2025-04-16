import { useState, useEffect } from "react";

// TODO: Replace with actual auth context
const useAuth = () => {
  // This is a mock implementation. Replace with your actual auth logic
  return {
    user: {
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    },
    isAuthenticated: true,
  };
};

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    organization: "Tech Corp",
    role: "Club Admin",
    bio: "Experienced event organizer with a passion for creating memorable experiences.",
  });
  const [userEvents, setUserEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic when backend is ready
    console.log("Profile updated:", profileData);
    setIsEditing(false);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchUserEvents = async () => {
      try {
        // Mock data - replace with actual API call
        const mockEvents = [
          {
            id: 1,
            title: "Annual Sports Meet",
            date: "2024-05-15",
            time: "09:00 AM",
            location: "City Sports Complex",
            status: "upcoming",
            clubName: "DSSA",
            description:
              "Join us for our annual sports meet featuring various athletic competitions.",
            maxParticipants: 200,
            currentParticipants: 150,
            registrationDeadline: "2024-05-10",
            category: "Sports",
            requirements: "Sports attire, water bottle",
          },
          {
            id: 2,
            title: "Chess Tournament",
            date: "2024-04-01",
            time: "10:00 AM",
            location: "Community Center",
            status: "completed",
            clubName: "Chess Club",
            description: "Annual chess tournament open to all skill levels.",
            maxParticipants: 50,
            currentParticipants: 45,
            registrationDeadline: "2024-03-25",
            category: "Games",
            requirements: "Basic chess knowledge",
          },
        ];
        setUserEvents(mockEvents);
      } catch (error) {
        console.error("Failed to fetch user events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  Change Photo
                </button>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="organization"
                    value={profileData.organization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.organization}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.bio}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events History Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">My Events</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : userEvents.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          <div className="space-y-4">
            {userEvents.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.clubName}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === "upcoming"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.status === "upcoming" ? "Upcoming" : "Completed"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Date:</span> {event.date}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {event.time}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span> Participant
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleViewDetails(event)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Club</h3>
                  <p className="mt-1">{selectedEvent.clubName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Category
                  </h3>
                  <p className="mt-1">{selectedEvent.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date & Time
                  </h3>
                  <p className="mt-1">
                    {selectedEvent.date} at {selectedEvent.time}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="mt-1">{selectedEvent.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 capitalize">{selectedEvent.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Registration
                  </h3>
                  <p className="mt-1">
                    {selectedEvent.currentParticipants} /{" "}
                    {selectedEvent.maxParticipants} participants
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Description
                </h3>
                <p className="mt-1">{selectedEvent.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Requirements
                </h3>
                <p className="mt-1">{selectedEvent.requirements}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Registration Deadline
                </h3>
                <p className="mt-1">{selectedEvent.registrationDeadline}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
