import React from 'react';
import { Link } from 'react-router-dom';
import DashboardNavBar from '../components/dashboard/DashboardNavBar';
import axios from '../utils/axios.js';
import  { useState, useEffect } from 'react';


import { useNavigate } from 'react-router-dom';

// RecentActivities Component (similar to the one in Dashboard.jsx)
const RecentActivities = ()  => {
  console.log("reached user page");
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    const fetchAndUpdateActivities = async () => {
      try {
        console.log("calling route to fetch activity");
        const response = await axios.get("/api/me/getRecentActivity");
        setActivities(response.data.recentActivity);
        console.log("got activites");
      } catch (error) {
        console.error('Error while getting user details or updating activities:', error);
        localStorage.clear();
        navigate('/login', { replace: true });
      }
    };

    fetchAndUpdateActivities();
  }, [navigate]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {activities.map((activities, index) => (
          <div key={index} className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-3 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-700 font-medium">{activities.activity}</p>
                <span className="text-xs text-gray-500">{activities.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// FeatureCard Component (similar to the one in Dashboard.jsx)
const FeatureCard = ({ title, description, icon, linkTo, color, bgColor }) => (
  <Link
    to={linkTo}
    className={`block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden`}
  >
    <div className={`${bgColor} h-20 flex items-center justify-center`}>
        <span className="text-4xl text-white">{icon}</span>
    </div>
    <div className="p-6">
      <h3 className={`text-2xl font-bold mb-3 text-${color}-600`}>{title}</h3>
      <p className="text-gray-600 mb-4 text-sm min-h-[60px]">{description}</p>
      <div className={`flex items-center font-semibold text-${color}-500 hover:text-${color}-700 transition-colors`}>
        <span>Explore Now</span>
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  </Link>
);

const UserHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavBar /> 
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-gray-600 mb-8">Continue your learning journey and explore new opportunities.</p>

        <RecentActivities />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Skill Marketplace"
            description="Browse and enroll in courses to enhance your expertise or share your knowledge by creating your own."
            icon="🎓"
            linkTo="/marketplace"
            color="blue"
            bgColor="bg-blue-500"
          />
          <FeatureCard
            title="Resource Marketplace"
            description="Discover tools, templates, and other valuable resources. Contribute your own to help the community."
            icon="🛠️"
            linkTo="/resources" // New route
            color="green"
            bgColor="bg-green-500"
          />
          <FeatureCard
            title="Learning Community"
            description="Connect with peers, ask questions, share insights, and collaborate on projects in our vibrant community."
            icon="👥"
            linkTo="/community_chat"
            color="purple"
            bgColor="bg-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

export default UserHomePage; 