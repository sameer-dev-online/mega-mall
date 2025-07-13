"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiResponse, emailUpdateData, userService } from "@/services/Api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";

const OtpVerificationPage = () => {
  const router = useRouter();
  const params = useParams();
  const {isAuthenticated} = useAuth()
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = params.userId;
  const newEmail = params.newEmail;
 const decodedEmail = decodeURIComponent(newEmail as string)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please provide a valid user ID");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response: ApiResponse = await userService.verifyOtp(userId as string, otp);
     if(isAuthenticated) {
       if(response.success) {
        try {
          const response: ApiResponse = await userService.updateEmail({newEmail: decodedEmail} as emailUpdateData);
          if(response.success) {
            toast.success((response.data as { message: string })?.message || "Email updated successfully!");

          } 
        } catch (error: unknown) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast.error(axiosError.response?.data?.message || "Failed to update email. Please try again.");
        }
      }
     }

      if (response.success || !newEmail) {
        toast.success("OTP verification successfully.");
        router.push("/signin");
      } 
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message || "An error occurred. Please try again.");
     
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await userService.resendOtp(userId as string, decodedEmail as string);

      if (response.success) {
        toast.success("OTP resent successfull!");
      } 
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "failed to resend otp.")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">OTP Verification</CardTitle>
          <CardDescription>
            Enter the 6-digit OTP sent to your email address.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="otp">One-Time Password</Label>
              <div className="relative">
                <Input
                  id="otp"
                  type={showOtp ? "text" : "password"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  autoComplete="off"
                  maxLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOtp((prev) => !prev)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
                >
                  {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-sm text-center">
          <p>
            Did not receive the OTP?{" "}
            <button onClick={handleResendOtp}
              
              className="text-primary underline"
            >
              Resend OTP
            </button>
          </p>
          <p>
            Having trouble?{" "}
            <Link href="/contact" className="text-primary underline">
              Contact us
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OtpVerificationPage;
