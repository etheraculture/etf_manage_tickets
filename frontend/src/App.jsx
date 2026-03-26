import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import RegistrationSuccess from './pages/RegistrationSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminScuole from './pages/AdminScuole';
import AdminCheckin from './pages/AdminCheckin';
import AdminScansioni from './pages/AdminScansioni';
import AdminLayout from './components/AdminLayout';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('ethera_admin_token');
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Pagina pubblica */}
      <Route path="/" element={<RegistrationForm />} />
      <Route path="/success" element={<RegistrationSuccess />} />

      {/* Admin login */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Admin protette */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scuole"
        element={
          <ProtectedRoute>
            <AdminLayout><AdminScuole /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/checkin"
        element={
          <ProtectedRoute>
            <AdminLayout><AdminCheckin /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scansioni"
        element={
          <ProtectedRoute>
            <AdminLayout><AdminScansioni /></AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
