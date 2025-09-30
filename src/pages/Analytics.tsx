/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import API from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Users, TrendingUp, MessageSquare } from "lucide-react";

interface AuthorAnalytics {
  _id: string;
  postCount: number;
}

export default function Analytics() {
  const [authors, setAuthors] = useState<AuthorAnalytics[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [postsPerDay, setPostsPerDay] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [authorsRes, topPostsRes, perDayRes] = await Promise.all([
          API.get("/analytics/authors"),
          API.get("/analytics/top-posts"),
          API.get("/analytics/posts-per-day"),
        ]);
        setAuthors(authorsRes.data);
        setTopPosts(topPostsRes.data);
        setPostsPerDay(perDayRes.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="animate-fadeInUp space-y-10">
      <h1 className="text-4xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-indigo-500 to-purple-500 mb-8">
        Blog Analytics Dashboard
      </h1>

      <div className="bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-500 p-6 rounded-xl shadow-2xl border border-white/30 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <Users size={20} /> Top Authors
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/30">
            <thead>
              <tr>
                <th className="p-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Author
                </th>
                <th className="p-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Posts Published
                </th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a, idx) => (
                <tr
                  key={a._id}
                  className={`${
                    idx % 2 === 0 ? "bg-white/10" : "bg-white/5"
                  } hover:bg-white/20 transition duration-200`}
                >
                  <td className="p-4 font-semibold text-white">{a._id}</td>
                  <td className="p-4 font-bold text-yellow-300">
                    {a.postCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Posts Per Day Chart */}
      <div className="bg-gradient-to-r from-indigo-400 via-pink-300 to-purple-400 p-6 rounded-xl shadow-2xl border border-white/30 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <TrendingUp size={20} />  Posts Per Day (Last 7 Days)
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={postsPerDay}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="white/20" />
              <XAxis dataKey="_id" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #fff",
                  borderRadius: "6px",
                  color: "#F3F4F6",
                }}
                formatter={(value: number) => [`${value} Posts`, "Count"]}
              />
              <Bar
                dataKey="count"
                fill="#F472B6"
                radius={[6, 6, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Commented Posts */}
      <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 p-6 rounded-xl shadow-2xl border border-white/30 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <MessageSquare size={20} />  Top 5 Most Commented Posts
        </h2>
        <ul className="space-y-3">
          {topPosts.map((p) => (
            <li
              key={p._id}
              className="p-3 bg-white/80 rounded-lg flex justify-between items-center border-l-4 border-yellow-300 hover:scale-105 transform transition duration-300 shadow-lg"
            >
              <p className="font-medium text-purple-700">{p.post.title}</p>
              <span className="text-sm font-bold text-yellow-400 px-3 py-1 rounded-full bg-white/20">
                {p.commentCount} comments
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
