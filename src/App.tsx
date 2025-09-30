import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LogOut,
  BookOpen,
  BarChart2,
  PlusCircle,
  UserPlus,
  User,
} from "lucide-react";
import AddPost from "./pages/AddPost";
import PostsList from "./pages/PostsList";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import PostComments from "./pages/PostComments";

function Navbar({
  isAuthenticated,
  onSignOut,
}: {
  isAuthenticated: boolean;
  onSignOut: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 text-white p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
          The Blog Hub <span className="inline-block animate-bounce">✍️</span>
        </h1>

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div className="hidden md:flex gap-6 items-center">
          {!isAuthenticated ? (
            <>
              <Link
                to="/register"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <UserPlus size={18} /> Register
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <User size={18} /> Login
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <PlusCircle size={18} /> Add Post
              </Link>
              <Link
                to="/posts"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <BookOpen size={18} /> All Posts
              </Link>
              <Link
                to="/analytics"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <BarChart2 size={18} /> Analytics
              </Link>
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-glow transition duration-300"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="flex flex-col gap-4 mt-4 md:hidden">
          {!isAuthenticated ? (
            <>
              <Link
                to="/register"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <UserPlus size={18} /> Register
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <User size={18} /> Login
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <PlusCircle size={18} /> Add Post
              </Link>
              <Link
                to="/posts"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <BookOpen size={18} /> All Posts
              </Link>
              <Link
                to="/analytics"
                className="flex items-center gap-1 hover:text-yellow-300 transition"
              >
                <BarChart2 size={18} /> Analytics
              </Link>
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-glow transition duration-300"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />

      <main className="p-8 container mx-auto">
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? <AddPost /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/posts"
            element={
              isAuthenticated ? <PostsList /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/analytics"
            element={
              isAuthenticated ? <Analytics /> : <Navigate to="/login" replace />
            }
          />

          {/* Public routes */}
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/posts/:id/comments" element={<PostComments />} />
          <Route
            path="/register"
            element={<Register onAuth={() => setIsAuthenticated(true)} />}
          />
          <Route
            path="/login"
            element={<Login onAuth={() => setIsAuthenticated(true)} />}
          />

          {/* Default redirect for unknown paths */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/posts" : "/login"} replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default AppWrapper;
