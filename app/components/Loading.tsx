export default function UsersLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-3 text-zinc-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
        <span>Loading users...</span>
      </div>
    </div>
  );
}
