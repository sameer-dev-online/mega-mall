"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Shield, Package, ArrowLeft } from "lucide-react";

import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";
import SecuritySettingsForm from "@/components/profile/SecuritySettingsForm";
import AccountSettings from "@/components/profile/AccountSettings";
import OrderHistory from "@/components/profile/OrderHistory";

type ActiveTab = 'overview' | 'personal' | 'security' | 'orders' | 'settings';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const handleUserUpdate = (updatedUser: unknown) => {
    console.log("User updated:", updatedUser);
  };

  const activeTitle = useMemo(() => {
    switch (activeTab) {
      case 'personal': return 'Personal Information';
      case 'security': return 'Security Settings';
      case 'orders': return 'Order History';
      case 'settings': return 'Account Settings';
      default: return 'Profile';
    }
  }, [activeTab]);

  const activeDescription = useMemo(() => {
    switch (activeTab) {
      case 'personal': return 'Update your personal details and contact information';
      case 'security': return 'Manage your password and email settings';
      case 'orders': return 'View and track your order history';
      case 'settings': return 'Configure your account preferences';
      default: return 'Manage your account settings and preferences';
    }
  }, [activeTab]);

  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'personal':
        return <PersonalInfoForm user={user} onUpdate={handleUserUpdate} />;
      case 'security':
        return <SecuritySettingsForm user={user} />;
      case 'orders':
        return <OrderHistory />;
      case 'settings':
        return <AccountSettings user={user} onUpdate={handleUserUpdate} />;
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Your account details and personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-gray-900">{user.fullName || "—"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <p className="mt-1 text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </p>
                    </div>
                    {user.phoneNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <p className="mt-1 text-gray-900">{user.phoneNumber}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Account Status</label>
                      <p className="mt-1 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <p className="mt-1 text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" onClick={() => setActiveTab('personal')}>Edit Profile</Button>
                      <Button variant="outline" onClick={() => setActiveTab('security')}>Security Settings</Button>
                      <Button variant="outline" onClick={() => setActiveTab('settings')}>Account Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Picture + Quick Actions */}
            <div className="space-y-6">
              <ProfilePictureUpload currentAvatar={user.avatar} onAvatarUpdate={handleUserUpdate} />
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('orders')}>
                    <Package className="w-4 h-4 mr-2" />
                    View Orders
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    Wishlist
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    Address Book
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    Payment Methods
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{activeTitle}</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">{activeDescription}</p>
              </div>
              {activeTab !== 'overview' && (
                <Button variant="outline" onClick={() => setActiveTab('overview')} className="flex items-center w-fit">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Overview
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 overflow-x-auto">
            <nav className="flex gap-6 text-sm border-b pb-1">
              {(['overview', 'personal', 'security', 'orders', 'settings'] as ActiveTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap border-b-2 transition-all duration-150 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          {user && renderTabContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
}
