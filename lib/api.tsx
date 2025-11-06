"use client";

import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

// 🎨 Toast Styles (Professional & Modern)
type ToastType = "success" | "error" | "loading";

const toastStyles: Record<ToastType, any> = {
  success: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    color: "#fff",
  },
  error: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fff",
  },
  loading: {
    background: "#1a1a1a",
    color: "#e5e7eb",
    border: "1px solid #333",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
};

// Spinner Component (Inline SVG)
const Spinner = () => (

    
    <svg
    className="animate-spin h-4 w-4 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
      </svg>
    
);

// 🧁 Toast function with LOADER
const appToast = (id: string, type: ToastType, message: string) => {
  // Custom loading with spinner
  if (type === "loading") {
    toast.loading(
      <div className="flex items-center">
   
        <span>{message}</span>
      </div>,
      {
        id,
        style: {
          padding: "14px 20px",
          fontWeight: "500",
          borderRadius: "12px",
          fontSize: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          ...toastStyles[type],
        },
      }
    );
  } else {
    toast[type](message, {
      id,
      style: {
        padding: "14px 20px",
        fontWeight: "600",
        borderRadius: "12px",
        fontSize: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        ...toastStyles[type],
      },
    });
  }
};

// ============== 🔐 AXIOS CLIENT ==============
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken")
  console.log(token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============== 📦 API HANDLER ==============
interface ApiOptions {
  showSuccess?: boolean;
  successMessage?: string;
  showError?: boolean;
  loadingMessage?: string;
}

export async function apiHandler<T = any>(
  config: AxiosRequestConfig,
  options: ApiOptions = {}
) {
  const toastId = `req-${Date.now()}`;

  const {
    showSuccess = true,
    successMessage = "Operation completed successfully!",
    showError = true,
    loadingMessage = "Please wait...",
  } = options;

  // ⏳ Show Loader Toast with Spinner
  appToast(toastId, "loading", loadingMessage);

  try {
    const response = await api(config);

    // ✅ Success Toast
    if (showSuccess) {
      appToast(toastId, "success", successMessage);
    } else {
      toast.dismiss(toastId); // Remove loading if no success toast
    }

    return response.data as T;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.";

    // ❌ Error Toast
    if (showError) {
      appToast(toastId, "error", msg);
    } else {
      toast.dismiss(toastId);
    }

    throw error;
  }
}

export default api;