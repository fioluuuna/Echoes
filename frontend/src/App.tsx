import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookLayout as Layout } from './components/common/BookLayout';
import { HomePage } from './pages/HomePage';
import { ResultPage } from './pages/ResultPage';
import { LoginPage } from './pages/LoginPage';
import { GardenPage } from './pages/GardenPage';
import { TimelinePage } from './pages/TimelinePage';

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // temporarily bypass auth to show the 3D book cover directly
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

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
