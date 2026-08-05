import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine active page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Dashboard Overview';
    if (path.includes('/admin/employees')) return 'Employee Directory';
    if (path.includes('/admin/tasks')) return 'Task Management';
    if (path.includes('/admin/reports')) return 'Historical Reports';
    if (path.includes('/admin/settings')) return 'Agent & System Settings';
    return 'Admin Panel';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 w-full">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex w-64 shrink-0" />

      {/* Mobile Drawer Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Panel Wrapper */}
      <div className="flex flex-col flex-1 min-w-0 w-full">
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} title={getPageTitle()} />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto w-full max-w-7xl mx-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default AdminLayout;
