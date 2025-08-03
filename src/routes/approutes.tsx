// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from '../components/home';
 import ProfileList from '../components/ProfileList';


const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<ProfileList />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
