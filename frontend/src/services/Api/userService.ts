import axiosInstance from '@/lib/axious';
import {
  ApiResponse,
  User,
  SignUpData,
  SignInData,
  UpdatePasswordData,
  UpdateProfileData,
  emailUpdateData,
  updatePersonalInfoData
} from '@/types/api';

class UserService {
  // Authentication
  async signUp(data: SignUpData): Promise<ApiResponse> {
    const response = await axiosInstance.post('/user/sign-up', data);
    return response.data;
  }

  async signIn(data: SignInData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await axiosInstance.post('/user/sign-in', data);
    // Store token in localStorage if login is successful
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }

    return response.data;
  }

  async verifyOtp(userId: string, otp: string): Promise<ApiResponse> {
    const response = await axiosInstance.post(`/user/verify-otp/${userId}`, { otp });
    return response.data;
  }

  async resendOtp(userId: string, email: string): Promise<ApiResponse> {
    const response = await axiosInstance.post(`/user/resend-otp/${userId}`, {email});
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await axiosInstance.post('/user/logout');

    // Remove token from localStorage
    localStorage.removeItem('token');

    return response.data;
  }

  // Profile Management
  async getUser(): Promise<ApiResponse<User>> {
    const response = await axiosInstance.get('/user/get-user');
    return response.data;
  }

  async updatePreferences(data: UpdateProfileData): Promise<ApiResponse<User>> {
    const response = await axiosInstance.patch('/user/update-preferences', data);
    return response.data;
  }

  async getAvatar (): Promise<ApiResponse<User>> {
    const response = await axiosInstance.get('/user/get-avatar');
    return response.data;
  }

  async updatePassword(data: UpdatePasswordData): Promise<ApiResponse> {
    const response = await axiosInstance.patch('/user/update-password', data);
    return response.data;
  }

  async emailVerification(newEmail: emailUpdateData): Promise<ApiResponse> {
    const response = await axiosInstance.post('/user/email-verification', newEmail)
    return response.data;
  }

  async updateEmail(newEmail: emailUpdateData): Promise<ApiResponse> {
    const response = await axiosInstance.patch(`/user/update-email` , newEmail);
    return response.data;
  }
  async updatePersonalInfo(personalInfo: updatePersonalInfoData): Promise<ApiResponse> {
    const response = await axiosInstance.patch(`/user/update-personal-info` , personalInfo);
    console.log(response)
    return response.data;
  }

  async updateAvatar(avatar: File): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await axiosInstance.patch('/user/update-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteAccount(password: string): Promise<ApiResponse> {
    const response = await axiosInstance.delete('/user/delete-account', {
      data: { password }
    });

    // Remove token from localStorage
    localStorage.removeItem('token');

    return response.data;
  }
}

export const userService = new UserService();