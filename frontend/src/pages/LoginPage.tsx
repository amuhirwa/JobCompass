import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Chatbot } from "@/components/custom/Chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, register, isAuthenticated, checkOnboardingStatus } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    first_name: "",
    last_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login({
          username: formData.email,
          password: formData.password,
        });
        // After login, check onboarding status and redirect accordingly
        const hasCompletedOnboarding = await checkOnboardingStatus();
        if (hasCompletedOnboarding) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
        });
        // After registration, always go to onboarding
        setJustRegistered(true);
        navigate("/onboarding");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail || err.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Effect to handle redirects for already authenticated users
  useEffect(() => {
    const handleAuthenticatedUser = async () => {
      if (
        isAuthenticated &&
        localStorage.getItem("access_token") &&
        !justRegistered
      ) {
        const hasCompletedOnboarding = await checkOnboardingStatus();
        if (hasCompletedOnboarding) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/onboarding", { replace: true });
        }
      }
    };

    handleAuthenticatedUser();
  }, [isAuthenticated, justRegistered, navigate, checkOnboardingStatus]);

  return (
    <div className="min-h-screen bg-tabiya-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {isLogin ? "Login" : "Register"}
          </CardTitle>
          <p className="text-center text-white/60">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder-white/60"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder-white/60"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{isLogin ? 'Username' : 'Email'}</Label>
              <Input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-tabiya-accent hover:bg-tabiya-accent/90"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Login" : "Register"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-tabiya-accent hover:text-tabiya-accent/80 text-sm"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-center text-white/60 text-sm">
              Demo credentials (if available):
            </p>
            <p className="text-center text-white/80 text-xs mt-1">
              Email: demo@example.com / Password: demo123
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chatbot for Login Help */}
      <Chatbot
        contextType="general"
        contextData={{
          name: "Login Support",
          description:
            "Help with account access, registration, and platform features",
        }}
      />
    </div>
  );
}
