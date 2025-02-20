// Home.tsx
import React, { useState } from 'react';
import './App.css';
import axiosInstance from './api/axios';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('/WeatherForecast'); // Endpoint for posts
        setPosts(response.data); // Save data to state
        setLoading(false); // Set loading to false
      } catch (error: any) {
        setError('Error fetching data'); // Handle error
        setLoading(false);
      }
    };
  return (
    <div className="welcome-container">
    <div className="welcome-content">
      <h1 className="welcome-title">Welcome to Our Website!</h1>
      <p className="welcome-description">
        We're glad to have you here. Let's explore together.
      </p>
      <button className="explore-button" onClick={fetchPosts}>Start Exploring</button>
    </div>
  </div>
  );
};

export default Home;
