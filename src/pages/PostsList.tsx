import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { MessageSquare, NotebookPen } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  commentCount: number;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [author, setAuthor] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await API.get("/posts", {
          params: { author: author || undefined, page, limit },
        });
        setPosts(res.data.posts);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [author, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="animate-fadeInUp space-y-8">
      <h2 className="text-4xl font-extrabold drop-shadow-lg pb-2 flex items-center gap-3">
        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 bg-clip-text ">
          <NotebookPen size={24} />
        </span>
        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
          Recent Blog Posts
        </span>
      </h2>

      {/* Author Filter */}
      <input
        type="text"
        placeholder=" Filter posts by author name..."
        value={author}
        onChange={(e) => {
          setAuthor(e.target.value);
          setPage(1);
        }}
        className="p-3 text-gradient placeholder-black/60 rounded-xl w-full max-w-lg border-2 border-yellow-400/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300 backdrop-blur-sm"
      />

      {isLoading && (
        <div className="text-center text-white/70 p-10 animate-pulse">
          Loading posts...
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <div
              key={post._id}
              style={{ animationDelay: `${index * 0.05}s` }}
              className="p-6 rounded-2xl flex flex-col justify-between border border-white/20 bg-gradient-to-br from-purple-500 via-pink-400 to-indigo-500 shadow-xl hover:shadow-2xl transform hover:scale-[1.03] transition duration-300 animate-fadeInUp relative overflow-hidden"
            >
              <span className="absolute top-[-20px] left-[-20px] w-20 h-20 rounded-full bg-white/10 animate-bubble"></span>
              <span className="absolute bottom-[-30px] right-[-30px] w-32 h-32 rounded-full bg-white/10 animate-bubble animation-delay-2000"></span>

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white hover:text-yellow-300 transition duration-300 mb-2">
                  {post.title}
                </h3>
                <p className="text-white/80 italic mb-3">
                  By{" "}
                  <span className="font-semibold text-yellow-300">
                    {post.author}
                  </span>
                </p>
                <p className="text-white/70 line-clamp-3 mb-4">
                  {post.content}
                </p>
              </div>

              <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/30 relative z-10">
                <Link
                  to={`/posts/${post._id}/comments`}
                  className="flex items-center gap-1 text-white/90 hover:text-yellow-300 font-medium transition duration-300"
                >
                  <MessageSquare size={16} /> {post.commentCount} Comments
                </Link>

                <Link
                  to={`/posts/${post._id}`}
                  className="text-white/90 hover:text-yellow-300 font-medium hover:underline transition duration-300"
                >
                  Read Full Post &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <p className="text-center text-white/70 p-10 bg-white/10 rounded-xl animate-fadeInUp">
          No posts found for the current filter/page.
        </p>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1 || isLoading}
          className="px-6 py-2 bg-pink-400 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition duration-200"
        >
          &larr; Previous
        </button>

        <span className="text-white px-4 py-2 text-gradient rounded-full border border-white/30 font-medium">
          Page {page} of {totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages || isLoading}
          className="px-6 py-2 bg-pink-500 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition duration-200"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
