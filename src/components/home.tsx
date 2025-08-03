// Home.tsx
import '../App.css';
import apiClient from '../api/axios';

const Home: React.FC = () => {

 const fetchPosts = async () => {
      try {
        const response = await apiClient.get('/api/Profiles/GetAllProfiles'); // Endpoint for posts
       console.log(response.data)
      } catch (error: any) {
       
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
