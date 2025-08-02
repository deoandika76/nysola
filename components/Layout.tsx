import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar isOpen={true} />
      <Navbar isOpen={true} />
      <main className="md:ml-64 w-full p-4 sm:p-6 md:p-8 bg-carbon text-white min-h-screen">
        {children}
      </main>
    </div>
  );
}