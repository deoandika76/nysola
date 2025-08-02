// components/FullLayout.tsx
export default function FullLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-carbon text-white min-h-screen w-full p-4 sm:p-6 md:p-8">
      {children}
    </div>
  );
}