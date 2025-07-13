import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import AdminUserManagement from '@/components/admin/AdminUserManagement';

export default function AdminUsersPage() {
  return (
    <AdminProtectedRoute requiredRole="superAdmin">
      <AdminUserManagement />
    </AdminProtectedRoute>
  );
}
