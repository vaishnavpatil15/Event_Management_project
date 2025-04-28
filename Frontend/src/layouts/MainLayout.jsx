import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  LayoutDashboard,
  User,
  Mail,
  HelpCircle,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Building2,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/events", icon: Calendar, label: "Events" },
    ...(user?.role === "clubadmin" || user?.role === "superadmin"
      ? [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/clubs", icon: Users, label: "Clubs" },
      ]
      : []),
    ...(user?.role === "superadmin"
      ? [
        { path: "/users", icon: Users, label: "Users Management" },
      ]
      : []),
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/contact", icon: Mail, label: "Contact" },
    { path: "/help", icon: HelpCircle, label: "Help" },
    ...(isAuthenticated && !user?.role
      ? [{ path: "/request-club", icon: Building2, label: "Request Club" }]
      : []),
  ];

  const authItems = isAuthenticated
    ? [
      {
        path: "/profile",
        icon: User,
        label: "Profile",
      },
    ]
    : [
      { path: "/login", icon: LogIn, label: "Login" },
      { path: "/register", icon: UserPlus, label: "Register" },
    ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"
          } bg-white shadow-lg transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4">
          <h1
            className={`${isSidebarOpen ? "block" : "hidden"
              } text-xl font-bold`}
          >
            Event Manager
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${isActive(item.path)
                  ? "bg-gray-100 border-r-4 border-blue-500"
                  : ""
                }`}
            >
              <item.icon size={20} />
              <span className={`${isSidebarOpen ? "ml-4" : "hidden"}`}>
                {item.label}
              </span>
            </Link>
          ))}

          <div className="border-t border-gray-200 my-4"></div>

          {authItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${isActive(item.path)
                  ? "bg-gray-100 border-r-4 border-blue-500"
                  : ""
                }`}
            >
              <item.icon size={20} />
              <span className={`${isSidebarOpen ? "ml-4" : "hidden"}`}>
                {item.label}
              </span>
            </Link>
          ))}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 w-full"
            >
              <LogOut size={20} />
              <span className={`${isSidebarOpen ? "ml-4" : "hidden"}`}>
                Logout
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
