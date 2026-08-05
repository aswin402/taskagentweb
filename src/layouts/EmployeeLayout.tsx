import { Outlet } from 'react-router-dom';

export function EmployeeLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Employee Portal Placeholder</h1>
      </div>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default EmployeeLayout;
