import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Admin/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import DailyGospel from './pages/DailyGospel';
import SaintOfTheDay from './pages/SaintOfTheDay';
import Prayers from './pages/Prayers';
import DailyReadings from './pages/DailyReadings';
import Novenas from './pages/Novenas';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AprendeARezar from './pages/AprendeARezar';
import LiturgicalCalendar from './pages/LiturgicalCalendar';
import PrayerRequests from './pages/PrayerRequests';
import SacredArt from './pages/SacredArt';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SystemSettings from './components/Admin/SystemSettings';
import ContentManager from './components/Admin/ContentManager';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Admin Routes - Sin Layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/content" element={
            <ProtectedRoute>
              <ContentManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <SystemSettings />
            </ProtectedRoute>
          } />

          {/* Public Routes con Layout */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/evangelio-del-dia" element={
            <Layout>
              <DailyGospel />
            </Layout>
          } />
          <Route path="/santo-del-dia" element={
            <Layout>
              <SaintOfTheDay />
            </Layout>
          } />
          <Route path="/oraciones" element={
            <Layout>
              <Prayers />
            </Layout>
          } />
          <Route path="/oraciones/:category" element={
            <Layout>
              <Prayers />
            </Layout>
          } />
          <Route path="/lecturas-del-dia" element={
            <Layout>
              <DailyReadings />
            </Layout>
          } />
          <Route path="/novenas" element={
            <Layout>
              <Novenas />
            </Layout>
          } />
          <Route path="/novenas/:novenaId" element={
            <Layout>
              <Novenas />
            </Layout>
          } />
          <Route path="/blog" element={
            <Layout>
              <Blog />
            </Layout>
          } />
          <Route path="/blog/:slug" element={
            <Layout>
              <BlogPost />
            </Layout>
          } />
          <Route path="/aprende-a-rezar" element={
            <Layout>
              <AprendeARezar />
            </Layout>
          } />
          <Route path="/calendario-liturgico" element={
            <Layout>
              <LiturgicalCalendar />
            </Layout>
          } />
          <Route path="/peticiones-oracion" element={
            <Layout>
              <PrayerRequests />
            </Layout>
          } />
          <Route path="/arte-sacro" element={
            <Layout>
              <SacredArt />
            </Layout>
          } />
          <Route path="/acerca-de" element={
            <Layout>
              <About />
            </Layout>
          } />
          <Route path="/contacto" element={
            <Layout>
              <Contact />
            </Layout>
          } />
          <Route path="/politica-privacidad" element={
            <Layout>
              <Privacy />
            </Layout>
          } />
          <Route path="/terminos-condiciones" element={
            <Layout>
              <Terms />
            </Layout>
          } />
          <Route path="/politica-cookies" element={
            <Layout>
              <Cookies />
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
