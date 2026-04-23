import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookLayout as Layout } from './components/common/BookLayout';
import { HomePage } from './pages/HomePage';
import { ResultPage } from './pages/ResultPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { GardenPage } from './pages/GardenPage';
import { TimelinePage } from './pages/TimelinePage';

// Protected Route Wrapper - 未登录跳转到 /login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes inside Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result/:id"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/garden"
          element={
            <ProtectedRoute>
              <GardenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timeline"
          element={
            <ProtectedRoute>
              <TimelinePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;