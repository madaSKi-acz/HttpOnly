"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import Loading from "@/app/components/Loading";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProtectedData = async () => {
      try {
        // First: Register/bind the device with WebAuthn

        // Then: Fetch protected data (now allowed because device is bound)
        const response = await api.get<{ data: User[] }>("/api/users");
        setUsers(response.data.data ?? response.data);
      } catch (err: unknown) {
        // Properly typed error handling – no 'any'
        console.error("Access denied or registration failed:", err);

        let message = "Failed to load users.";

        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === 'object' && err !== null && 'response' in err) {
          const axiosError = err as { response?: { data?: { message?: string } } };
          if (axiosError.response?.data?.message?.includes("WebAuthn")) {
            message = "Device registration required. Please allow the browser prompt.";
          }
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProtectedData();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8 text-center">
        <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-black px-4 py-2 text-white hover:bg-zinc-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Rest of your existing UI (unchanged)
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              User Directory
            </h1>
            <p className="mt-1 text-zinc-500">
              Manage and contact your team members.
            </p>
          </div>
        </header>

        {users.length === 0 && (
          <div className="py-16 text-center text-zinc-500">
            No users found.
          </div>
        )}

        {users.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border bg-white p-6 shadow-lg shadow-zinc-900/5 transition hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="mt-2 text-sm text-zinc-600">{user.email}</p>
                <p className="text-sm text-zinc-600">
                  {user.phone ?? "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}