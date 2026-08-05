import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading authorization status...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with original destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to fallback page if role doesn't match
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 'employee') {
      return <Navigate to="/employee/checklist" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
