import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Chatbot } from '@/components/custom/Chatbot';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import type { OnboardingStepData } from '@/lib/types';
import {
  BasicInfoStep,
  CareerInfoStep,
  GoalsStep,
  SkillsStep,
  WelcomeStep,
} from '@/components/onboarding';

const OnboardingPage: React.FC = () => {
  const { isDark } = useDarkMode();
  const { user, checkOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Welcome', description: 'Welcome to JobCompass' },
    { id: 2, title: 'Basic Info', description: 'Tell us about yourself' },
    { id: 3, title: 'Career Info', description: 'Your career journey' },
    { id: 4, title: 'Skills', description: 'What are your skills?' },
    { id: 5, title: 'Goals', description: 'Set your learning goals' },
  ];

  const progress = (currentStep / steps.length) * 100;

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkExistingOnboarding = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const hasCompletedOnboarding = await checkOnboardingStatus();
        if (hasCompletedOnboarding) {
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkExistingOnboarding();
  }, [user, checkOnboardingStatus, navigate]);

  const handleStepComplete = async (stepData: Record<string, any>) => {
    if (currentStep === 1) {
      // Welcome step, just proceed
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const onboardingData: OnboardingStepData = {
        step: currentStep - 1, // Adjust for 0-based backend steps
        data: stepData,
      };

      await api.submitOnboardingStep(onboardingData);
      setCompletedSteps([...completedSteps, currentStep]);

      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding
        await handleCompleteOnboarding();
      }
    } catch (error) {
      console.error('Error submitting onboarding step:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await api.completeOnboarding();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleSkipStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onComplete={handleStepComplete} user={user} />;
      case 2:
        return (
          <BasicInfoStep
            onComplete={handleStepComplete}
            onSkip={handleSkipStep}
          />
        );
      case 3:
        return (
          <CareerInfoStep
            onComplete={handleStepComplete}
            onSkip={handleSkipStep}
          />
        );
      case 4:
        return (
          <SkillsStep onComplete={handleStepComplete} onSkip={handleSkipStep} />
        );
      case 5:
        return (
          <GoalsStep onComplete={handleStepComplete} onSkip={handleSkipStep} />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-tabiya-dark' : 'bg-gray-50'} flex items-center justify-center p-6`}
    >
      <div className="w-full max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Welcome to JobCompass
            </h1>
            <span
              className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}
            >
              Step {currentStep} of {steps.length}
            </span>
          </div>

          <Progress value={progress} className="mb-4" />

          {/* Step indicators */}
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-500 text-white'
                      : step.id === currentStep
                        ? 'bg-tabiya-accent text-white'
                        : isDark
                          ? 'bg-white/20 text-white/60'
                          : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs text-center ${
                    isDark ? 'text-white/70' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <Card
          className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
        >
          <CardContent className="p-8">{renderCurrentStep()}</CardContent>
        </Card>

        {/* Footer */}
        {currentStep > 1 && (
          <div className="mt-6 text-center">
            <p
              className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}
            >
              You can always update this information later in your profile
              settings.
            </p>
          </div>
        )}
      </div>

      {/* Chatbot for Onboarding Help */}
      <Chatbot
        contextType="general"
        contextData={{
          name: 'Onboarding Assistant',
          description:
            'Help with completing your profile setup and understanding JobCompass features',
        }}
      />
    </div>
  );
};

export default OnboardingPage;
