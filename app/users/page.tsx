"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import Loading from "@/app/components/Loading";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Unable to load the user directory. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Loading />;
  }

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

        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!error && users.length === 0 && (
          <div className="py-16 text-center text-zinc-500">
            No users found.
          </div>
        )}

        {!error && users.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border bg-white p-6 shadow-lg shadow-zinc-900/5 transition hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white font-bold">
                  {user.name.charAt(0)}
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
