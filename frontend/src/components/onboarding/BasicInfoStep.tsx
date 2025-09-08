import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface BasicInfoStepProps {
  onComplete: (data: Record<string, any>) => void;
  onSkip: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  onComplete,
  onSkip,
}) => {
  const { isDark } = useDarkMode();
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    phone: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2
          className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Tell us about yourself
        </h2>
        <p className={`${isDark ? "text-white/70" : "text-gray-600"}`}>
          This information helps us provide better recommendations (all fields
          are optional)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="bio"
              className={isDark ? "text-white" : "text-gray-900"}
            >
              Professional Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your professional background, interests, and what drives you..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-white/60" : "bg-white border-gray-300"}`}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="location"
                className={isDark ? "text-white" : "text-gray-900"}
              >
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-white/60" : "bg-white border-gray-300"}`}
              />
            </div>

            <div>
              <Label
                htmlFor="phone"
                className={isDark ? "text-white" : "text-gray-900"}
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-white/60" : "bg-white border-gray-300"}`}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Professional Links
            </h3>

            <div>
              <Label
                htmlFor="linkedin_url"
                className={isDark ? "text-white" : "text-gray-900"}
              >
                LinkedIn Profile
              </Label>
              <Input
                id="linkedin_url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin_url}
                onChange={(e) =>
                  handleInputChange("linkedin_url", e.target.value)
                }
                className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-white/60" : "bg-white border-gray-300"}`}
              />
            </div>

            <div>
              <Label
                htmlFor="github_url"
                className={isDark ? "text-white" : "text-gray-900"}
              >
                GitHub Profile
              </Label>
              <Input
                id="github_url"
                placeholder="https://github.com/yourusername"
                value={formData.github_url}
                onChange={(e) =>
                  handleInputChange("github_url", e.target.value)
                }
                className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-white/60" : "bg-white border-gray-300"}`}
              />
            </div>

            <div>
              <Label
                htmlFor="portfolio_url"
                className={isDark ? "text-white" : "text-gray-900"}
              >
                Portfolio Website
              </Label>
              <Input
                id="portfolio_url"
                placeholder="https://yourportfolio.com"
                value={formData.portfolio_url}
                onChange={(e) =>
                  handleInputChange("portfolio_url", e.target.value)
                }
                className={`mt-1 ${isDark ? "bg-white/10 border-white/20 text-white placeholder-white/60" : "bg-white border-gray-300"}`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className={
              isDark
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }
          >
            Skip for now
          </Button>
          <Button
            type="submit"
            className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BasicInfoStep;
