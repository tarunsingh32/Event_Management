import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";  // For smooth animations

const VerificationContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/contact-support", formData);
      setMessage("✅ Your request has been sent. Our support team will contact you soon.");
      setFormData({ name: "", email: "", issue: "" });
    } catch (error) {
      setMessage("❌ Failed to send request. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-2">🔍 Need Help with Verification?</h1>
        <p className="text-gray-500 text-center mb-6">Fill out the form below, and we'll assist you as soon as possible.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Describe Your Issue:</label>
            <textarea
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 h-21"
              placeholder="Describe the issue you are facing..."
              required
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Submit Request
          </motion.button>

          {message && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center mt-4 font-semibold"
            >
              {message}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default VerificationContact;
