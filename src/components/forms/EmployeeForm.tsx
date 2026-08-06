import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface EmployeeFormProps {
  defaultValues?: {
    email: string;
    fullName: string;
  };
  onSubmit: (values: any) => Promise<void>;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export function EmployeeForm({ defaultValues, onSubmit, isSubmitting, isEditMode = false }: EmployeeFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const schema = z.object({
    email: z.string().email('Invalid email address'),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    password: isEditMode
      ? z.string().optional().or(z.literal(''))
      : z.string().min(6, 'Password must be at least 6 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: defaultValues?.email || '',
      fullName: defaultValues?.fullName || '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          {...register('fullName')}
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@company.com"
          {...register('email')}
          disabled={isSubmitting || isEditMode}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message as string}</p>
        )}
      </div>

      {!isEditMode && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              disabled={isSubmitting}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message as string}</p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          isEditMode ? 'Update Employee' : 'Add Employee'
        )}
      </Button>
    </form>
  );
}

export default EmployeeForm;
