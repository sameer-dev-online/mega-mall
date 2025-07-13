"use client";

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/Api';
import { Admin, AdminSignUpData, ApiResponse, GetAllAdmins } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Plus,
  Trash2,
  UserPlus,
  AlertCircle,
  Shield,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAdminAuth } from '@/contexts/admin/AuthContext';

const AdminUserManagement: React.FC = () => {
  const { admin: currentAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response: ApiResponse<GetAllAdmins> = await adminService.getAllAdmins();
      
      if (response.success && response.data) {
        setAdmins(response.data.admins );
      } else {
        setError(response.message || 'Failed to load admin users');
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred while loading admin users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle admin deletion
  const handleDeleteAdmin = async (id: string) => {
    if (id === currentAdmin?._id) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (!confirm('Are you sure you want to delete this admin account?')) {
      return;
    }

    try {
      const response = await adminService.deleteAdmin(id);
      
      if (response.success) {
        toast.success('Admin account deleted successfully');
        fetchAdmins(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to delete admin account');
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred while deleting admin account';
      toast.error(errorMessage);
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowAddForm(false);
    fetchAdmins(); // Refresh the list
  };

  // Filter admins based on search
  const filteredAdmins = admins.filter(admin => {
    const searchLower = searchQuery.toLowerCase();
    return (
      admin.fullName.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower) ||
      admin.role.toLowerCase().includes(searchLower)
    );
  });

  // Admin statistics
  const adminStats = {
    total: admins.length,
    superAdmins: admins.filter(a => a.role === 'superAdmin').length,
    regularAdmins: admins.filter(a => a.role === 'admin').length
  };

  if (showAddForm) {
    return (
      <AddAdminForm
        onClose={() => setShowAddForm(false)}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin User Management</h1>
          <p className="text-muted-foreground">
            Manage admin accounts, create new admin users, and control access permissions.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Admin Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Admins</p>
                <p className="text-2xl font-bold">{adminStats.total}</p>
              </div>
              <UserPlus className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Super Admins</p>
                <p className="text-2xl font-bold text-purple-600">{adminStats.superAdmins}</p>
              </div>
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Regular Admins</p>
                <p className="text-2xl font-bold text-blue-600">{adminStats.regularAdmins}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search admins by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <h4>Error loading admin users</h4>
            <p>{error}</p>
          </div>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Admins List */}
      {!isLoading && !error && (
        <>
          {filteredAdmins.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No admin users found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'No admin users match your search criteria.' 
                    : 'No admin users have been created yet.'}
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Admin
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAdmins.map((admin) => (
                <AdminCard
                  key={admin._id}
                  admin={admin}
                  currentAdminEmail={currentAdmin?.email || ''}
                  onDelete={() => handleDeleteAdmin(admin._id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Admin Card Component
interface AdminCardProps {
  admin: Admin;
  currentAdminEmail: string;
  onDelete: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({ admin, currentAdminEmail, onDelete }) => {
  const isCurrentUser = admin.email === currentAdminEmail;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {admin.role === 'superAdmin' ? (
                <Crown className="h-6 w-6 text-purple-600" />
              ) : (
                <Shield className="h-6 w-6 text-blue-600" />
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">{admin.fullName}</h3>
                {isCurrentUser && (
                  <Badge variant="outline">You</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{admin.email}</p>
              <Badge variant={admin.role === 'superAdmin' ? 'default' : 'secondary'}>
                {admin.role === 'superAdmin' ? 'Super Admin' : 'Admin'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isCurrentUser && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Add Admin Form Component
interface AddAdminFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddAdminForm: React.FC<AddAdminFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<AdminSignUpData>({
    fullName: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await adminService.signUp(formData);
      
      if (response.success) {
        toast.success('Admin account created successfully');
        onSuccess();
      } else {
        setError(response.message || 'Failed to create admin account');
      }
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred while creating admin account';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Admin</h1>
          <p className="text-muted-foreground">
            Create a new admin account with appropriate permissions
          </p>
        </div>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Admin Account Details</CardTitle>
          <CardDescription>
            Fill in the information to create a new admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <div>
                  <h4>Error</h4>
                  <p>{error}</p>
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (min 6 characters)"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                required
                disabled={isLoading}
              >
                <option value="admin">Admin</option>
                <option value="superAdmin">Super Admin</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Admin'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
