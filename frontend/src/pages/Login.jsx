import React from "react";

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form className="space-y-4">
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
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
