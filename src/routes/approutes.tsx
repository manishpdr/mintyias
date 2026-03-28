import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import FamilyMembers from '../pages/FamilyMembers';
import Events from '../pages/Events';
import Tasks from '../pages/Tasks';
import Budget from '../pages/Budget';
import PhotoGallery from '../pages/PhotoGallery';
import Navigation from '../components/Navigation';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<FamilyMembers />} />
        <Route path="/events" element={<Events />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/gallery" element={<PhotoGallery />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
