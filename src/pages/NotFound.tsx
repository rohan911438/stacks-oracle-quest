import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-4 w-full max-w-lg p-8 text-center bg-gradient-card shadow-card">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-glow">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Page not found</h1>
        <p className="mb-6 text-muted-foreground">We couldn’t find what you’re looking for.</p>
        <div className="flex justify-center gap-2">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/markets">
            <Button>Explore Markets</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
