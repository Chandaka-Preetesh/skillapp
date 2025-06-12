import React, { useState, useEffect } from 'react';
import DashboardNavBar from '../components/dashboard/DashboardNavBar';

const DoubtsPage = () => {
  const [doubts, setDoubts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [filterTopic, setFilterTopic] = useState('All');
  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [replies, setReplies] = useState({});
const [replyInput, setReplyInput] = useState({});
const [activeReplyBox, setActiveReplyBox] = useState(null);


  const sampleTopics = ['React', 'DBMS', 'JavaScript'];

  const sampleDoubts = [
    {
      id: 1,
      title: 'How does useEffect work?',
      description: 'Explain the dependency array in useEffect.',
      topic: 'React',
      author: 'You',
    },
    {
      id: 2,
      title: 'Normalization types?',
      description: 'What are the types of normalization in DBMS?',
      topic: 'DBMS',
      author: 'Alice',
    },
  ];

  useEffect(() => {
    setTopics(['All', ...sampleTopics]);
  }, []);

  useEffect(() => {
    fetchDoubts(filterTopic);
  }, [filterTopic]);

  const fetchDoubts = (topicFilter = '') => {
    let filtered = [...sampleDoubts];
    if (topicFilter && topicFilter !== 'All') {
      filtered = filtered.filter((d) => d.topic === topicFilter);
    }
    setDoubts(filtered);
  };

  const handlePostDoubt = (e) => {
    e.preventDefault();
    const newDoubt = {
      id: Date.now(),
      title,
      description,
      topic,
      author: 'You',
    };
    setDoubts((prev) => [newDoubt, ...prev]);
    setTitle('');
    setDescription('');
    setTopic('');
    setShowForm(false);
  };

  return (
    <>
      <DashboardNavBar />
     
      {/* Ask a Doubt Form - Conditionally Visible */}
      {showForm && (
        <div className="bg-white shadow-md border-b px-6 py-4 mt-20 pt-20">
          <form onSubmit={handlePostDoubt} className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-xl font-bold">Ask a Doubt</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              rows={4}
              required
            />
            <input
              type="text"
              placeholder="Topic (e.g., React, DBMS)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <div className="flex gap-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Post
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content */}
      <div className="flex p-6 gap-6 pt-20">
        {/* Left Panel */}
        <div className="w-1/3 border-r pr-4">
          <h2 className="text-xl font-semibold mb-4">Your Doubts</h2>
          {doubts.filter((d) => d.author === 'You').map((d) => (
            <div key={d.id} className="mb-3 border rounded p-2 bg-gray-50 shadow">
              <h3 className="font-semibold">{d.title}</h3>
              <p className="text-sm text-gray-600">{d.topic}</p>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="w-2/3">
          <div className="flex justify-between items-center mb-6">
            <div>
              <label className="mr-2 font-semibold">Filter by Topic:</label>
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="border p-2 rounded"
              >
                {topics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              + Post Doubt
            </button>
          </div>

          {/* Doubts List */}
          <div className="space-y-6">
         {doubts.map((doubt) => (
  <div key={doubt.id} className="border p-4 rounded shadow">
    <h3 className="text-lg font-semibold">{doubt.title}</h3>
    <p className="text-gray-700 mb-2">{doubt.description}</p>
    <p className="text-sm text-gray-500 mb-2">Topic: {doubt.topic}</p>

    {/* Replies Section */}
    {replies[doubt.id] && replies[doubt.id].length > 0 && (
      <div className="bg-gray-50 p-3 rounded mt-3 space-y-2">
        {replies[doubt.id].map((rep, idx) => (
          <div key={idx} className="text-sm text-gray-800">
            <span className="font-medium">You:</span> {rep}
          </div>
        ))}
      </div>
    )}

    {/* Reply Input */}
    {activeReplyBox === doubt.id ? (
      <div className="mt-3 space-y-2">
        <textarea
          rows={2}
          value={replyInput[doubt.id] || ''}
          onChange={(e) =>
            setReplyInput((prev) => ({ ...prev, [doubt.id]: e.target.value }))
          }
          className="w-full border p-2 rounded"
          placeholder="Write your reply..."
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (replyInput[doubt.id]) {
                setReplies((prev) => ({
                  ...prev,
                  [doubt.id]: [...(prev[doubt.id] || []), replyInput[doubt.id]],
                }));
                setReplyInput((prev) => ({ ...prev, [doubt.id]: '' }));
                setActiveReplyBox(null);
              }
            }}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Post Reply
          </button>
          <button
            onClick={() => setActiveReplyBox(null)}
            className="bg-gray-300 text-black px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={() => setActiveReplyBox(doubt.id)}
        className="mt-2 text-blue-600 text-sm underline"
      >
        Reply
      </button>
    )}
  </div>
))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DoubtsPage;
