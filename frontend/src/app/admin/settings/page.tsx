import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminSettingsPage() {
  return (
    <AdminProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure system settings, site preferences, and administrative options.
          </p>
        </div>
        
        <div className="bg-card p-8 rounded-lg border border-border text-center">
          <h2 className="text-xl font-semibold mb-2">Settings Panel Coming Soon</h2>
          <p className="text-muted-foreground">
            System configuration and settings management will be available in the next update.
          </p>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
