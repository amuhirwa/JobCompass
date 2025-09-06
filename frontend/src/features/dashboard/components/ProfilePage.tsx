import { useState } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Briefcase,
  Shield,
  Eye,
  EyeOff,
  Edit,
  Save,
  Plus,
  Target,
} from 'lucide-react';
import type {
  User as UserType,
  SkillGroup,
  Skill,
} from '@/features/dashboard/types';

interface ProfilePageProps {
  user: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
  skillGroups: SkillGroup[];
  onUpdateSkillGroups: (skillGroups: SkillGroup[]) => void;
}

export function ProfilePage({
  user,
  onUpdateUser,
  skillGroups,
  onUpdateSkillGroups,
}: ProfilePageProps) {
  const { isDark } = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<
    'Beginner' | 'Intermediate' | 'Advanced'
  >('Beginner');

  const handleSaveProfile = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Here you would normally make an API call to change the password
    alert('Password changed successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim() || !newSkillCategory.trim()) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      category: newSkillCategory.trim(),
      level: newSkillLevel,
    };

    const existingGroupIndex = skillGroups.findIndex(
      (group) => group.name === newSkillCategory.trim()
    );

    if (existingGroupIndex >= 0) {
      const updatedGroups = [...skillGroups];
      updatedGroups[existingGroupIndex] = {
        ...updatedGroups[existingGroupIndex],
        skills: [...updatedGroups[existingGroupIndex].skills, newSkill],
      };
      onUpdateSkillGroups(updatedGroups);
    } else {
      const newGroup = {
        id: Date.now().toString(),
        name: newSkillCategory.trim(),
        skills: [newSkill],
      };
      onUpdateSkillGroups([...skillGroups, newGroup]);
    }

    setNewSkillName('');
    setNewSkillCategory('');
    setNewSkillLevel('Beginner');
  };

  const handleUpdateSkillLevel = (skillId: string, newLevel: string) => {
    const updatedGroups = skillGroups.map((group) => ({
      ...group,
      skills: group.skills.map((skill) =>
        skill.id === skillId
          ? {
              ...skill,
              level: newLevel as 'Beginner' | 'Intermediate' | 'Advanced',
            }
          : skill
      ),
    }));
    onUpdateSkillGroups(updatedGroups);
  };

  const handleRemoveSkill = (skillId: string) => {
    const updatedGroups = skillGroups
      .map((group) => ({
        ...group,
        skills: group.skills.filter((skill) => skill.id !== skillId),
      }))
      .filter((group) => group.skills.length > 0);
    onUpdateSkillGroups(updatedGroups);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const allSkills = skillGroups.flatMap((group) => group.skills);

  return (
    <div className="space-y-6 w-full">
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList
          className={`grid w-full grid-cols-4 ${
            isDark ? 'bg-tabiya-dark border-gray-700' : 'bg-gray-100'
          }`}
        >
          <TabsTrigger
            value="personal"
            className={
              isDark
                ? 'data-[state=active]:bg-tabiya-medium data-[state=active]:text-white text-gray-300'
                : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'
            }
          >
            <User className="h-4 w-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger
            value="professional"
            className={
              isDark
                ? 'data-[state=active]:bg-tabiya-medium data-[state=active]:text-white text-gray-300'
                : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'
            }
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Professional
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className={
              isDark
                ? 'data-[state=active]:bg-tabiya-medium data-[state=active]:text-white text-gray-300'
                : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'
            }
          >
            <Target className="h-4 w-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className={
              isDark
                ? 'data-[state=active]:bg-tabiya-medium data-[state=active]:text-white text-gray-300'
                : 'data-[state=active]:bg-white data-[state=active]:text-gray-900'
            }
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card
            className={`border-gray-200 ${
              isDark ? 'bg-tabiya-dark border-gray-700' : 'bg-white'
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle
                    className={isDark ? 'text-white' : 'text-gray-900'}
                  >
                    Personal Information
                  </CardTitle>
                  <CardDescription
                    className={isDark ? 'text-gray-300' : 'text-gray-600'}
                  >
                    Update your personal details and profile information
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className={`gap-2 ${
                      isDark
                        ? 'border-gray-600 text-white hover:bg-tabiya-medium'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className={
                        isDark
                          ? 'border-gray-600 text-white hover:bg-tabiya-medium'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="gap-2 bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback
                    className={`text-2xl ${
                      isDark
                        ? 'bg-tabiya-medium text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3
                    className={`text-xl font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {user.firstName} {user.lastName}
                  </h3>
                  <p
                    className={
                      isDark ? 'text-gray-300' : 'text-muted-foreground'
                    }
                  >
                    {user.email}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`mt-2 ${
                      isDark
                        ? 'border-gray-600 text-white hover:bg-tabiya-medium'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Change Photo
                  </Button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className={isDark ? 'text-white' : 'text-gray-900'}
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={isEditing ? editedUser.firstName : user.firstName}
                    onChange={(e) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className={
                      isDark
                        ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300'
                        : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className={isDark ? 'text-white' : 'text-gray-900'}
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={isEditing ? editedUser.lastName : user.lastName}
                    onChange={(e) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className={
                      isDark
                        ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300'
                        : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={isDark ? 'text-white' : 'text-gray-900'}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editedUser.email : user.email}
                    onChange={(e) =>
                      setEditedUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className={
                      isDark
                        ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300'
                        : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className={isDark ? 'text-white' : 'text-gray-900'}
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    disabled={!isEditing}
                    className={
                      isDark
                        ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300 placeholder:text-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className={isDark ? 'text-white' : 'text-gray-900'}
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    disabled={!isEditing}
                    className={
                      isDark
                        ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300 placeholder:text-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="jobTitle"
                    className={isDark ? 'text-white' : 'text-gray-900'}
                  >
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    placeholder="Your current position"
                    disabled={!isEditing}
                    className={
                      isDark
                        ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300 placeholder:text-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                    }
                  />
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-2">
                <Label
                  htmlFor="summary"
                  className={isDark ? 'text-white' : 'text-gray-900'}
                >
                  Professional Summary
                </Label>
                <textarea
                  id="summary"
                  className={`flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tabiya-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    isDark
                      ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300 placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 placeholder:text-muted-foreground'
                  }`}
                  placeholder="Tell us about your professional background and goals..."
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card
            className={
              isDark
                ? 'bg-tabiya-dark border-gray-700'
                : 'bg-white border-gray-200'
            }
          >
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Security Settings
              </CardTitle>
              <CardDescription
                className={isDark ? 'text-gray-300' : 'text-gray-600'}
              >
                Manage your password and account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4
                  className={`text-lg font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Change Password
                </h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className={isDark ? 'text-white' : 'text-gray-900'}
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className={
                          isDark
                            ? 'bg-tabiya-medium border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                          isDark
                            ? 'text-gray-300 hover:bg-gray-600'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className={isDark ? 'text-white' : 'text-gray-900'}
                    >
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className={
                        isDark
                          ? 'bg-tabiya-medium border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className={isDark ? 'text-white' : 'text-gray-900'}
                    >
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className={
                        isDark
                          ? 'bg-tabiya-medium border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }
                    />
                  </div>

                  <Button
                    onClick={handlePasswordChange}
                    className="w-full bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                  >
                    Update Password
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-medium mb-4">Account Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Last Login</p>
                      <p className="text-sm text-muted-foreground">
                        Today at 2:30 PM from Chrome on Windows
                      </p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Previous Session</p>
                      <p className="text-sm text-muted-foreground">
                        Yesterday at 10:15 AM from Safari on macOS
                      </p>
                    </div>
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card
            className={
              isDark
                ? 'bg-tabiya-dark border-gray-700'
                : 'bg-white border-gray-200'
            }
          >
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Skills Management
              </CardTitle>
              <CardDescription
                className={isDark ? 'text-gray-300' : 'text-gray-600'}
              >
                Add, update, and manage your professional skills and expertise
                levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Skill */}
              <div
                className={`border rounded-lg p-4 ${
                  isDark
                    ? 'border-gray-600 bg-tabiya-medium'
                    : 'border-gray-200 bg-muted/30'
                }`}
              >
                <h4
                  className={`font-medium mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Add New Skill
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Skill name"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className={
                      isDark
                        ? 'bg-tabiya-dark border-gray-600 text-white placeholder:text-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                    }
                  />
                  <Input
                    placeholder="Category"
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className={
                      isDark
                        ? 'bg-tabiya-dark border-gray-600 text-white placeholder:text-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                    }
                  />
                  <Select
                    value={newSkillLevel}
                    onValueChange={(value: any) => setNewSkillLevel(value)}
                  >
                    <SelectTrigger
                      className={
                        isDark
                          ? 'bg-tabiya-dark border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className={
                        isDark
                          ? 'bg-tabiya-medium border-gray-600'
                          : 'bg-white border-gray-200'
                      }
                    >
                      <SelectItem
                        value="Beginner"
                        className={
                          isDark
                            ? 'text-white hover:bg-gray-600'
                            : 'text-gray-900 hover:bg-gray-50'
                        }
                      >
                        Beginner
                      </SelectItem>
                      <SelectItem
                        value="Intermediate"
                        className={
                          isDark
                            ? 'text-white hover:bg-gray-600'
                            : 'text-gray-900 hover:bg-gray-50'
                        }
                      >
                        Intermediate
                      </SelectItem>
                      <SelectItem
                        value="Advanced"
                        className={
                          isDark
                            ? 'text-white hover:bg-gray-600'
                            : 'text-gray-900 hover:bg-gray-50'
                        }
                      >
                        Advanced
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAddSkill}
                    className="gap-2 bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add Skill
                  </Button>
                </div>
              </div>

              {/* Skills Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`text-center p-4 border rounded-lg ${
                    isDark
                      ? 'border-gray-600 bg-tabiya-medium'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-2xl font-bold text-tabiya-accent">
                    {allSkills.length}
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-muted-foreground'
                    }`}
                  >
                    Total Skills
                  </div>
                </div>
                <div
                  className={`text-center p-4 border rounded-lg ${
                    isDark
                      ? 'border-gray-600 bg-tabiya-medium'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-2xl font-bold text-green-600">
                    {allSkills.filter((s) => s.level === 'Advanced').length}
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-muted-foreground'
                    }`}
                  >
                    Advanced
                  </div>
                </div>
                <div
                  className={`text-center p-4 border rounded-lg ${
                    isDark
                      ? 'border-gray-600 bg-tabiya-medium'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-2xl font-bold text-yellow-600">
                    {allSkills.filter((s) => s.level === 'Intermediate').length}
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-muted-foreground'
                    }`}
                  >
                    Intermediate
                  </div>
                </div>
              </div>

              {/* Skills by Category */}
              <div className="space-y-4">
                {skillGroups.map((group) => (
                  <div key={group.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <h4
                        className={`font-medium ${
                          isDark ? 'text-tabiya-accent' : 'text-tabiya-accent'
                        }`}
                      >
                        {group.name}
                      </h4>
                      <Badge variant="outline">
                        {group.skills.length} skills
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="border rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{skill.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSkill(skill.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              ×
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={skill.level || 'Beginner'}
                              onValueChange={(value) =>
                                handleUpdateSkillLevel(skill.id, value)
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Beginner">
                                  Beginner
                                </SelectItem>
                                <SelectItem value="Intermediate">
                                  Intermediate
                                </SelectItem>
                                <SelectItem value="Advanced">
                                  Advanced
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Badge
                              className={getLevelColor(
                                skill.level || 'Beginner'
                              )}
                              variant="secondary"
                            >
                              {skill.level || 'Beginner'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
