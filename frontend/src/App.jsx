import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import RegistrationSuccess from './pages/RegistrationSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminScuole from './pages/AdminScuole';
import AdminCheckin from './pages/AdminCheckin';
import AdminScansioni from './pages/AdminScansioni';
import AdminStudenti from './pages/AdminStudenti';
import AdminLayout from './components/AdminLayout';
import PrivacyPolicy from './pages/PrivacyPolicy';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('ethera_admin_token');
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}

function AdminRoute() {
  const token = localStorage.getItem('ethera_admin_token');
  if (token) return <Navigate to="/admin/dashboard" replace />;
  return <AdminLogin />;
}

export default function App() {
  return (
    <Routes>
      {/* Pagina pubblica */}
      <Route path="/eft_2026" element={<RegistrationForm />} />
      <Route path="/" element={<Navigate to="/eft_2026" replace />} />
      <Route path="/success" element={<RegistrationSuccess />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Admin login */}
      <Route path="/admin" element={<AdminRoute />} />

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
        path="/admin/studenti"
        element={
          <ProtectedRoute>
            <AdminLayout><AdminStudenti /></AdminLayout>
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
      <Route path="*" element={<Navigate to="/eft_2026" replace />} />
    </Routes>
  );
}
