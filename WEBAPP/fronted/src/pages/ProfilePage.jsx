import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const ProfilePage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [stats, setStats] = useState({});
  const [activityHeatmap, setActivityHeatmap] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const [userRes, statsRes, streakRes, activityRes, earningsRes] = await Promise.all([
          axios.get('/api/profileplace/userinfo'),
          axios.get('/api/profileplace/stats'),
          axios.get('/api/profileplace/streak'), // new heatmap source
          axios.get('/api/profileplace/recent-activity'),
          axios.get('/api/profileplace/my-earnings')
        ]);

        setUserInfo(userRes.data);
        setStats(statsRes.data);
        console.log(userRes.data);
        console.log(statsRes.data);
        // Format streak data to { date: 'YYYY-MM-DD', count: number }
        const formattedHeatmap = streakRes.data.map(entry => ({
          date: entry.date,
          count: Number(entry.count),
        }));
        setActivityHeatmap(formattedHeatmap);

        setRecentActivity(activityRes.data);
        setEarnings(earningsRes.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setIsLoading(false);
        localStorage.clear();
        navigate('/login', { replace: true });
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Calculate date range for heatmap (last 2 months)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-semibold">{userInfo.username}</h2>
            <p className="text-gray-500">{userInfo.email}</p>
          </div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              localStorage.clear();
              navigate('/login', { replace: true });
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats and Heatmap Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Profile Stats</h3>
            <p>Courses: {stats.totalCourses} (Avg Rating: {stats.avgCourseRating})</p>
            <p>Doubts: {stats.totalDoubts} (Avg Rating: {stats.avgDoubtRating})</p>
            <p>Coins Earned (Lifetime): {stats.coinsLifetime}</p>
            <p>Coins Earned (Last Month): {stats.coinsLastMonth}</p>
          </div>

          {/* Heatmap for 2 months */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Activity Streak (Last 2 Months)</h3>
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={activityHeatmap}
              classForValue={value => {
                if (!value || value.count === 0) return 'color-empty';
                if (value.count < 2) return 'color-scale-1';
                if (value.count < 4) return 'color-scale-2';
                if (value.count < 6) return 'color-scale-3';
                return 'color-scale-4';
              }}
              tooltipDataAttrs={value => ({
                'data-tip': `${value.date}: ${value.count} activities`,
              })}
              showWeekdayLabels
            />
          </div>
        </div>

        {/* Activity and Earnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow h-60 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500">No activity yet</p>
            ) : (
              recentActivity.map((item, idx) => (
                <div key={idx} className="p-2 mb-2 bg-gray-100 rounded">
                  {item.type}: {item.activity}
                </div>
              ))
            )}
          </div>

          {/* Earnings */}
          <div className="bg-white p-6 rounded-lg shadow h-60 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Earnings</h3>
            {earnings.length === 0 ? (
              <p className="text-gray-500">No earnings yet</p>
            ) : (
              earnings.map((entry, idx) => (
                <div key={idx} className="p-2 mb-2 bg-green-100 rounded">
                  {new Date(entry.month).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  })}: ₹{entry.total_received}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
