// src/pages/PostComments.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import API from "../api";

interface Comment {
  _id: string;
  commenter: string;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  author: string;
}

export default function PostComments() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const postRes = await API.get(`/posts/${id}`);
        setPost(postRes.data);

        const commentsRes = await API.get(`/posts/${id}/comments`);
        setComments(commentsRes.data);
      } catch (err) {
        console.error("Failed to fetch post comments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center text-text-secondary p-20">
        Loading comments...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center text-text-secondary p-20">
        Post not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-indigo-500 via-pink-400 to-purple-500 rounded-xl shadow-2xl animate-fadeInUp relative overflow-hidden">
      <Link
        to="/posts"
        className="text-white font-bold hover:underline transition duration-300 flex items-center gap-1"
      >
        &larr; Back to Posts
      </Link>

      <h1 className="text-4xl font-extrabold text-white mt-4">{post.title}</h1>
      <p className="text-white/80 italic mb-6">
        By <span className="font-semibold text-white">{post.author}</span>
      </p>

      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <MessageSquare size={20} /> Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="text-white/80">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li
                key={c._id}
                className="p-4 bg-white/80 rounded-lg border border-white/30 shadow-lg hover:scale-105 transform transition duration-300"
              >
                <p className="font-bold text-purple-700">{c.commenter}</p>
                <p className="text-gray-900 mt-1">{c.text}</p>
                <p className="text-xs text-gray-700 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
