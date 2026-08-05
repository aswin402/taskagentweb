import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Something went wrong</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected client-side error occurred. We have logged this transaction and you can reload to resume operations.
              </p>
            </div>

            {this.state.error && (
              <pre className="text-left text-[10px] font-mono bg-muted p-3 rounded-lg overflow-x-auto text-muted-foreground max-h-32">
                {this.state.error.stack || this.state.error.message}
              </pre>
            )}

            <Button onClick={this.handleReset} className="w-full shadow-lg shadow-primary/10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.state.hasError ? null : this.props.children;
  }
}

export default ErrorBoundary;
