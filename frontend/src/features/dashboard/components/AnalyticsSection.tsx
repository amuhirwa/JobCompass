import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Users,
  BookOpen,
  Target,
  Clock,
  Award,
} from 'lucide-react';
import type { AnalyticsData } from '@/features/dashboard/types';

interface AnalyticsSectionProps {
  analytics: AnalyticsData;
}

export function AnalyticsSection({ analytics }: AnalyticsSectionProps) {
  // Colors for charts (theme-aware)
  const chartColors = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  const pieColors = [
    chartColors.primary,
    chartColors.secondary,
    chartColors.accent,
    chartColors.warning,
  ];

  // Prepare data for charts
  const topOccupationsData = analytics.topOccupations.map((occ) => ({
    name: occ.name.length > 15 ? occ.name.substring(0, 15) + '...' : occ.name,
    match: occ.matchPercentage,
  }));

  const skillsGrowthData = analytics.skillsGrowth;

  const occupationTrendsData = analytics.occupationTrends.map((trend) => ({
    name:
      trend.name.length > 12 ? trend.name.substring(0, 12) + '...' : trend.name,
    demand: trend.demand,
    growth: trend.growth,
  }));

  const pieData = [
    { name: 'Completed', value: analytics.resourcesCompleted },
    {
      name: 'In Progress',
      value: Math.max(0, analytics.totalSkills - analytics.resourcesCompleted),
    },
  ];

  const stats = [
    {
      title: 'Total Occupations',
      value: analytics.totalOccupations,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Skills Added',
      value: analytics.totalSkills,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Resources Completed',
      value: analytics.resourcesCompleted,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Last Engaged',
      value: analytics.lastEngagedOccupation,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      isText: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.isText ? (
                        <span className="text-lg">{stat.value}</span>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Occupations Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Occupation Matches
            </CardTitle>
            <CardDescription>
              Your highest-matching career opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topOccupationsData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar
                  dataKey="match"
                  fill={chartColors.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills Growth Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Skills Growth Over Time
            </CardTitle>
            <CardDescription>Your skill development progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={skillsGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={chartColors.accent}
                  strokeWidth={3}
                  dot={{ fill: chartColors.accent, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupation Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Market Demand Trends
            </CardTitle>
            <CardDescription>
              Industry demand for your target occupations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupationTrendsData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar
                  dataKey="demand"
                  fill={chartColors.secondary}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="growth"
                  fill={chartColors.warning}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resources Progress Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Progress
            </CardTitle>
            <CardDescription>Your resource completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pieColors[index] }}
                    />
                    <span className="text-sm">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>
            Personalized recommendations based on your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-green-600">
                Growing Skills
              </h4>
              <p className="text-sm text-muted-foreground">
                You've added {analytics.totalSkills} skills this month. Keep up
                the momentum!
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-blue-600">Top Match</h4>
              <p className="text-sm text-muted-foreground">
                {analytics.topOccupations[0]?.name} shows a{' '}
                {analytics.topOccupations[0]?.matchPercentage}% match with your
                profile.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-purple-600">
                Learning Progress
              </h4>
              <p className="text-sm text-muted-foreground">
                You've completed {analytics.resourcesCompleted} resources.
                Consider exploring more advanced topics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
