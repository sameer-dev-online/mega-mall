"use client";

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { userService } from '@/services/Api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface ProfilePictureUploadProps {
  currentAvatar?: string;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
  className?: string;
}

export default function ProfilePictureUpload({ 
  currentAvatar, 
  onAvatarUpdate,
  className = "" 
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUser } = useAuth();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await userService.updateAvatar(file);
      // console.log(response)
      if (response.success && response.data) {
        updateUser(response.data);
        if (response.data.avatar) {
          onAvatarUpdate?.(response.data.avatar);
        }
        toast.success('Profile picture updated successfully!');
        setPreviewUrl(null);
      } else {
        throw new Error(response.message || 'Failed to update avatar');
      }
    } catch (error: unknown) {
      console.error('Error uploading avatar:', error);
      if(error instanceof Error) {
        toast.error(error.message || 'Failed to update profile picture. Please try again.');

      } else {
        toast.error('Failed to update profile picture. Please try again.');
      }
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
      // Reset the input value to allow selecting the same file again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
  };

  const displayImage = previewUrl || (currentAvatar && currentAvatar.length > 0 ? currentAvatar : null);

  return (
    <div className={`relative ${className}`}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Avatar Display */}
            <div className="relative">
              <div 
                className={`
                  relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 
                  ${isDragOver ? 'border-blue-400 bg-blue-50' : ''}
                  ${isUploading ? 'opacity-50' : ''}
                  transition-all duration-200
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {displayImage ? (
                  <Image
                    src={displayImage}
                    width={32}
                    height={32}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '';
                      setPreviewUrl(null);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Loading Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Clear Preview Button */}
              {previewUrl && !isUploading && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                  onClick={clearPreview}
                  aria-label="Clear preview"
                  title="Clear preview"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Upload Instructions */}
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Profile Picture
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                JPG, PNG or GIF. Max size 5MB.
              </p>
              
              {/* Upload Button */}
              <Button
                onClick={handleClick}
                disabled={isUploading}
                variant="outline"
                size="sm"
                className="w-full"
                aria-label="Upload profile picture"
                title="Upload profile picture"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </>
                )}
              </Button>
            </div>

            {/* Drag and Drop Text */}
            <p className="text-xs text-gray-400 text-center">
              or drag and drop a photo here
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        name='avatar'
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
