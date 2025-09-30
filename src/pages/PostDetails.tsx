/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { MessageSquare, User } from "lucide-react";

interface Comment {
  _id: string;
  commenter: string;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState({ commenter: "", text: "" });
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsPostLoading(true);
      try {
        const postRes = await API.get(`/posts/${id}`);
        setPost(postRes.data);

        const commentsRes = await API.get(`/posts/${id}/comments`);
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Failed to load post:", error);
      } finally {
        setIsPostLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.commenter || !form.text) return;

    setIsCommentLoading(true);
    try {
      await API.post(`/posts/${id}/comments`, form);
      setForm({ commenter: "", text: "" });
      const res = await API.get(`/posts/${id}/comments`);
      setComments(res.data);
      setShowComments(true);
    } catch (err) {
      alert("Failed to add comment.");
    } finally {
      setIsCommentLoading(false);
    }
  };

  if (isPostLoading)
    return (
      <div className="text-center text-text-secondary p-20">
        Loading post...
      </div>
    );
  if (!post)
    return (
      <div className="text-center text-text-secondary p-20">
        Post not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-500 rounded-2xl shadow-2xl border border-white/20 animate-fadeInUp space-y-10 relative overflow-hidden">
      {/* Post Details */}
      <article className="space-y-4">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
          {post.title}
        </h1>
        <p className="text-white/80 italic">
          By{" "}
          <span className="font-semibold text-yellow-300">{post.author}</span>{" "}
          on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <textarea
          readOnly
          value={post.content}
          rows={10}
          className="w-full p-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white focus:outline-none resize-none shadow-inner"
        />
      </article>

      {/* Comment Form */}
      <div className="space-y-4 bg-white/10 p-6 rounded-xl border border-white/30 shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare size={20} /> 💬 Add a Comment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="commenter"
            placeholder="Your Name"
            value={form.commenter}
            onChange={handleChange}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder-white/70 bg-white/20 text-white"
            required
          />
          <textarea
            name="text"
            placeholder="Your comment..."
            value={form.text}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder-white/70 bg-white/20 text-white"
            required
          />
          <button
            type="submit"
            disabled={isCommentLoading}
            className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg text-white ${
              isCommentLoading
                ? "bg-yellow-300/60 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            {isCommentLoading ? "Submitting..." : "Add Comment"}
          </button>
        </form>
      </div>

      {/* Comments Section */}
      <div>
        <button
          onClick={() => setShowComments(!showComments)}
          className="bg-white/20 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-white/30 transition duration-300 flex items-center gap-2"
        >
          <MessageSquare size={18} /> Comments ({comments.length})
        </button>

        {showComments && (
          <ul className="mt-6 space-y-4">
            {comments.length > 0 ? (
              comments.map((c) => (
                <li
                  key={c._id}
                  className="p-4 bg-white/20 rounded-xl border border-white/30 shadow-inner backdrop-blur-sm hover:scale-[1.02] transform transition duration-300"
                >
                  <p className="font-bold text-yellow-300 flex items-center gap-2">
                    <User size={16} /> {c.commenter}
                  </p>
                  <p className="text-white mt-1">{c.text}</p>
                  <p className="text-xs text-white/70 mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </li>
              ))
            ) : (
              <p className="mt-4 text-white/70">
                No comments yet. Be the first to comment!
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
