import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/ui/Navbar";
import { Button } from "../components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();

  function goToLoginPage() {
    navigate("/login");
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      {/**/}    
      <div className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-100 to-transparent opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
          >
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-tight " >
               Share  Learn  Gain.
            </h1>
              <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-tight " >
              Earn Skill Coins.
              </h1>
            <p className="mt-8 text-lg text-gray-600 sm:text-xl md:text-2xl leading-relaxed">
              Join our innovative platform where you can trade skills and resources.
            </p>
              <p className="mt-8 text-lg text-gray-600 sm:text-xl md:text-2xl leading-relaxed">
              Vibrant community to resolve doubts.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Button 
                onClick={goToLoginPage} 
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Now
              </Button>

    {/*change navigatee to explore page later on*/}


              <Button 
                variant="outline" 
                onClick={() => navigate("/register")} 
                className="px-8 py-4 text-lg font-semibold border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transform hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Our Core Features
            </h2>
            <p className="text-xl text-gray-600">
              Discover what makes our platform unique and powerful
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Time-Based Exchange",
                description: "Trade your skills using our innovative time-banking system. Every hour you teach equals an hour you can learn.",
                icon: "⏱️",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Skill Marketplace",
                description: "Buy and sell premium courses, workshops, and one-on-one sessions. Monetize your expertise.",
                icon: "🛍️",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Community Hub",
                description: "Share experiences, ask questions, and connect with like-minded learners in our vibrant community forums.",
                icon: "👥",
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                title: "Gamified Learning",
                description: "Level up your profile, earn badges, and unlock achievements as you learn and teach new skills.",
                icon: "🏆",
                gradient: "from-pink-500 to-pink-600"
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className={`p-6 bg-gradient-to-r ${feature.gradient} group-hover:scale-105 transition-transform duration-300`}>
                  <div className="text-5xl mb-4 text-white">{feature.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: "10K+", label: "Active Users", gradient: "from-blue-600 to-blue-500" },
              { number: "50K+", label: "Skills Exchanged", gradient: "from-purple-600 to-purple-500" },
              { number: "100K+", label: "Learning Hours", gradient: "from-indigo-600 to-indigo-500" },
              { number: "4.9/5", label: "User Rating", gradient: "from-pink-600 to-pink-500" }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start your journey of skill exchange and growth in four simple steps
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Profile",
                description: "Set up your profile and list your skills and interests",
                icon: "👤",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                step: "2",
                title: "Connect",
                description: "Find users with matching skill interests or browse the marketplace",
                icon: "🤝",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                step: "3",
                title: "Exchange",
                description: "Trade time credits or purchase premium sessions",
                icon: "🔄",
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                step: "4",
                title: "Level Up",
                description: "Earn experience points and unlock achievements",
                icon: "⭐",
                gradient: "from-pink-500 to-pink-600"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={`bg-gradient-to-r ${item.gradient} w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 text-5xl text-white transform hover:scale-110 transition-all duration-300 shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{item.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-full w-full max-w-[100px] transform -translate-x-1/2">
                    <div className="border-t-2 border-dashed border-gray-300 w-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl mb-10 opacity-90">Join our community of learners and teachers today!</p>
            <Button 
              onClick={goToLoginPage} 
              className="px-10 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 