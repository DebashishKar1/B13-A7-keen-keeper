
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import friendsData from './data/friends.json';

// ====================== NAVBAR ======================
const Navbar = () => {
  const location = useLocation();
  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Timeline', path: '/timeline', icon: '⏱️' },
    { name: 'Stats', path: '/stats', icon: '📊' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-emerald-700 tracking-tight">KeenKeeper</Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-medium transition-all duration-200
                    ${isActive ? 'bg-emerald-700 text-white shadow-md' : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </div>
          <button className="md:hidden text-3xl text-gray-600">☰</button>
        </div>
      </div>
    </nav>
  );
};

// ====================== HOME PAGE ======================
const Banner = () => (
  <div className="bg-white py-16 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">Friends to keep close in your life</h1>
      <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.</p>
      <button onClick={() => toast.success('✅ Add a Friend clicked!')} className="mt-10 flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-lg px-8 py-4 rounded-2xl mx-auto shadow-lg transition-colors">
        <span className="text-2xl leading-none">+</span> Add a Friend
      </button>
    </div>
  </div>
);

const SummaryCards = () => {
  const cards = [
    { number: '10', label: 'Total Friends' },
    { number: '3', label: 'On Track' },
    { number: '6', label: 'Need Attention' },
    { number: '12', label: 'Interactions This Month' },
  ];
  return (
    <div className="max-w-7xl mx-auto px-6 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow">
            <h2 className="text-6xl font-bold text-emerald-700">{card.number}</h2>
            <p className="text-gray-500 mt-3 text-lg font-medium">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FriendsSection = ({ friends, loading }) => {
  if (loading) return <div className="max-w-7xl mx-auto px-6 py-20 text-center">Loading friends...</div>;
  
  const getStatusStyle = (status) => {
    if (status === 'overdue') return { label: 'Overdue', color: 'bg-red-500' };
    if (status === 'almost due') return { label: 'Almost Due', color: 'bg-amber-500' };
    return { label: 'On-Track', color: 'bg-emerald-700' };
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">Your Friends</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {friends.map((friend) => {
          const status = getStatusStyle(friend.status);
          return (
            <Link key={friend.id} to={`/friend/${friend.id}`} className="block">
              <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center hover:shadow-md transition-shadow">
                <img src={friend.picture} alt={friend.name} className="w-24 h-24 rounded-full object-cover mb-5 shadow-inner" />
                <h3 className="font-semibold text-xl text-gray-900 text-center">{friend.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{friend.days_since_contact}d ago</p>
                <div className="flex flex-wrap gap-2 justify-center mt-5 mb-8">
                  {friend.tags.map((tag, i) => <span key={i} className="bg-emerald-100 text-emerald-700 text-xs font-medium px-4 py-1 rounded-3xl">{tag}</span>)}
                </div>
                <div className={`mt-auto w-full text-center py-3 rounded-2xl text-white text-sm font-medium ${status.color}`}>{status.label}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// ====================== FRIEND DETAIL PAGE ======================

const FriendDetail = ({ timeline, setTimeline }) => {
  const { id } = useParams();
  const friend = friendsData.find(f => f.id === parseInt(id));

  if (!friend) return <div className="p-10 text-center text-xl">Friend not found</div>;

  const getStatusStyle = (status) => {
    if (status === 'overdue') return { label: 'Overdue', color: 'bg-red-500' };
    if (status === 'almost due') return { label: 'Almost Due', color: 'bg-amber-500' };
    return { label: 'On-Track', color: 'bg-emerald-700' };
  };

  const status = getStatusStyle(friend.status);

  // Updated addToTimeline function as per requirement
  const addToTimeline = (type) => {
    const newEntry = {
      id: Date.now(),
      type,
      name: friend.name,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
    };

    // Add to timeline
    setTimeline(prev => [newEntry, ...prev]);

    // Show success toast with proper message
    const action = type.charAt(0).toUpperCase() + type.slice(1);
    toast.success(`✅ ${action} with ${friend.name} added to Timeline`, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  // Action button handlers
  const handleSnooze = () => {
    toast.success(`⏰ ${friend.name} has been snoozed for 2 weeks`, {
      autoClose: 2500,
    });
  };

  const handleArchive = () => {
    toast.info(`📦 ${friend.name} has been archived`, {
      autoClose: 2500,
    });
  };

  const handleDelete = () => {
    toast.error(`🗑️ ${friend.name} has been deleted`, {
      autoClose: 3000,
      theme: "colored",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side - Profile Information */}
        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex flex-col items-center text-center">
            <img 
              src={friend.picture} 
              alt={friend.name} 
              className="w-40 h-40 rounded-2xl object-cover mb-6 shadow" 
            />
            <h1 className="text-3xl font-bold text-gray-900">{friend.name}</h1>
            <div className={`inline-block px-6 py-1 rounded-3xl text-white text-sm font-medium mt-3 ${status.color}`}>
              {status.label}
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {friend.tags.map((tag, i) => (
                <span key={i} className="bg-emerald-100 text-emerald-700 text-xs font-medium px-4 py-1.5 rounded-3xl">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-8 italic text-gray-500">"{friend.bio}"</p>
            <p className="mt-6 text-sm text-gray-400">Preferred: email</p>
            <p className="text-gray-600 font-medium">{friend.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 space-y-3">
            <button 
              onClick={handleSnooze}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 py-4 rounded-2xl text-gray-700 font-medium transition-all hover:shadow-sm"
            >
              ⏰ Snooze 2 Weeks
            </button>

            <button 
              onClick={handleArchive}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 py-4 rounded-2xl text-gray-700 font-medium transition-all hover:shadow-sm"
            >
              📦 Archive
            </button>

            <button 
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-3 bg-white border border-red-200 hover:border-red-300 py-4 rounded-2xl text-red-600 font-medium transition-all hover:shadow-sm"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 text-center shadow">
              <div className="text-4xl font-bold text-emerald-700">{friend.days_since_contact}</div>
              <div className="text-sm text-gray-500 mt-1">Days Since Contact</div>
            </div>
            <div className="bg-white rounded-3xl p-6 text-center shadow">
              <div className="text-4xl font-bold text-emerald-700">{friend.goal}</div>
              <div className="text-sm text-gray-500 mt-1">Goal (Days)</div>
            </div>
            <div className="bg-white rounded-3xl p-6 text-center shadow">
              <div className="text-4xl font-bold text-emerald-700">May 20</div>
              <div className="text-sm text-gray-500 mt-1">Next Due</div>
            </div>
          </div>

          {/* Relationship Goal */}
          <div className="bg-white rounded-3xl p-8 shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-xl">Relationship Goal</h3>
                <p className="text-emerald-700">
                  Connect every <span className="font-bold">{friend.goal} days</span>
                </p>
              </div>
              <button 
                onClick={() => toast.success("✅ Relationship goal updated")}
                className="px-5 py-2 text-sm border border-gray-300 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Quick Check-In - Main Requirement */}
          <div className="bg-white rounded-3xl p-8 shadow">
            <h3 className="font-semibold text-xl mb-6">Quick Check-In</h3>
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => addToTimeline('call')} 
                className="flex flex-col items-center py-8 hover:bg-emerald-50 rounded-2xl transition-all hover:scale-105"
              >
                📞
                <span className="text-sm mt-3 font-medium">Call</span>
              </button>

              <button 
                onClick={() => addToTimeline('text')} 
                className="flex flex-col items-center py-8 hover:bg-emerald-50 rounded-2xl transition-all hover:scale-105"
              >
                💬
                <span className="text-sm mt-3 font-medium">Text</span>
              </button>

              <button 
                onClick={() => addToTimeline('video')} 
                className="flex flex-col items-center py-8 hover:bg-emerald-50 rounded-2xl transition-all hover:scale-105"
              >
                📹
                <span className="text-sm mt-3 font-medium">Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================== 404 PAGE (Perfect Version) ======================
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-lg text-center">
        <div className="text-[160px] leading-none mb-6">🤔</div>
        
        <h1 className="text-8xl font-bold text-gray-900 mb-3 tracking-tighter">404</h1>
        <h2 className="text-4xl font-semibold text-gray-700 mb-8">Page Not Found</h2>
        
        <p className="text-gray-500 text-xl mb-12">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 
                     text-white font-semibold text-lg px-12 py-5 rounded-3xl 
                     transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          ← Back to Home
        </Link>

        <p className="mt-16 text-sm text-gray-400">
          KeenKeeper • Keeping your friendships alive
        </p>
      </div>
    </div>
  );
};



const TimelinePage = ({ timeline }) => {
  const [filter, setFilter] = useState('all');

  const filteredTimeline = filter === 'all' 
    ? timeline 
    : timeline.filter(item => item.type === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Timeline</h1>

      <div className="mb-8">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-300 rounded-2xl px-5 py-3 text-sm">
          <option value="all">All Interactions</option>
          <option value="call">Call Only</option>
          <option value="text">Text Only</option>
          <option value="video">Video Only</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredTimeline.map((entry) => (
          <div key={entry.id} className="bg-white rounded-3xl shadow-sm p-6 flex items-center gap-4">
            <div className="text-3xl">
              {entry.type === 'call' && '📞'}
              {entry.type === 'text' && '💬'}
              {entry.type === 'video' && '📹'}
            </div>
            <div className="flex-1">
              <div className="font-medium text-lg">
                {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} with {entry.name}
              </div>
              <div className="text-gray-500 text-sm">{entry.date}</div>
            </div>
          </div>
        ))}
        {filteredTimeline.length === 0 && <p className="text-center text-gray-500 py-10">No interactions yet</p>}
      </div>
    </div>
  );
};

// ====================== FOOTER ======================
const Footer = () => (
  <footer className="bg-[#0A3D33] text-white mt-auto">
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-6xl font-bold tracking-[-2px]">KeenKeeper</h2>
        <p className="mt-6 text-emerald-100 max-w-md text-lg leading-relaxed">Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.</p>
        <div className="mt-14">
          <p className="text-emerald-200 uppercase text-sm tracking-[3px] font-medium mb-6">Social Links</p>
          <div className="flex gap-6">
            <a href="#" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A3D33" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#0A3D33"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#0A3D33"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.638 7.584H0L8.31 12.12 0 1.153h7.644l5.3 7.01 6.957-7.01z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-emerald-700/60">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-emerald-300">
        <p>© 2026 KeenKeeper. All rights reserved.</p>
        <div className="flex gap-8 mt-5 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);



// ====================== STATS / FRIENDSHIP ANALYTICS PAGE ======================
const StatsPage = ({ timeline }) => {
  // Count interactions
  const callCount = timeline.filter(item => item.type === 'call').length;
  const textCount = timeline.filter(item => item.type === 'text').length;
  const videoCount = timeline.filter(item => item.type === 'video').length;

  const pieData = [
    { name: 'Calls', value: callCount, fill: '#10b981' },   // emerald-500
    { name: 'Texts', value: textCount, fill: '#34d399' },   // emerald-400
    { name: 'Videos', value: videoCount, fill: '#059669' }, // emerald-600
  ].filter(item => item.value > 0); // 0 count এর slice লুকাবে

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Friendship Analytics Heading */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Friendship Analytics</h1>
        <p className="text-gray-500 mt-2 text-lg">Overview of your interactions with friends</p>
      </div>

      {/* Pie Chart Card */}
      <div className="bg-white rounded-3xl shadow-sm p-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Interaction Breakdown</h2>
        
        <div className="h-96 flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}     // Donut style
                  outerRadius={160}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "30px", fontSize: "15px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            /* Empty State */
            <div className="text-center">
              <div className="text-7xl mb-6">📊</div>
              <h3 className="text-2xl font-medium text-gray-400">No interactions yet</h3>
              <p className="text-gray-500 mt-3 max-w-xs mx-auto">
                Start adding Calls, Texts or Video calls from friend detail page to see analytics here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Optional: Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
          <div className="text-5xl font-bold text-emerald-600">{callCount}</div>
          <div className="mt-3 text-gray-600 font-medium">Total Calls</div>
        </div>
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
          <div className="text-5xl font-bold text-emerald-600">{textCount}</div>
          <div className="mt-3 text-gray-600 font-medium">Total Texts</div>
        </div>
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
          <div className="text-5xl font-bold text-emerald-600">{videoCount}</div>
          <div className="mt-3 text-gray-600 font-medium">Total Video Calls</div>
        </div>
      </div>
    </div>
  );
};
              
   
   


// ====================== MAIN APP ======================
function App() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <SummaryCards />
              <FriendsSection friends={friendsData} loading={loading} />
            </>
          } />
          <Route path="/timeline" element={<TimelinePage timeline={timeline} />} />
          
          {/* Updated Stats Route */}
          <Route path="/stats" element={<StatsPage timeline={timeline} />
        } 
       />
          
          <Route path="/friend/:id" element={<FriendDetail timeline={timeline} setTimeline={setTimeline} />} />
        
        {/* 404 Page - Footer ছাড়া */}
        <Route path="*" element={<NotFound />} />
        </Routes>

     {/* Show the footer on all pages except the 404 page. */}
               {/*  ToastContainer  */}
        <ToastContainer 
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />




        <Routes>
          <Route path="*" element={null} />           {/* 404 এ Footer বাদ */}
          <Route path="/friend/:id" element={<Footer />} />
          <Route path="/timeline" element={<Footer />} />
          <Route path="/stats" element={<Footer />} />
          <Route path="/" element={<Footer />} />
        </Routes>
      </div>
    </Router>
        
  );
}

export default App;