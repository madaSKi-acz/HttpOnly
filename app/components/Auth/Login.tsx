"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import api from "@/app/services/api";
import type { AxiosError } from "axios"; // ← Import AxiosError type

// Define expected error response from your backend (adjust if needed)
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    server?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });

      setIsLoading(true);

      const response = await api.post("/login", {
        email,
        password,
      });

      console.log(response, "login response data");

      const { accessToken } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }

      document.cookie = "auth=true; path=/; max-age=86400";

      await new Promise((resolve) => setTimeout(resolve, 300));

      router.push("/users");
    } catch (err) {
      // Properly typed error handling
      if (err instanceof yup.ValidationError) {
        const validationErrors: { email?: string; password?: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as "email" | "password"] = error.message;
          }
        });
        setErrors(validationErrors);
      } 
      else if (err && (err as AxiosError<ApiErrorResponse>).response) {
        // Axios API error
        const axiosError = err as AxiosError<ApiErrorResponse>;
        const message =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "Invalid email or password. Please try again.";

        setErrors({ server: message });
      } 
      else {
        // Network or unexpected errors
        setErrors({ server: "Network error. Please check your connection." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of your JSX remains exactly the same
  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg border border-zinc-200"
    >
      <h1 className="mb-6 text-xl font-bold text-black">Login</h1>

      {errors.server && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {errors.server}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-black">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter email..."
          className={`w-full rounded border p-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-400 focus:ring-red-200"
              : "border-zinc-300 focus:border-black focus:ring-zinc-200"
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-black">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter password..."
          className={`w-full rounded border p-2 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-red-400 focus:ring-red-200"
              : "border-zinc-300 focus:border-black focus:ring-zinc-200"
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded py-2 text-white transition-all flex items-center justify-center gap-2 ${
          isLoading
            ? "bg-zinc-600 cursor-not-allowed"
            : "bg-black hover:bg-zinc-800"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}