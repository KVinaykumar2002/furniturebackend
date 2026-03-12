import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 pt-24">
        <div className="text-center">
          <h1 className="font-display text-6xl font-light text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Oops! This page could not be found.</p>
          <Link
            to="/"
            className="inline-block bg-primary text-primary-foreground text-sm px-8 py-3.5 hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
