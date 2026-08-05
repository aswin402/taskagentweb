import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AuthProvider from '@/providers/AuthProvider';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import useAuth from '@/features/auth/hooks/useAuth';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';
import EmployeeLayout from '@/layouts/EmployeeLayout';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import EmployeesPage from '@/pages/admin/EmployeesPage';
import TasksPage from '@/pages/admin/TasksPage';
import ReportsPage from '@/pages/admin/ReportsPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import ChecklistPage from '@/pages/employee/ChecklistPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';

import './App.css';

// Root Redirect Component
function RootRedirect() {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === 'employee') {
    return <Navigate to="/employee/checklist" replace />;
  }

  return <Navigate to="/login" replace />;
}

// Router Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'employees',
        element: <EmployeesPage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '',
        element: <Navigate to="dashboard" replace />,
      },
    ],
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute requiredRole="employee">
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'checklist',
        element: <ChecklistPage />,
      },
      {
        path: '',
        element: <Navigate to="checklist" replace />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" closeButton richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
