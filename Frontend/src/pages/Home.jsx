import { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";

const Home = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    requirements: "",
  });

  const featuredEvents = [
    {
      id: 1,
      title: "Tech Conference 2024",
      date: "2024-05-15",
      location: "New York City",
      attendees: 500,
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description:
        "Join us for the biggest tech conference of the year featuring industry leaders and innovative discussions.",
      category: "Technology",
      maxParticipants: 600,
      currentParticipants: 500,
      registrationDeadline: "2024-05-01",
      requirements: "Laptop, conference pass",
      time: "09:00 AM - 05:00 PM",
      venue: "New York Convention Center",
      organizer: "Tech Events Inc.",
    },
    {
      id: 2,
      title: "Music Festival",
      date: "2024-06-20",
      location: "Los Angeles",
      attendees: 1000,
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description:
        "Experience three days of amazing music performances from top artists around the world.",
      category: "Music",
      maxParticipants: 1200,
      currentParticipants: 1000,
      registrationDeadline: "2024-06-10",
      requirements: "Festival pass, comfortable clothing",
      time: "12:00 PM - 11:00 PM",
      venue: "LA Music Park",
      organizer: "Music Festivals Co.",
    },
    {
      id: 3,
      title: "Business Summit",
      date: "2024-07-10",
      location: "Chicago",
      attendees: 300,
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description:
        "Network with industry leaders and learn about the latest business trends and strategies.",
      category: "Business",
      maxParticipants: 400,
      currentParticipants: 300,
      registrationDeadline: "2024-07-01",
      requirements: "Business attire, business cards",
      time: "08:00 AM - 06:00 PM",
      venue: "Chicago Business Center",
      organizer: "Business Leaders Association",
    },
  ];

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

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    // Here you would typically send the registration data to your backend
    console.log("Registration submitted:", {
      eventId: selectedEvent.id,
      ...registrationData,
    });
    // Show success message
    alert("Registration submitted successfully!");
    handleCloseRegistration();
    handleCloseDetails();
  };

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
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors">
              Explore Events
            </button>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={event.image}
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
                  <span>{event.attendees} attendees</span>
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
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Organizer
                  </h3>
                  <p className="mt-1">{selectedEvent.organizer}</p>
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
                    {new Date(selectedEvent.date).toLocaleDateString()} at{" "}
                    {selectedEvent.time}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Venue</h3>
                  <p className="mt-1">{selectedEvent.venue}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="mt-1">{selectedEvent.location}</p>
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
                <p className="mt-1">
                  {new Date(
                    selectedEvent.registrationDeadline
                  ).toLocaleDateString()}
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
