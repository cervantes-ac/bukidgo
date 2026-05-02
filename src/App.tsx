/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ItineraryGenerator from "./pages/ItineraryGenerator";
import Auth from "./pages/Auth";
import Guides from "./pages/Guides.enhanced";
import Events from "./pages/Events";
import Food from "./pages/Food";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Careers from "./pages/Careers";
import DestinationDetail from "./pages/DestinationDetail";
import FoodSpotDetail from "./pages/FoodSpotDetail";
import { FirebaseProvider, useFirebase } from "./contexts/FirebaseContext";

function AppRoutes() {
  const { loading } = useFirebase();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-linen">
        <div className="w-12 h-12 border-4 border-earth border-t-transparent rounded-full animate-spin shadow-xl" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="destination/:id" element={<DestinationDetail />} />
          <Route path="guides" element={<Guides />} />
          <Route path="events" element={<Events />} />
          <Route path="food" element={<Food />} />
          <Route path="food/:id" element={<FoodSpotDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="ai-itinerary" element={<ItineraryGenerator />} />
          <Route path="auth" element={<Auth />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="careers" element={<Careers />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppRoutes />
    </FirebaseProvider>
  );
}
