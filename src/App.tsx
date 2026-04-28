/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ItineraryGenerator from "./pages/ItineraryGenerator";
import Auth from "./pages/Auth";
import Guides from "./pages/Guides";
import Events from "./pages/Events";
import Food from "./pages/Food";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import { FirebaseProvider, useFirebase } from "./contexts/FirebaseContext";

function AppRoutes() {
  const { loading } = useFirebase();

  if (loading) {
    return (
      <LoadingSpinner 
        fullScreen 
        size="lg" 
        text="Loading BukidGo..." 
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="guides" element={<Guides />} />
          <Route path="events" element={<Events />} />
          <Route path="food" element={<Food />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="ai-itinerary" element={<ItineraryGenerator />} />
          <Route path="auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppRoutes />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
