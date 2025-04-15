
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package, Truck, BarChart, UserCheck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OnboardingProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
}

const onboardingSteps = [
  {
    title: "Welcome to Soko Connect",
    description: "The complete platform for agricultural information and supply chain solutions in Kenya.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 relative">
        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary border-l-transparent animate-spin-slow"></div>
      </div>
    )
  },
  {
    title: "Direct Trading Platform",
    description: "Buy, sell, and barter agricultural commodities directly with other farmers and buyers, eliminating middlemen.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-slow">
        <Package className="w-12 h-12 text-primary" />
      </div>
    )
  },
  {
    title: "Supply Chain Solutions",
    description: "Access innovative solutions for post-harvest losses, logistics, market access, and quality control.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <Truck className="w-12 h-12 text-primary animate-slide-right" />
      </div>
    )
  },
  {
    title: "Market Intelligence",
    description: "Access real-time market data, price trends, and agricultural statistics to make informed decisions.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <BarChart className="w-12 h-12 text-primary animate-bounce-slow" />
      </div>
    )
  },
  {
    title: "Get Started Now",
    description: "Complete your profile to personalize your experience and start accessing all platform features.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <UserCheck className="w-12 h-12 text-primary animate-pulse" />
      </div>
    ),
    actionItems: [
      {
        title: "Create Your Profile",
        description: "Set up your farmer or buyer profile to get started"
      },
      {
        title: "Connect With Others",
        description: "Find and connect with other farmers and buyers"
      }
    ]
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ 
  currentStep, 
  setCurrentStep, 
  completeOnboarding 
}) => {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Clear any error when changing steps
  useEffect(() => {
    setError(null);
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    try {
      // In a real app, we might do more validation or save profile data here
      setOpen(false);
      completeOnboarding();
    } catch (err) {
      setError("There was a problem completing the onboarding. Please try again.");
      console.error("Onboarding completion error:", err);
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  
  return (
    <Dialog open={open} onOpenChange={(value) => {
      // Only allow closing via the buttons, not by clicking outside
      if (!value) return;
      setOpen(value);
    }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">Onboarding - {currentStepData.title}</DialogTitle>
        <div className="p-6 animate-fade-up">
          {currentStepData.icon}
          
          <h2 className="text-2xl font-bold text-center mb-2">
            {currentStepData.title}
          </h2>
          
          <p className="text-center text-muted-foreground mb-6">
            {currentStepData.description}
          </p>

          {/* Display action items if available */}
          {currentStepData.actionItems && (
            <div className="mb-6">
              {currentStepData.actionItems.map((item, index) => (
                <div key={index} className="flex items-start mb-3 bg-muted/40 p-3 rounded-lg">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Error message if any */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex space-x-1">
              {onboardingSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button onClick={handleNext}>
              {currentStep < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link" size="sm" onClick={handleComplete}>
              Skip Introduction
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;
