import { useState, useEffect } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  MapPin,
  Award,
  Edit,
  Save,
  X,
} from "lucide-react";
import api from "@/lib/api";
import type {
  UserProfile,
  DashboardData,
} from "@/lib/types";

interface BackendProfilePageProps {
  userProfile: UserProfile | null;
  dashboardData: DashboardData | null;
  onRefresh: () => void;
}

export function BackendProfilePage({
  userProfile,
  onRefresh,
}: BackendProfilePageProps) {
  const { isDark } = useDarkMode();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditData(userProfile);
    }
  }, [userProfile]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.updateUserProfile(editData);
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <p className={`text-lg ${isDark ? "text-white/70" : "text-gray-600"}`}>
          No profile data available. Complete your onboarding to see your
          profile.
        </p>
        <Button className="mt-4 bg-tabiya-accent hover:bg-tabiya-accent/90 text-white">
          Complete Onboarding
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList
          className={`grid w-full grid-cols-2 ${isDark ? "bg-white/5" : "bg-gray-100"}`}
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Header */}
          <Card
            className={
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/api/placeholder/150/150" alt="Profile" />
                    <AvatarFallback className="bg-tabiya-accent text-white text-xl">
                      {user?.first_name?.[0] || user?.username?.[0] || "U"}
                      {user?.last_name?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1
                      className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {user?.first_name} {user?.last_name}
                    </h1>
                    <p
                      className={`${isDark ? "text-white/70" : "text-gray-600"}`}
                    >
                      {user?.email}
                    </p>
                    {userProfile.current_occupation && (
                      <Badge variant="outline" className="mt-2">
                        {userProfile.current_occupation.preferred_label}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className={
                    isDark ? "border-white/20 text-white hover:bg-white/10" : ""
                  }
                >
                  {isEditing ? (
                    <X className="w-4 h-4 mr-2" />
                  ) : (
                    <Edit className="w-4 h-4 mr-2" />
                  )}
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={isDark ? "text-white" : "text-gray-900"}>
                      Bio
                    </Label>
                    <Textarea
                      value={editData.bio || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                      className={
                        isDark ? "bg-white/10 border-white/20 text-white" : ""
                      }
                    />
                  </div>
                  <div>
                    <Label className={isDark ? "text-white" : "text-gray-900"}>
                      Location
                    </Label>
                    <Input
                      value={editData.location || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, location: e.target.value })
                      }
                      placeholder="Your location"
                      className={
                        isDark ? "bg-white/10 border-white/20 text-white" : ""
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3
                      className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      About
                    </h3>
                    <p
                      className={`${isDark ? "text-white/70" : "text-gray-600"}`}
                    >
                      {userProfile.bio || "No bio provided yet."}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {userProfile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin
                          className={`w-4 h-4 ${isDark ? "text-white/60" : "text-gray-500"}`}
                        />
                        <span
                          className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                        >
                          {userProfile.location}
                        </span>
                      </div>
                    )}
                    {userProfile.experience_level && (
                      <div className="flex items-center gap-2">
                        <Award
                          className={`w-4 h-4 ${isDark ? "text-white/60" : "text-gray-500"}`}
                        />
                        <span
                          className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                        >
                          {userProfile.experience_level} experience level
                        </span>
                      </div>
                    )}
                    {userProfile.career_goal && (
                      <div className="flex items-center gap-2">
                        <Target
                          className={`w-4 h-4 ${isDark ? "text-white/60" : "text-gray-500"}`}
                        />
                        <span
                          className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                        >
                          {userProfile.career_goal.replace("_", " ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className={
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award
                    className={`h-8 w-8 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                  />
                  <div className="ml-4">
                    <p
                      className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-600"}`}
                    >
                      Experience Level
                    </p>
                    <p
                      className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {userProfile.experience_level?.replace("_", " ") || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-200"
              }
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target
                    className={`h-8 w-8 ${isDark ? "text-green-400" : "text-green-600"}`}
                  />
                  <div className="ml-4">
                    <p
                      className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-600"}`}
                    >
                      Career Goal
                    </p>
                    <p
                      className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {userProfile.career_goal?.replace("_", " ") || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card
            className={
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
            }
          >
            <CardHeader>
              <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
                Account Settings
              </CardTitle>
              <CardDescription
                className={isDark ? "text-white/70" : "text-gray-600"}
              >
                Manage your account preferences and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4
                    className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Onboarding Status
                  </h4>
                  <p
                    className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                  >
                    {userProfile.onboarding_completed
                      ? "Completed"
                      : "In Progress"}
                  </p>
                </div>
                <Badge
                  variant={
                    userProfile.onboarding_completed ? "default" : "secondary"
                  }
                >
                  {userProfile.onboarding_completed ? "Complete" : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4
                    className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    Profile Completion
                  </h4>
                  <p
                    className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                  >
                    Complete your profile to get better recommendations
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={75} className="w-20" />
                  <span
                    className={`text-sm ${isDark ? "text-white/70" : "text-gray-600"}`}
                  >
                    75%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BackendProfilePage;
