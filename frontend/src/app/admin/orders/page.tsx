import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import OrderManagement from '@/components/admin/OrderManagement';

export default function AdminOrdersPage() {
  return (
    <AdminProtectedRoute>
      <OrderManagement />
    </AdminProtectedRoute>
  );
}
