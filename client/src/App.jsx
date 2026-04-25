import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatWidget from './components/chatbot/ChatWidget';
import ScrollToTop from './components/utils/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { useAdminStore } from './store/useAdminStore';
import { locationService } from './services/locationService';
import {
  RequireSearch,
  RequireBus,
  RequireSeats,
  RequireBookingSuccess,
  RequireAdmin,
} from './guards/RouteGuard';

// Pages
import Home from './pages/Home';
import BusListing from './pages/BusListing';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import CookiePolicy from './pages/CookiePolicy';
import HelpCenter from './pages/HelpCenter';
import SafetyGuide from './pages/SafetyGuide';
import Cancellation from './pages/Cancellation';
import FAQ from './pages/FAQ';
import Insurance from './pages/Insurance';
import AboutUs from './pages/AboutUs';
import BusPartners from './pages/BusPartners';
import Careers from './pages/Careers';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import CancellationPage from './pages/CancellationPage';
import AdminDashboard from './pages/admin/Dashboard';
import BusList from './pages/admin/buses/BusList';
import RouteList from './pages/admin/routes/RouteList';
import TripList from './pages/admin/trips/TripList';
import AllBookings from './pages/admin/AllBookings';
import ManageUsers from './pages/admin/ManageUsers';
import Settings from './pages/admin/Settings';
import NotFound from './pages/NotFound';

const App = () => {
  const init = useAuthStore((s) => s.init);
  const setLocations = useAdminStore((s) => s.setLocations);

  useEffect(() => {
    init();
    
    // Bootstrap locations from API
    const syncData = async () => {
      try {
        const data = await locationService.getLocations();
        setLocations(data);
      } catch (err) {
        console.error("Location sync failed", err);
      }
    };
    syncData();
  }, [init, setLocations]);

  return (
    <BrowserRouter>
      {/* Utility: Always scroll to top on navigation */}
      <ScrollToTop />

      {/* ChatWidget is rendered globally — visible on all pages */}
      <ChatWidget />
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 3000, style: { background: '#fff', color: '#1e293b', fontWeight: 'bold' } }} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Guarded: requires searchParams */}
        <Route
          path="/buses"
          element={
            <RequireSearch>
              <BusListing />
            </RequireSearch>
          }
        />

        {/* Guarded: requires selectedBus */}
        <Route
          path="/seats/:tripId"
          element={
            <RequireBus>
              <SeatSelection />
            </RequireBus>
          }
        />

        {/* Guarded: requires selectedBus + at least 1 selectedSeat */}
        <Route
          path="/checkout"
          element={
            <RequireSeats>
              <Checkout />
            </RequireSeats>
          }
        />

        {/* Guarded: requires bookingStatus === 'success' */}
        <Route
          path="/confirmation"
          element={
            <RequireBookingSuccess>
              <BookingConfirmation />
            </RequireBookingSuccess>
          }
        />

        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/safety" element={<SafetyGuide />} />
        <Route path="/cancellation" element={<Cancellation />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/partners" element={<BusPartners />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/cancel-booking/:bookingId" element={<CancellationPage />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/buses" element={<RequireAdmin><BusList /></RequireAdmin>} />
        <Route path="/admin/routes" element={<RequireAdmin><RouteList /></RequireAdmin>} />
        <Route path="/admin/trips" element={<RequireAdmin><TripList /></RequireAdmin>} />
        <Route path="/admin/bookings" element={<RequireAdmin><AllBookings /></RequireAdmin>} />
        <Route path="/admin/users" element={<RequireAdmin><ManageUsers /></RequireAdmin>} />
        <Route path="/admin/settings" element={<RequireAdmin><Settings /></RequireAdmin>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
