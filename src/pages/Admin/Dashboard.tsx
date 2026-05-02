import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminLayout from '../../components/AdminLayout';
import AdminProfile from './AdminProfile';
import AdminProjects from './AdminProjects';
import AdminExperiences from './AdminExperiences';
import AdminEducations from './AdminEducations';
import AdminSettings from './AdminSettings';

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-6 md:p-10">
          <Routes>
            <Route path="/" element={<AdminProfile />} />
            <Route path="/projects" element={<AdminProjects />} />
            <Route path="/experiences" element={<AdminExperiences />} />
            <Route path="/educations" element={<AdminEducations />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
