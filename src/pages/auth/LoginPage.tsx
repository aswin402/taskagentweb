import { CheckSquare } from 'lucide-react';
import LoginForm from '@/components/forms/LoginForm';

export function LoginPage() {
  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <CheckSquare className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mt-4">Welcome to TaskAgent</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your dashboard and manage daily tasks.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
