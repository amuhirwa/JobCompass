import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  BookOpen,
  Target,
  Award,
  Briefcase,
  TrendingDown,
  Activity,
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import type {
  AnalyticsData,
  Occupation,
  Skill,
  Resource,
} from '@/features/dashboard/types';

interface AnalyticsOverviewProps {
  analytics: AnalyticsData;
  occupations: Occupation[];
  skills: Skill[];
  resources: Resource[];
}

export function AnalyticsOverview({
  analytics,
  resources,
}: AnalyticsOverviewProps) {
  const { isDark } = useDarkMode();

  const chartColors = {
    primary: '#FF6347',
    secondary: '#FF8A65',
    accent: '#FFB74D',
    muted: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  };

  // Prepare chart data
  const topOccupationsData = analytics.topOccupations.map((occ) => ({
    name: occ.name.length > 15 ? occ.name.substring(0, 15) + '...' : occ.name,
    fullName: occ.name,
    percentage: occ.matchPercentage,
  }));

  const skillsGrowthData = analytics.skillsGrowth;

  const marketTrendsData = analytics.occupationTrends.map((trend) => ({
    name:
      trend.name.length > 12 ? trend.name.substring(0, 12) + '...' : trend.name,
    fullName: trend.name,
    demand: trend.demand,
    growth: trend.growth,
  }));

  // Learning progress data
  const learningProgressData = [
    {
      name: 'Completed',
      value: analytics.resourcesCompleted,
      color: chartColors.success,
    },
    {
      name: 'In Progress',
      value: resources.filter((r) => r.progress > 0 && r.progress < 100).length,
      color: chartColors.warning,
    },
    {
      name: 'Not Started',
      value: resources.filter((r) => r.progress === 0).length,
      color: chartColors.muted,
    },
  ];

  // Key stats
  const stats = [
    {
      title: 'Total Occupations',
      value: analytics.totalOccupations,
      icon: Briefcase,
      color: 'text-tabiya-accent',
      bgColor: isDark ? 'bg-tabiya-accent/20' : 'bg-orange-50',
      trend: '+2 this month',
      trendUp: true,
    },
    {
      title: 'Total Skills',
      value: analytics.totalSkills,
      icon: Target,
      color: 'text-tabiya-accent',
      bgColor: isDark ? 'bg-tabiya-accent/20' : 'bg-orange-50',
      trend: '+3 this month',
      trendUp: true,
    },
    {
      title: 'Resources Completed',
      value: analytics.resourcesCompleted,
      icon: BookOpen,
      color: 'text-tabiya-accent',
      bgColor: isDark ? 'bg-tabiya-accent/20' : 'bg-orange-50',
      trend: `${Math.round((analytics.resourcesCompleted / resources.length) * 100)}% completion rate`,
      trendUp: analytics.resourcesCompleted > 0,
    },
    {
      title: 'Top Match',
      value: `${analytics.topOccupations[0]?.matchPercentage}%`,
      subtitle: analytics.topOccupations[0]?.name,
      icon: Award,
      color: 'text-tabiya-accent',
      bgColor: isDark ? 'bg-tabiya-accent/20' : 'bg-orange-50',
      trend: analytics.lastEngagedOccupation,
      trendUp: true,
    },
  ];

  // Key insights
  const insights = [
    {
      title: 'Growing Skills',
      description: `You've added ${analytics.totalSkills} skills this month. Your learning velocity is accelerating!`,
      icon: TrendingUp,
      color: 'text-green-600',
      priority: 'high',
    },
    {
      title: 'Top Career Match',
      description: `${analytics.topOccupations[0]?.name} shows a ${analytics.topOccupations[0]?.matchPercentage}% match with your profile. Consider exploring this path further.`,
      icon: Target,
      color: 'text-blue-600',
      priority: 'high',
    },
    {
      title: 'Learning Progress',
      description: `You've completed ${analytics.resourcesCompleted} resources. Your dedication to continuous learning is impressive!`,
      icon: BookOpen,
      color: 'text-purple-600',
      priority: 'medium',
    },
    {
      title: 'Market Trends',
      description: `${analytics.occupationTrends[0]?.name} is showing ${analytics.occupationTrends[0]?.growth}% growth. Great timing for your career focus!`,
      icon: Activity,
      color: 'text-orange-600',
      priority: 'medium',
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`relative overflow-hidden ${
                isDark
                  ? 'border-tabiya-dark bg-tabiya-medium'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p
                      className={`text-sm font-medium ${
                        isDark ? 'text-white/70' : 'text-gray-600'
                      }`}
                    >
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p
                        className={`text-sm truncate max-w-32 ${
                          isDark ? 'text-white/60' : 'text-gray-500'
                        }`}
                      >
                        {stat.subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs">
                      {stat.trendUp ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={
                          stat.trendUp ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {stat.trend}
                      </span>
                    </div>
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
        {/* Top Occupation Matches */}
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              <TrendingUp className="h-5 w-5 text-tabiya-accent" />
              Top Occupation Matches
            </CardTitle>
            <CardDescription
              className={isDark ? 'text-white/70' : 'text-gray-600'}
            >
              Your highest-matching career opportunities with percentage scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topOccupationsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#444' : '#E0E0E0'}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: isDark ? '#fff' : '#666' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: isDark ? '#fff' : '#666' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#252319' : 'white',
                    border: `1px solid ${isDark ? '#444' : '#E0E0E0'}`,
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#333',
                  }}
                  formatter={(value, _, props) => [
                    `${value}%`,
                    props.payload.fullName,
                  ]}
                />
                <Bar
                  dataKey="percentage"
                  fill={chartColors.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Progress Pie Chart */}
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              <BookOpen className="h-5 w-5 text-tabiya-accent" />
              Learning Progress
            </CardTitle>
            <CardDescription
              className={isDark ? 'text-white/70' : 'text-gray-600'}
            >
              Your resource completion status and progress overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={learningProgressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {learningProgressData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#252319' : 'white',
                      border: `1px solid ${isDark ? '#444' : '#E0E0E0'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#333',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-2 text-center">
                {learningProgressData.map((entry, index) => (
                  <div key={entry.name} className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span
                        className={`text-xs font-medium ${isDark ? 'text-white/80' : 'text-gray-600'}`}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <div
                      className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      {entry.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Growth Over Time */}
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              <Target className="h-5 w-5 text-tabiya-accent" />
              Skill Growth Over Time
            </CardTitle>
            <CardDescription
              className={isDark ? 'text-white/70' : 'text-gray-600'}
            >
              Track your skill development progress month by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={skillsGrowthData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#444' : '#E0E0E0'}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: isDark ? '#fff' : '#666' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: isDark ? '#fff' : '#666' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#252319' : 'white',
                    border: `1px solid ${isDark ? '#444' : '#E0E0E0'}`,
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#333',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={chartColors.primary}
                  fill={chartColors.primary}
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market Trends */}
        <Card
          className={
            isDark
              ? 'border-tabiya-dark bg-tabiya-medium'
              : 'border-gray-200 bg-white'
          }
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              <Activity className="h-5 w-5 text-tabiya-accent" />
              Market Trends & Demand
            </CardTitle>
            <CardDescription
              className={isDark ? 'text-white/70' : 'text-gray-600'}
            >
              Industry demand and growth trends for your target occupations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={marketTrendsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#444' : '#E0E0E0'}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: isDark ? '#fff' : '#666' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: isDark ? '#fff' : '#666' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#252319' : 'white',
                    border: `1px solid ${isDark ? '#444' : '#E0E0E0'}`,
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#333',
                  }}
                  formatter={(value, name) => [
                    `${value}%`,
                    name === 'demand' ? 'Market Demand' : 'Growth Rate',
                  ]}
                />
                <Bar
                  dataKey="demand"
                  fill={chartColors.primary}
                  radius={[4, 4, 0, 0]}
                  name="demand"
                />
                <Bar
                  dataKey="growth"
                  fill={chartColors.secondary}
                  radius={[4, 4, 0, 0]}
                  name="growth"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card
        className={
          isDark
            ? 'border-tabiya-dark bg-tabiya-medium'
            : 'border-gray-200 bg-white'
        }
      >
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            <Award className="h-5 w-5 text-tabiya-accent" />
            Key Insights & Recommendations
          </CardTitle>
          <CardDescription
            className={isDark ? 'text-white/70' : 'text-gray-600'}
          >
            Personalized insights based on your career data and learning
            progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    isDark
                      ? insight.priority === 'high'
                        ? 'border-l-tabiya-accent bg-tabiya-accent/10'
                        : 'border-l-gray-500 bg-tabiya-dark/50'
                      : insight.priority === 'high'
                        ? 'border-l-tabiya-accent bg-orange-50'
                        : 'border-l-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        isDark
                          ? 'bg-tabiya-medium border-tabiya-dark'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4 text-tabiya-accent" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-tabiya-accent">
                        {insight.title}
                      </h4>
                      <p
                        className={`text-sm leading-relaxed ${
                          isDark ? 'text-white/70' : 'text-gray-600'
                        }`}
                      >
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
