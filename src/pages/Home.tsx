import { Button } from '@/components/ui/button';
import { Loading } from '@/components/Loading';
import { useState } from 'react';
import { toast } from 'sonner';

export function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Loading demo complete!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Welcome to Voice Identify</h2>
        <p className="text-muted-foreground">
          This is a production-base project with Vite, React, and Shadcn/UI.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg shadow-sm space-y-4">
          <h3 className="font-semibold">Button Components</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast('Hello Shadcn!')}>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>

        <div className="p-6 border rounded-lg shadow-sm space-y-4">
          <h3 className="font-semibold">Loading States</h3>
          <div className="space-y-2">
            <Button variant="outline" onClick={handleLoadingDemo} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Show Loading Overlay'}
            </Button>
            {isLoading && <Loading fullPage text="Simulating background task..." />}
          </div>
        </div>

        <div className="p-6 border rounded-lg shadow-sm space-y-4">
          <h3 className="font-semibold">Toast Notifications</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success('Operation successful!')}>
              Success
            </Button>
            <Button variant="outline" onClick={() => toast.error('Something went wrong.')}>
              Error
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
