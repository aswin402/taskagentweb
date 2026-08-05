import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, BarChart3, Settings, Shield } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export function Sidebar({ className = '', onLinkClick }: SidebarProps) {
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/employees', label: 'Employees', icon: Users },
    { to: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`flex flex-col h-full bg-card border-r border-border ${className}`}>
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-border gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Shield className="h-4.5 w-4.5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-sm leading-none">{APP_NAME}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Manager Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
