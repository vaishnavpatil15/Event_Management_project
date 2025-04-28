import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, DollarSign, Info } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    maxParticipants: "",
    registrationFee: "",
    registrationDeadline: "",
    requirements: "",
    organizer: user?.organization || "",
    clubId: user?.clubId || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'title',
      'description',
      'date',
      'time',
      'location',
      'category',
      'maxParticipants',
      'registrationFee',
      'registrationDeadline',
      'organizer'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field} field`);
        return false;
      }
    }

    // Validate dates
    const eventDate = new Date(formData.date);
    const deadlineDate = new Date(formData.registrationDeadline);
    const today = new Date();

    if (eventDate < today) {
      toast.error("Event date cannot be in the past");
      return false;
    }

    if (deadlineDate > eventDate) {
      toast.error("Registration deadline cannot be after the event date");
      return false;
    }

    // Validate numbers
    if (parseInt(formData.maxParticipants) < 1) {
      toast.error("Maximum participants must be at least 1");
      return false;
    }

    if (parseFloat(formData.registrationFee) < 0) {
      toast.error("Registration fee cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      // Debug user information
      console.log('User info:', {
        role: user?.role,
        clubId: user?.clubId,
        id: user?._id
      });

      // For clubadmin, we should have a clubId
      if (user?.role === 'clubadmin') {
        if (!user?.clubId) {
          console.error('Club ID missing for clubadmin');
          toast.error("Your club information is not properly set up. Please contact support.");
          setIsLoading(false);
          return;
        }
        
        // Simple check that clubId is a non-empty string
        if (typeof user.clubId !== 'string' || user.clubId.trim() === '') {
          console.error('Invalid club ID format:', user.clubId);
          toast.error("Invalid club information. Please contact support.");
          setIsLoading(false);
          return;
        }
      }

      const eventData = {
        ...formData,
        clubId: user?.clubId,
        createdBy: user?._id,
        date: new Date(formData.date).toISOString(),
        registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
        maxParticipants: parseInt(formData.maxParticipants),
        registrationFee: parseFloat(formData.registrationFee),
        currentParticipants: 0,
        participants: [],
        status: 'upcoming'
      };

      console.log('Submitting event data:', eventData);

      const response = await axios.post('http://localhost:3000/api/events', eventData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        toast.success("Event created successfully!");
        navigate("/events");
      } else {
        toast.error(response.data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input mt-1"
              required
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input mt-1"
              required
            >
              <option value="">Select category</option>
              <option value="sports">Sports</option>
              <option value="academic">Academic</option>
              <option value="cultural">Cultural</option>
              <option value="social">Social</option>
              <option value="technical">Technical</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input mt-1 pl-10"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input mt-1 pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input mt-1 pl-10"
                required
                placeholder="Enter event location"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Participants *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="input mt-1 pl-10"
                required
                min="1"
                placeholder="Enter maximum participants"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registration Fee *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                name="registrationFee"
                value={formData.registrationFee}
                onChange={handleChange}
                className="input mt-1 pl-10"
                required
                min="0"
                step="0.01"
                placeholder="Enter registration fee"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registration Deadline *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="input mt-1 pl-10"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input mt-1"
            required
            rows="4"
            placeholder="Enter event description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="input mt-1"
            rows="3"
            placeholder="Enter any special requirements for participants"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organizer *
          </label>
          <div className="relative">
            <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="input mt-1 pl-10"
              required
              placeholder="Enter organizer name"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
