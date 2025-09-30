/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { User } from "lucide-react"; 

export default function Login({ onAuth }: { onAuth: () => void }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      onAuth();
      navigate("/");
    } catch (err: any) {
      alert(" Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-auto flex items-center justify-center p-4 ">
      <div className="w-full max-w-md bg-surface shadow-2xl rounded-3xl p-8 border border-border relative overflow-hidden bg-gradient-to-b from-purple-600 via-pink-500 to-indigo-400 ">
        {/* Animated Bubbles */}
        <span className="absolute -top-8 -left-8 w-32 h-32 bg-purple-400/20 rounded-full animate-bubbleSlow"></span>
        <span className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-400/20 rounded-full animate-bubbleSlow"></span>
        <span className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-400/20 rounded-full animate-bubbleSlow"></span>

        <div className="relative z-10  ">
          <h2 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent text-gradient flex items-center justify-center gap-2">
            <User size={28} /> Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5  ">
            <div>
              <label className="block mb-1 text-text-secondary font-medium">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-secondary transition duration-300"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-text-secondary font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-secondary transition duration-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full block bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 hover:from-purple-500 hover:via-pink-400 hover:to-indigo-300 text-white font-semibold rounded-lg px-4 py-3 transition duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-6 text-text-secondary relative z-10">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-primary font-medium cursor-pointer hover:underline transition duration-200"
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
