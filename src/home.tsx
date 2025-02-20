// Home.tsx
import React from 'react';
import './App.css';

const Home: React.FC = () => {
  return (
    <div className="welcome-container">
    <div className="welcome-content">
      <h1 className="welcome-title">Welcome to Our Website!</h1>
      <p className="welcome-description">
        We're glad to have you here. Let's explore together.
      </p>
      <button className="explore-button">Start Exploring</button>
    </div>
  </div>
  );
};

export default Home;
