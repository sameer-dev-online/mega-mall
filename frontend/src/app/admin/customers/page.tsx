import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import CustomerManagement from '@/components/admin/CustomerManagement';

export default function AdminCustomersPage() {
  return (
    <AdminProtectedRoute>
      <CustomerManagement />
    </AdminProtectedRoute>
  );
}
