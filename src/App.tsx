import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Board = React.lazy(() => import('./components/Board/Board'));
const PostDetail = React.lazy(() => import('./components/Board/PostDetail'));
const PostForm = React.lazy(() => import('./components/Board/PostForm'));
const Charts = React.lazy(() => import('./components/Charts/Charts'));
const AdminPanel = React.lazy(() => import('./components/Admin/AdminPanel'));

const SuspenseFallback = () => (
  <div className="flex items-center justify-center min-h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/posts" replace />} />
        <Route path="posts" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <Board />
          </React.Suspense>
        } />
        <Route path="posts/:id" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <PostDetail />
          </React.Suspense>
        } />
        <Route path="posts/new" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <PostForm />
          </React.Suspense>
        } />
        <Route path="posts/edit/:id" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <PostForm />
          </React.Suspense>
        } />
        <Route path="charts" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <Charts />
          </React.Suspense>
        } />
        <Route path="admin" element={
          <React.Suspense fallback={<SuspenseFallback />}>
            <AdminPanel />
          </React.Suspense>
        } />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;