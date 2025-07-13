"use client";

import React, { useState, useRef } from 'react';
import { adminService } from '@/services/Api';
import { Product, ProductUploadData, ProductUpdateData, ApiResponse } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  WandSparkles 
} from 'lucide-react';
import { toast } from 'react-toastify';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  category: string;
  weight: string;
  stock: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category || '',
    weight: product?.weight || '',
    stock: product?.stock?.toString() || ''
  });
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.images?.map(img => img.url) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Suggestion states
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionImage, setSuggestionImage] = useState<File | null>(null);
  const [suggestionPreview, setSuggestionPreview] = useState<string>('');
  const [suggestions, setSuggestions] = useState<{title: string; description: string} | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isEditing = !!product;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please select only image files (JPEG, PNG, WebP)');
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Please select images smaller than 5MB');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    // If it's a new image (not from existing product), remove from selectedImages
    const existingImagesCount = product?.images?.length || 0;
    if (index >= existingImagesCount) {
      const newImageIndex = index - existingImagesCount;
      setSelectedImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
  };

  // AI Suggestion handlers
  const handleSuggestionImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Please select an image smaller than 5MB');
      return;
    }

    setSuggestionImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSuggestionPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGetSuggestions = async () => {
    if (!suggestionImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsSuggesting(true);
    setError('');

    try {
      const response: ApiResponse<{title: string; description: string}[]> = await adminService.suggestProductDetails(suggestionImage);

      if (response.success && response.data) {
        setSuggestions(response.data[0]);
        setShowSuggestions(true);
        toast.success('Product suggestions generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate suggestions');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred while generating suggestions';
      toast.error(errorMessage);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAcceptSuggestions = () => {
    if (suggestions) {
      setFormData(prev => ({
        ...prev,
        title: suggestions.title,
        description: suggestions.description
      }));
      setShowSuggestions(false);
      toast.success('Suggestions applied to form');
    }
  };

  const handleRejectSuggestions = () => {
    setSuggestions(null);
    setShowSuggestions(false);
    setSuggestionImage(null);
    setSuggestionPreview('');
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Product title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Product description is required');
      return false;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Product category is required');
      return false;
    }
    if (!formData.weight.trim()) {
      setError('Product weight is required');
      return false;
    }
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      setError('Please enter a valid stock quantity');
      return false;
    }
    if (!isEditing && selectedImages.length === 0) {
      setError('Please select at least one product image');
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
      if (isEditing && product) {
        // Update existing product
        const updateData: ProductUpdateData = {
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          weight: formData.weight,
          stock: Number(formData.stock)
        };

        const response = await adminService.updateProduct(product._id, updateData);
        
        if (response.success) {
          toast.success('Product updated successfully');
          onSuccess();
        } else {
          setError(response.message || 'Failed to update product');
        }
      } else {
        // Create new product
        const uploadData: ProductUploadData = {
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          weight: formData.weight,
          stock: Number(formData.stock),
          images: selectedImages
        };

        const response = await adminService.uploadProduct(uploadData);
        
        if (response.success) {
          toast.success('Product created successfully');
          onSuccess();
        } else {
          setError(response.message || 'Failed to create product');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        `An error occurred while ${isEditing ? 'updating' : 'creating'} the product`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    'electronics',
    'clothing',
    'home-garden',
    'sports',
    'books',
    'toys',
    'beauty',
    'automotive',
    'food',
    'other'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update product information' : 'Fill in the details to add a new product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* AI Product Suggestion */}
        {!isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>AI Product Suggestion</CardTitle>
              <CardDescription>
                Upload an image to get AI-generated product title and description suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload for Suggestions */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSuggestionImageSelect}
                      className="hidden"
                      id="suggestion-image"
                      disabled={isSuggesting}
                    />
                    <label htmlFor="suggestion-image" className="cursor-pointer">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Upload Image for Suggestions</p>
                      <p className="text-xs text-muted-foreground">JPEG, PNG, WebP (max 5MB)</p>
                    </label>
                  </div>

                  {suggestionPreview && (
                    <div className="relative">
                      <img
                        src={suggestionPreview}
                        alt="Suggestion preview"
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={handleRejectSuggestions}
                        disabled={isSuggesting}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handleGetSuggestions}
                    disabled={!suggestionImage || isSuggesting}
                    className="w-full"
                  >
                    {isSuggesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Suggestions...
                      </>
                    ) : (
                      'Get AI Suggestions'
                    )}
                  </Button>
                </div>

                {/* Suggestions Display */}
                <div className="space-y-4">
                  {showSuggestions && suggestions ? (
                    <div className="border border-border rounded-lg p-4 space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">AI Suggestions</h4>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Suggested Title</Label>
                          <p className="text-sm font-medium p-2 bg-muted rounded">{suggestions.title}</p>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground">Suggested Description</Label>
                          <p className="text-sm p-2 bg-muted rounded max-h-20 overflow-y-auto">{suggestions.description}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAcceptSuggestions}
                          className="flex-1"
                        >
                          Accept Suggestions
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRejectSuggestions}
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
                      <p className="text-sm">AI suggestions will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details of your product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' & ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
                required
                disabled={isLoading}
              />
              <WandSparkles className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight *</Label>
                <Input
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 500g, 1.2kg"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Current images are shown below. Upload new images to replace them.'
                : 'Upload high-quality images of your product (max 5MB each)'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Upload */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isLoading}
              />
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Upload Product Images</p>
              <p className="text-muted-foreground mb-4">
                Drag and drop images here, or click to browse
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Images
              </Button>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
