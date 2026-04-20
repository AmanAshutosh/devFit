import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import PageLoader from "./components/PageLoader/PageLoader.jsx";
import PWAPrompt from "./components/PWAPrompt/PWAPrompt.jsx";
import Landing from "./pages/Landing/Landing.jsx";

import Auth from "./pages/Auth/Auth.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import GymPlan from "./pages/GymPlan/GymPlan.jsx";
import PlanPage from "./pages/GymPlan/PlanPage.jsx";
import ExerciseTracker from "./pages/ExerciseTracker/ExerciseTracker.jsx";
import DietTracker from "./pages/DietTracker/DietTracker.jsx";
import SupplementTracker from "./pages/SupplementTracker/SupplementTracker.jsx";
import Analytics from "./pages/Analytics/Analytics.jsx";
import VideoSuggestions from "./pages/VideoSuggestions/VideoSuggestions.jsx";
import DietPlanGenerator from "./pages/DietPlanGenerator/DietPlanGenerator.jsx";
import WorkoutPlanGenerator from "./pages/WorkoutPlanGenerator/WorkoutPlanGenerator.jsx";

// Root: show Landing if not logged in, redirect to /dashboard if logged in
const HomeRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Landing />;
};

// Route-change loader — uses cleanup to reset loading so Strict Mode & fast nav work correctly
const RouteChangeLoader = () => {
  const location = useLocation();
  const { loading: authLoading } = useAuth();
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), 200);
    return () => {
      clearTimeout(t);
      setRouteLoading(false);
    };
  }, [location.pathname]);

  return <PageLoader show={authLoading || routeLoading} />;
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <RouteChangeLoader />
        <PWAPrompt />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/gym-plan"
            element={
              <PrivateRoute>
                <GymPlan />
              </PrivateRoute>
            }
          />
          <Route
            path="/gym-plan/:level"
            element={
              <PrivateRoute>
                <PlanPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/exercises"
            element={
              <PrivateRoute>
                <ExerciseTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/diet"
            element={
              <PrivateRoute>
                <DietTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/supplements"
            element={
              <PrivateRoute>
                <SupplementTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <PrivateRoute>
                <VideoSuggestions />
              </PrivateRoute>
            }
          />
          <Route
            path="/diet-plan"
            element={
              <PrivateRoute>
                <DietPlanGenerator />
              </PrivateRoute>
            }
          />
          <Route
            path="/workout-plan"
            element={
              <PrivateRoute>
                <WorkoutPlanGenerator />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
