import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect component to handle /community route
const Community: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to community forums
    navigate('/community-forums', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting to Community Forums...</p>
      </div>
    </div>
  );
};

export default Community;
