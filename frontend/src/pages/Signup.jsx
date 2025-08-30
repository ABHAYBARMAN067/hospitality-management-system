import React from "react";

const Signup = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-lg"
          />
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-red-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
