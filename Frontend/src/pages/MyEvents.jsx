import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const MyEvents = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await axios.get(`/event-registrations/user/${user._id}`);
                console.log('Registrations response:', response.data); // Debug log
                
                if (response.data && response.data.data) {
                    setRegistrations(response.data.data);
                } else {
                    setRegistrations([]);
                }
            } catch (error) {
                console.error("Error fetching registrations:", error);
                toast.error("Failed to fetch your event registrations");
                setError(error.response?.data?.message || 'Failed to fetch registrations');
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchRegistrations();
        }
    }, [user]);

    const handleCancelRegistration = async (registrationId) => {
        try {
            await axios.delete(`/event-registrations/${registrationId}`);
            setRegistrations(registrations.filter(reg => reg._id !== registrationId));
            toast.success('Registration cancelled successfully');
        } catch (err) {
            console.error('Error cancelling registration:', err);
            toast.error(err.response?.data?.message || 'Failed to cancel registration');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Registered Events</h1>
            
            {registrations.length === 0 ? (
                <div className="text-center text-gray-500">
                    You haven't registered for any events yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registrations.map(registration => (
                        <div key={registration._id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-2">{registration.eventName}</h2>
                            <div className="space-y-2 text-gray-600">
                                <p><span className="font-medium">Name:</span> {registration.name}</p>
                                <p><span className="font-medium">Email:</span> {registration.email}</p>
                                <p><span className="font-medium">Phone:</span> {registration.phone}</p>
                                <p><span className="font-medium">Organization:</span> {registration.organization}</p>
                                {registration.requirements && (
                                    <p><span className="font-medium">Requirements:</span> {registration.requirements}</p>
                                )}
                                <p><span className="font-medium">Status:</span> 
                                    <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                                        registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {registration.status}
                                    </span>
                                </p>
                                <p><span className="font-medium">Registration Date:</span> {new Date(registration.createdAt).toLocaleDateString()}</p>
                            </div>
                            
                            {registration.status !== 'cancelled' && (
                                <button
                                    onClick={() => handleCancelRegistration(registration._id)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                >
                                    Cancel Registration
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEvents; 