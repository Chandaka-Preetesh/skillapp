import React from 'react';

const RecommendedSkills = () => {
  // This will be replaced with actual data from the backend
  const recommendedSkills = [
    {
      id: 1,
      title: 'React Development',
      description: 'Master modern React with hooks and state management',
      progress: 25,
      level: 'Intermediate',
    },
    {
      id: 2,
      title: 'Node.js Backend',
      description: 'Build scalable backend services with Node.js',
      progress: 10,
      level: 'Beginner',
    },
    {
      id: 3,
      title: 'UI/UX Design',
      description: 'Learn principles of user interface design',
      progress: 40,
      level: 'Advanced',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Recommended Skills</h2>
      <div className="space-y-6">
        {recommendedSkills.map((skill) => (
          <div key={skill.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{skill.title}</h3>
                <p className="text-gray-600">{skill.description}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill.level}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{skill.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${skill.progress}%` }}
                ></div>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Continue Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSkills; 