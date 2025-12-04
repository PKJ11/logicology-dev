export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-brand-teal/20 border-t-brand-teal"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="h-8 w-8 animate-pulse rounded-full bg-brand-teal"></div>
          </div>
        </div>
        <div className="mt-6 font-semibold text-brand-tealDark">Loading Competition Details...</div>
      </div>
    </div>
  );
}
