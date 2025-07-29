import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-carbon text-white min-h-screen">{children}</main>
    </div>
  );
}