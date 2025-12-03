export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-brand-teal rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="mt-6 text-brand-tealDark font-semibold">
          Loading Competition Details...
        </div>
      </div>
    </div>
  );
}