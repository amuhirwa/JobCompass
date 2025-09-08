import React from "react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { Sparkles, Target, TrendingUp } from "lucide-react";
import type { User } from "@/lib/types";

interface WelcomeStepProps {
  onComplete: (data: Record<string, any>) => void;
  user: User | null;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onComplete, user }) => {
  const { isDark } = useDarkMode();

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-tabiya-accent rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2
          className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Welcome to JobCompass, {user?.first_name || user?.username}!
        </h2>

        <p
          className={`text-lg ${isDark ? "text-white/70" : "text-gray-600"} max-w-2xl mx-auto`}
        >
          Let's set up your profile to provide you with personalized career
          guidance, skill recommendations, and learning resources tailored to
          your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div
          className={`p-6 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}
        >
          <Target className="w-8 h-8 text-tabiya-accent mx-auto mb-3" />
          <h3
            className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Personalized Goals
          </h3>
          <p
            className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}
          >
            Set and track your career and learning objectives
          </p>
        </div>

        <div
          className={`p-6 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}
        >
          <TrendingUp className="w-8 h-8 text-tabiya-accent mx-auto mb-3" />
          <h3
            className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Career Insights
          </h3>
          <p
            className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}
          >
            Get AI-powered market insights and career progression paths
          </p>
        </div>

        <div
          className={`p-6 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}
        >
          <Sparkles className="w-8 h-8 text-tabiya-accent mx-auto mb-3" />
          <h3
            className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Skill Development
          </h3>
          <p
            className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}
          >
            Discover learning resources and track your skill progress
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>
          This setup will take about 5 minutes and you can always update your
          information later.
        </p>

        <Button
          onClick={() => onComplete({})}
          size="lg"
          className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white px-8"
        >
          Let's Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
