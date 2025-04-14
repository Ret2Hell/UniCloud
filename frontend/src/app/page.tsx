import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg">
        UniCloud
      </h1>
      <div className="flex space-x-4 mt-8">
        <Link href="/login">
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition duration-300">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition duration-300">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
