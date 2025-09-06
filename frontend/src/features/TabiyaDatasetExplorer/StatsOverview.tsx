import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface StatsOverviewProps {
  taxonomyStats: any;
}

export function StatsOverview({ taxonomyStats }: StatsOverviewProps) {
  const { isDark } = useDarkMode();

  if (!taxonomyStats) return null;

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <Card
        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Total Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-tabiya-accent">
            {taxonomyStats.total_skills}
          </div>
        </CardContent>
      </Card>
      <Card
        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Occupations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-tabiya-accent">
            {taxonomyStats.total_occupations}
          </div>
        </CardContent>
      </Card>
      <Card
        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Skill Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-tabiya-accent">
            {taxonomyStats.total_skill_groups}
          </div>
        </CardContent>
      </Card>
      <Card
        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-tabiya-accent">29</div>
        </CardContent>
      </Card>
    </div>
  );
}
