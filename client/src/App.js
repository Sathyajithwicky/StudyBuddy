import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/Homepage";
import JoinGroup from "./pages/JoinGroup";
import Pomodoro from "./pages/Pomodoro";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PhysicsGroup from './pages/PhysicsGroup';
import ChemistryGroup from './pages/groups/ChemistryGroup';
import BiologyGroup from './pages/groups/BiologyGroup';
import CombinedMathsGroup from './pages/CombinedmathsGroup';
import Reviews from './pages/Reviews';
import Admin from './pages/Admin';
import Notifications from './pages/Notifications';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route path="/pomodoro" element={
            <ProtectedRoute>
              <Pomodoro />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/join-group" element={
            <ProtectedRoute>
              <JoinGroup />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/physics-group" element={
            <ProtectedRoute>
              <PhysicsGroup />
            </ProtectedRoute>
          } />
          <Route path="/chemistry-group" element={
            <ProtectedRoute>
              <ChemistryGroup />
            </ProtectedRoute>
          } />
          <Route path="/biology-group" element={
            <ProtectedRoute>
              <BiologyGroup />
            </ProtectedRoute>
          } />
          <Route path="/combinedmaths-group" element={
            <ProtectedRoute>
              <CombinedMathsGroup />
            </ProtectedRoute>
          } />
          <Route path="/reviews" element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
