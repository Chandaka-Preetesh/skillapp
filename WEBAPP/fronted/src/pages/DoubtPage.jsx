import React from 'react';
import DashboardNavBar from '../components/dashboard/DashboardNavBar';
import axios from '../utils/axios.js';
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import StarRating from '../components/StarRating';

const Doubts = () => {
    const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [myDoubts, setMyDoubts] = useState([]);
  const [expandedDoubt, setExpandedDoubt] = useState(null);
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    topic: ''
  });

  // Fetch all data on component mounting
console.log("doubts component rendering");
 useEffect(() => {
  const fetchAndUpdateDoubts = async () => {
    try {
      setIsLoading(true);

      const doubtsResponse = await axios.get('/api/doubtplace/doubts');
      const topicsResponse = await axios.get('/api/doubtplace/topics');
      const myDoubtsResponse = await axios.get('/api/doubtplace/my-doubts');

      setDoubts(doubtsResponse.data);
      setTopics(topicsResponse.data);
      setMyDoubts(myDoubtsResponse.data);
      console.log("response sent from api calls")
      console.log(doubtsResponse.data);
      console.log(topicsResponse.data);
      console.log(myDoubtsResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error while getting doubts details or updating activities:', error);
      localStorage.clear();
      setIsLoading(false);
      navigate('/login', { replace: true });
    }
  };

  fetchAndUpdateDoubts();
}, [navigate]);

  // Filter doubts by topic
  const filteredDoubts = selectedTopic
    ? doubts.filter(doubt => doubt.topic === selectedTopic)
    : doubts;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/doubtplace/doubts', formData);
      console.log("while submission")
      console.log(formData);
      setDoubts(prev => [response.data, ...prev]);
      setMyDoubts(prev => [response.data, ...prev]);
      setShowPostForm(false);
      setFormData({
        title: '',
        question: '',
        topic: ''
      });
    } catch (err) {
      console.error('Error creating doubt:', err);
      setError('Failed to create doubt. Please try again.');
    }
  };

  // Handle doubt expansion to show replies
  const handleExpandDoubt = async (doubtid) => {
    if (expandedDoubt === doubtid) {
      setExpandedDoubt(null);
      return;
    }

    try {
      const response = await axios.get(`/api/doubtplace/doubts/${doubtid}/replies`);
      console.log(response.data);
      setReplies(prev => ({
        ...prev,
        [doubtid]: response.data
      }));
      setExpandedDoubt(doubtid);
    } catch (err) {
      console.error('Error fetching replies:', err);
      setError('Failed to load replies. Please try again.');
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (doubtid) => {
    if (!replyText.trim()) return;

    try {
      const response = await axios.post(`/api/doubtplace/doubts/${doubtid}/replies`, {
        reply: replyText
      });
      
      // Update replies for this doubt
      setReplies(prev => ({
        ...prev,
        [doubtid]: Array.isArray(response.data) ? response.data : []
      }));
      
      setReplyText('');
    } catch (err) {
      console.error('Error posting reply:', err);
      setError('Failed to post reply. Please try again.');
    }
  };

  // Check if user is the creator of a doubt
  const isCreator = (doubt) => {
    return myDoubts.some(myDoubt => myDoubt.userid === doubt.userid);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavBar />
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Doubts & Questions</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {showPostForm ? 'Cancel' : 'Ask New Question'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Post Doubt Form */}
        {showPostForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Ask a New Question</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="topic">
                    Topic
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a topic</option>
                    {topics.map(topic => (
                      <option key={topic.topicid} value={topic.topic_name}>
                        {topic.topic_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="question">
                  Question
                </label>
                <textarea
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium text-gray-700">Filter by Topic:</span>
            <button
              onClick={() => setSelectedTopic('')}
              className={`px-3 py-1 rounded-full text-sm ${!selectedTopic ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              All Topics
            </button>
            {topics.map( (topic,index) => (
              <button
                key={index}
                onClick={() => setSelectedTopic(topic.topic_name)}
                className={`px-3 py-1 rounded-full text-sm ${selectedTopic === topic.topic_name ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {topic.topic_name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content with 2-column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - My Questions (30%) */}
          <div className="lg:w-3/10">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">My Questions</h2>
              {myDoubts.length > 0 ? (
                <div className="space-y-4">
                  {myDoubts.map(doubt => (
                    <div key={doubt.doubtid} className="border-b pb-3 last:border-0">
                      <h3 className="font-medium text-gray-800">{doubt.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">{doubt.topic || 'General'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{formatDate(doubt.createdat)}</span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          Asked
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">You haven't asked any questions yet.</p>
              )}
            </div>
          </div>

          {/* Center - All Doubts (70%) */}
          <div className="lg:w-7/10">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredDoubts.length > 0 ? (
              <div className="space-y-6">
                {filteredDoubts.map( (doubt,index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                            {doubt.topic || 'General'}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800">{doubt.title}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{formatDate(doubt.createdat)}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{doubt.question}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-2">
                            {doubt.author_avatar ? (
                              <img src={doubt.author_avatar} alt={doubt.author} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-medium text-gray-600">
                                {doubt.author?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{doubt.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCreator(doubt) ? (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                              My Question
                            </span>
                          ) : null}
                          <button
                            onClick={() => handleExpandDoubt(doubt.doubtid)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            {expandedDoubt === doubt.doubtid ? 'Hide Replies' : 'View Replies'}
                          </button>
                        </div>
                      </div>

                      {/* Replies Section */}
                      {expandedDoubt === doubt.doubtid && (
                        <div className="mt-6 border-t pt-4">
                          <h4 className="text-lg font-semibold mb-4">Replies</h4>
                          
                          {/* Reply Form */}
                          {
                            <div className="mb-4">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              ></textarea>
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => handleReplySubmit(doubt.doubtid)}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                  Post Reply
                                </button>
                              </div>
                            </div>
                          }

                          {/* Existing Replies */}
                          <div className="space-y-4">
                            {replies[doubt.doubtid]?.length > 0 ? (
                              replies[doubt.doubtid].map( (reply,index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-2">
                                        <span className="text-xs font-medium text-gray-600">
                                          {reply.author?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                      </div>
                                      <span className="text-sm font-medium text-gray-700">{reply.author}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{formatDate(reply.createdat)}</span>
                                    <StarRating 
                                    initialIsLiked={reply.is_liked}
                                    initialRating={reply.rating}
                                    replyid={reply.doubt_replies_id}
                                    />
                                    {console.log(reply)}
                                    {console.log(" replyReceived")}
                                  </div>
                                  <p className="text-gray-600">{reply.reply}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-center py-4">No replies yet. Be the first to help!</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions found</h3>
                <p className="text-gray-500">
                  {selectedTopic ? `No questions available for ${selectedTopic}. Try another topic or be the first to ask one!` : 'No questions available yet. Be the first to ask a question!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doubts;