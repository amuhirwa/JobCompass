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
import { Eye, EyeOff, Edit, Save } from 'lucide-react';
import type { User as UserType } from '@/features/dashboard/types';

interface ProfilePageProps {
  user: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
}

export function ProfilePage({ user, onUpdateUser }: ProfilePageProps) {
  const { isDark } = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  return (
    <div
      className="space-y-6 w-full"
      role="main"
      aria-labelledby="profile-page-heading"
    >
      <h2 id="profile-page-heading" className="sr-only">
        User Profile Management
      </h2>

      <div className="space-y-6">
        {/* Personal Information Section */}
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
          role="region"
          aria-labelledby="personal-info-heading"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle
                  id="personal-info-heading"
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
                  aria-label="Edit personal information"
                >
                  <Edit className="h-4 w-4" aria-hidden="true" />
                  Edit Profile
                </Button>
              ) : (
                <div
                  className="flex gap-2"
                  role="group"
                  aria-label="Profile editing actions"
                >
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className={
                      isDark
                        ? 'border-gray-600 text-white hover:bg-tabiya-medium'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                    aria-label="Cancel profile editing"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="gap-2 bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                    aria-label="Save profile changes"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div
              className="flex items-center gap-6"
              role="group"
              aria-labelledby="avatar-section"
            >
              <h4 id="avatar-section" className="sr-only">
                Profile Picture
              </h4>
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}'s profile picture`}
                />
                <AvatarFallback
                  className={`text-2xl ${
                    isDark
                      ? 'bg-tabiya-medium text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  aria-label={`${user.firstName} ${user.lastName}'s initials`}
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
                  aria-label={`User name: ${user.firstName} ${user.lastName}`}
                >
                  {user.firstName} {user.lastName}
                </h3>
                <p
                  className={isDark ? 'text-gray-300' : 'text-muted-foreground'}
                  aria-label={`Email address: ${user.email}`}
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
                  aria-label="Change profile picture"
                >
                  Change Photo
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              role="form"
              aria-labelledby="personal-info-heading"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className={isDark ? 'text-white' : 'text-gray-900'}
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
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
                  aria-describedby={isEditing ? 'firstName-help' : undefined}
                  required={isEditing}
                />
                {isEditing && (
                  <p
                    id="firstName-help"
                    className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Enter your first name
                  </p>
                )}
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
                  name="lastName"
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
                  aria-describedby={isEditing ? 'lastName-help' : undefined}
                  required={isEditing}
                />
                {isEditing && (
                  <p
                    id="lastName-help"
                    className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Enter your last name
                  </p>
                )}
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
                  name="email"
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
                  aria-describedby={isEditing ? 'email-help' : undefined}
                  required={isEditing}
                />
                {isEditing && (
                  <p
                    id="email-help"
                    className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Enter a valid email address
                  </p>
                )}
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
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  disabled={!isEditing}
                  className={
                    isDark
                      ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300 placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                  }
                  aria-describedby={isEditing ? 'phone-help' : undefined}
                />
                {isEditing && (
                  <p
                    id="phone-help"
                    className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Enter your phone number with country code
                  </p>
                )}
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
                  name="location"
                  placeholder="City, Country"
                  disabled={!isEditing}
                  className={
                    isDark
                      ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300 placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                  }
                  aria-describedby={isEditing ? 'location-help' : undefined}
                />
                {isEditing && (
                  <p
                    id="location-help"
                    className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Enter your current city and country
                  </p>
                )}
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
                  name="jobTitle"
                  placeholder="Your current position"
                  disabled={!isEditing}
                  className={
                    isDark
                      ? 'bg-tabiya-medium border-gray-600 text-white disabled:bg-gray-700 disabled:text-gray-300 placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                  }
                  aria-describedby={isEditing ? 'jobTitle-help' : undefined}
                />
                {isEditing && (
                  <p
                    id="jobTitle-help"
                    className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Enter your current job title or position
                  </p>
                )}
              </div>
            </form>

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

        {/* Security Settings Section */}
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
          role="region"
          aria-labelledby="security-settings-heading"
        >
          <CardHeader>
            <CardTitle
              id="security-settings-heading"
              className={isDark ? 'text-white' : 'text-gray-900'}
            >
              Security Settings
            </CardTitle>
            <CardDescription
              className={isDark ? 'text-gray-300' : 'text-gray-600'}
            >
              Manage your password and account security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section
              className="space-y-4"
              role="form"
              aria-labelledby="change-password-heading"
            >
              <h4
                id="change-password-heading"
                className={`text-lg font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Change Password
              </h4>

              <fieldset className="space-y-4">
                <legend className="sr-only">Password Change Form</legend>
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
                      aria-describedby="current-password-help"
                      required
                    />
                    <p id="current-password-help" className="sr-only">
                      Enter your current password to verify your identity
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                        isDark
                          ? 'text-gray-300 hover:bg-gray-600'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
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
                    aria-describedby="new-password-help"
                    required
                    minLength={8}
                  />
                  <p
                    id="new-password-help"
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Password must be at least 8 characters long
                  </p>
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
                    aria-describedby="confirm-password-help"
                    required
                  />
                  <p
                    id="confirm-password-help"
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Re-enter your new password to confirm
                  </p>
                </div>

                <Button
                  onClick={handlePasswordChange}
                  className="w-full bg-tabiya-accent hover:bg-tabiya-accent/90 text-white"
                  type="submit"
                  aria-describedby="password-change-status"
                >
                  Update Password
                </Button>
                <div
                  id="password-change-status"
                  className="sr-only"
                  aria-live="polite"
                >
                  {/* Status messages for password change will appear here */}
                </div>
              </fieldset>
            </section>

            <section
              className={`border-t pt-6 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
              role="region"
              aria-labelledby="account-activity-heading"
            >
              <h4
                id="account-activity-heading"
                className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Account Activity
              </h4>
              <div className="space-y-3" role="list">
                <div
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    isDark
                      ? 'border-gray-600 bg-tabiya-medium'
                      : 'border-gray-200 bg-white'
                  }`}
                  role="listitem"
                >
                  <div>
                    <p
                      className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      Last Login
                    </p>
                    <p
                      className={`text-sm ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}
                    >
                      Today at 2:30 PM from Chrome on Windows
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    aria-label="Current session is active"
                  >
                    Active
                  </Badge>
                </div>
                <div
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    isDark
                      ? 'border-gray-600 bg-tabiya-medium'
                      : 'border-gray-200 bg-white'
                  }`}
                  role="listitem"
                >
                  <div>
                    <p
                      className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      Previous Session
                    </p>
                    <p
                      className={`text-sm ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}
                    >
                      Yesterday at 10:15 AM from Safari on macOS
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    aria-label="Previous session is inactive"
                  >
                    Inactive
                  </Badge>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
