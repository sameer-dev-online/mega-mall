import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import ProductManagement from '@/components/admin/ProductManagement';

export default function AdminProductsPage() {
  return (
    <AdminProtectedRoute>
      <ProductManagement />
    </AdminProtectedRoute>
  );
}
