/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import API from "../api";

export default function AddPost() {
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/posts", form);
      console.log(" Post created:", res.data);
      alert(" Post added successfully!");
      setForm({ title: "", content: "", author: "" });
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert(" You must log in first before adding a post.");
      } else {
        alert(
          " Failed to add post: " + (err.response?.data?.message || err.message)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-500 shadow-2xl p-8 rounded-xl animate-fadeInUp relative overflow-hidden">
      <h2 className="text-3xl font-extrabold mb-6 text-white border-b border-white/50 pb-2 text-gradient">
        ✨ Create a New Blog Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 bg-white/80 border border-white/30 rounded-lg placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
          required
        />
        <textarea
          name="content"
          placeholder="Content..."
          value={form.content}
          onChange={handleChange}
          rows={8}
          className="w-full p-3 bg-white/80 border border-white/30 rounded-lg placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={form.author}
          onChange={handleChange}
          className="w-full p-3 bg-white/80 border border-white/30 rounded-lg placeholder-gray-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-glow transition duration-300 ${
            isLoading
              ? "bg-white/40 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 hover:scale-105 transform"
          }`}
        >
          {isLoading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
     
      <span className="bubble w-6 h-6 top-10 left-20"></span>
      <span className="bubble w-8 h-8 top-40 left-10"></span>
      <span className="bubble w-4 h-4 bottom-10 right-20"></span>
    </div>
  );
}
