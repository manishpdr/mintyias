// Home.tsx
import React from 'react';
import './App.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Minty Home</h1>
      <p className="home-description">
       Welcome to Minty IAS Page.
      </p>
      <button className="home-button">Get Started</button>
    </div>
  );
};

export default Home;
