import React from 'react';
import '../styles/index.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WasteListPage from './pages/WasteListPage';
import WasteFormPage from './pages/WasteFormPage';
import CollectionsPage from './pages/CollectionsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/waste" element={<PrivateRoute><WasteListPage /></PrivateRoute>} />
          <Route path="/waste/new" element={<PrivateRoute><WasteFormPage /></PrivateRoute>} />
          <Route path="/waste/:id/edit" element={<PrivateRoute><WasteFormPage /></PrivateRoute>} />
          <Route path="/collections" element={<PrivateRoute><CollectionsPage /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
