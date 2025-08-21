import React from "react";

const Index = () => {
  // Redirect to landing page
  React.useEffect(() => {
    window.location.replace('/');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting...</h1>
        <p className="text-xl text-muted-foreground">Please wait while we redirect you to Waste2Worth</p>
      </div>
    </div>
  );
};

export default Index;
