import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect component to handle /partners route
const Partners: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to partners showcase
    navigate('/partners-showcase', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting to Partners...</p>
      </div>
    </div>
  );
};

export default Partners;
