import React, { Suspense } from 'react';

// Lazy load the actual NetworkingPage component
const NetworkingPageComponent = React.lazy(() => 
  import('@/components/NetworkingPage').then(module => ({ default: module.NetworkingPage }))
);

const Networking: React.FC = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <NetworkingPageComponent userId="USER_ID_PLACEHOLDER" />
    </Suspense>
  );
};

export default Networking;
