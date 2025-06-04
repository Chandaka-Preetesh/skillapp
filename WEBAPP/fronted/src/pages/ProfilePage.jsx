import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const skills = [
    { name: 'JavaScript', level: 85, badge: '🏆', projects: 12 },
    { name: 'React', level: 75, badge: '⭐', projects: 8 },
    { name: 'Node.js', level: 65, badge: '🌟', projects: 5 },
    { name: 'Python', level: 60, badge: '🎯', projects: 4 },
  ];

  const badges = [
    { name: 'Master Teacher', icon: '👨‍🏫', description: 'Taught 50+ students', color: 'bg-yellow-100' },
    { name: 'Problem Solver', icon: '🧩', description: 'Solved 100+ challenges', color: 'bg-blue-100' },
    { name: 'Community Leader', icon: '👑', description: 'Top contributor', color: 'bg-purple-100' },
    { name: 'Quick Learner', icon: '🚀', description: 'Completed 10 courses', color: 'bg-green-100' },
    { name: 'Team Player', icon: '🤝', description: 'Collaborated on 20+ projects', color: 'bg-pink-100' },
    { name: 'Innovation Star', icon: '💡', description: 'Created 5 original projects', color: 'bg-indigo-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/user-home')}
                className="text-xl font-bold text-gray-900"
              >
                SkillShare
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8 mb-8"
          >
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.full_name}
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-sm font-bold">5</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.full_name}</h1>
                <p className="text-gray-600 mt-1">Full Stack Developer</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="text-gray-600">4.8 Rating</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-1">👥</span>
                    <span className="text-gray-600">120 Students</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-1">📚</span>
                    <span className="text-gray-600">15 Courses</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills and Badges Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Skills & Expertise</h2>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="mr-2">{skill.badge}</span>
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{skill.projects} projects</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Badges Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Achievements & Badges</h2>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center mr-4`}>
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{badge.name}</h4>
                      <p className="text-sm text-gray-500">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {[
                { icon: '📚', title: 'Completed React Advanced Course', time: '2 days ago', color: 'bg-blue-100' },
                { icon: '🏆', title: 'Earned Master Teacher Badge', time: '1 week ago', color: 'bg-yellow-100' },
                { icon: '👥', title: 'Helped 5 students with JavaScript', time: '2 weeks ago', color: 'bg-green-100' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className={`${activity.color} w-10 h-10 rounded-full flex items-center justify-center mr-4`}>
                    <span className="text-xl">{activity.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 