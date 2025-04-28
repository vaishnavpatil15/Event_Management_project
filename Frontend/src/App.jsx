import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestClub from "./pages/RequestClub";
import Clubs from "./pages/Clubs";
import MyEvents from "./pages/MyEvents";
import UsersManagement from "./pages/UsersManagement";

// Protected Route component
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="events" element={<Events />} />
            <Route
              path="events/create"
              element={
                <ProtectedRoute roles={["clubadmin"]}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="clubs"
              element={
                <ProtectedRoute roles={["clubadmin", "superadmin"]}>
                  <Clubs />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute roles={["clubadmin", "superadmin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <UsersManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="contact" element={<Contact />} />
            <Route path="help" element={<Help />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="request-club" element={<RequestClub />} />
            <Route
              path="my-events"
              element={
                <ProtectedRoute>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
