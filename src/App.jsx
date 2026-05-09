import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Astrologers from './pages/Astrologers';
import Live from './pages/Live';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminOverview from './pages/admin/AdminOverview';
import ManageAstrologers from './pages/admin/ManageAstrologers';
import ManageBanners from './pages/admin/ManageBanners';
import ManageLiveShows from './pages/admin/ManageLiveShows';
import ManageServices from './pages/admin/ManageServices';
import ContactQueries from './pages/admin/ContactQueries';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/astrologers" element={<Astrologers />} />
          <Route path="/live" element={<Live />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<AdminOverview />} />
            <Route path="astrologers" element={<ManageAstrologers />} />
            <Route path="banners" element={<ManageBanners />} />
            <Route path="live-shows" element={<ManageLiveShows />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="contact-queries" element={<ContactQueries />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
