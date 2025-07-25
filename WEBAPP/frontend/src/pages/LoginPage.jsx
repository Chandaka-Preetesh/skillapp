import { LoginForm } from "../components/login-form";
import { motion } from "framer-motion";
import Navbar from "../components/ui/Navbar";

export default function LoginPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-md mx-auto"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Welcome Back
            </h1>
            <p className="mt-2 text-gray-600">
              Sign in to continue your learning journey
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 