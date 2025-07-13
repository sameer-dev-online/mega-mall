import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

export default function AdminAnalyticsPage() {
  return (
    <AdminProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            View detailed analytics, sales reports, and performance metrics.
          </p>
        </div>
        
        <div className="bg-card p-8 rounded-lg border border-border text-center">
          <h2 className="text-xl font-semibold mb-2">Analytics Dashboard Coming Soon</h2>
          <p className="text-muted-foreground">
            Advanced analytics and reporting features will be available in the next update.
          </p>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
