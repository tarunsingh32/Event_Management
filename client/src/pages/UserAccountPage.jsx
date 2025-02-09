import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

export default function UserAccountPage() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg text-center">
        <img
          src="../src/assets/hero.jpg"
          alt="User Avatar"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-4 border-4 border-blue-500"
        />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h2>
        <p className="text-gray-600 text-sm md:text-base">This is your account dashboard.</p>
      </div>
    </div>
  );
}
