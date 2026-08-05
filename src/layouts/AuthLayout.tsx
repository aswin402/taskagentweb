import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="w-full max-w-md bg-card/60 backdrop-blur-md border border-border/80 shadow-2xl rounded-2xl p-8 flex flex-col items-center z-10">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
