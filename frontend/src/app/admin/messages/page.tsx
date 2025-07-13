import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminMessagesPage() {
  return (
    <AdminProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Messages</h1>
          <p className="text-muted-foreground">
            Manage customer support messages and communications.
          </p>
        </div>
        
        <div className="bg-card p-8 rounded-lg border border-border text-center">
          <h2 className="text-xl font-semibold mb-2">Message Center Coming Soon</h2>
          <p className="text-muted-foreground">
            Customer support messaging system will be implemented in the next phase.
          </p>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
