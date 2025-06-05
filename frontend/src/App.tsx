import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import IntraConnect from './pages/IntraConnect';
import Blog from './pages/Blog';
import Files from './pages/Files';
import AdminPanel from './pages/AdminPanel';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isLoggedIn, currentUser } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/intraconnect" replace />;
  }

  if (requireAdmin && currentUser?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                ) : (
                  <Navigate to="/intraconnect" replace />
                )
              }
            />
            <Route path="/intraconnect" element={<IntraConnect />} />
            <Route
              path="/blog"
              element={
                <ProtectedRoute>
                  <Blog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/files"
              element={
                <ProtectedRoute>
                  <Files />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 