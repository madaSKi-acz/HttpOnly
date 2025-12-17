// app/users/page.tsx

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const mockUsers: User[] = [
  { id: 1, name: "Leanne Graham", email: "leanne@example.com", phone: "1-770-736-8031" },
  { id: 2, name: "Ervin Howell", email: "ervin@example.com", phone: "010-692-6593" },
  { id: 3, name: "Clementine Bauch", email: "clementine@example.com", phone: "1-463-123-4447" },
  { id: 4, name: "Patricia Lebsack", email: "patricia@example.com", phone: "493-170-9623" },
  { id: 5, name: "Chelsey Dietrich", email: "chelsey@example.com", phone: "(254)954-1289" },
  { id: 6, name: "Dennis Schulist", email: "dennis@example.com", phone: "1-477-935-8478" },
];

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">User Directory</h1>
            <p className="text-zinc-500 mt-1">Manage and contact your team members.</p>
          </div>
          <button className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
            Add New User
          </button>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md hover:border-zinc-300"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white">
                  {user.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-black">{user.name}</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Email Address</span>
                    <span className="text-sm text-zinc-700 font-medium">{user.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Phone Number</span>
                    <span className="text-sm text-zinc-700 font-medium">{user.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button className="flex-1 rounded-lg border border-zinc-200 py-2 text-sm font-bold text-black hover:bg-zinc-50 transition-colors">
                  Profile
                </button>
                <button className="flex-1 rounded-lg bg-zinc-100 py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}