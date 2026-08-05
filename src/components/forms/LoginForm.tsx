import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormSchema, type LoginFormValues } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await login(values.email, values.password);
      if (res?.profile) {
        if (res.profile.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/employee/checklist', { replace: true });
        }
      } else {
        setErrorMsg('Unauthorized profile. Please contact your manager.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      {errorMsg && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {errorMsg}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          {...register('email')}
          disabled={isSubmitting}
          className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          disabled={isSubmitting}
          className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
}

export default LoginForm;
