import { Calendar, Users, Building, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Events",
      value: "12",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Total Attendees",
      value: "1,234",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Active Clubs",
      value: "8",
      icon: Building,
      color: "bg-purple-500",
    },
    {
      title: "Upcoming Events",
      value: "5",
      icon: Clock,
      color: "bg-yellow-500",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Tech Conference 2024",
      type: "Event Created",
      date: "2024-04-15",
      user: "John Doe",
    },
    {
      id: 2,
      title: "Music Festival",
      type: "Event Updated",
      date: "2024-04-14",
      user: "Jane Smith",
    },
    {
      id: 3,
      title: "Business Summit",
      type: "New Registration",
      date: "2024-04-13",
      user: "Mike Johnson",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <h3 className="font-medium">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{activity.user}</p>
                <p className="text-sm text-gray-400">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/events/create")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            >
              Create New Event
            </button>
            <button
              onClick={() => navigate("/events")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
            >
              View All Events
            </button>
            <button
              onClick={() => navigate("/clubs")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
            >
              Manage Clubs
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">Tech Conference 2024</h3>
                <p className="text-sm text-gray-500">May 15, 2024</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                500 attendees
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">Music Festival</h3>
                <p className="text-sm text-gray-500">June 20, 2024</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                1000 attendees
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
