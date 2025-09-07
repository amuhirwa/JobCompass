import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface StatsOverviewProps {
  taxonomyStats: any;
}

export function StatsOverview({ taxonomyStats }: StatsOverviewProps) {
  const { isDark } = useDarkMode();

  if (!taxonomyStats) return null;

  const stats = [
    {
      id: 'total-skills',
      title: 'Total Skills',
      value: taxonomyStats.total_skills,
      description: 'Number of skills in the dataset',
    },
    {
      id: 'total-occupations',
      title: 'Occupations',
      value: taxonomyStats.total_occupations,
      description: 'Number of occupations in the dataset',
    },
    {
      id: 'total-skill-groups',
      title: 'Skill Groups',
      value: taxonomyStats.total_skill_groups,
      description: 'Number of skill groups in the dataset',
    },
    {
      id: 'total-languages',
      title: 'Languages',
      value: 29,
      description: 'Number of languages supported',
    },
  ];

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      role="region"
      aria-labelledby="stats-overview-heading"
    >
      <h2 id="stats-overview-heading" className="sr-only">
        Dataset Statistics Overview
      </h2>
      {stats.map((stat) => (
        <Card
          key={stat.id}
          className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
          role="listitem"
        >
          <CardHeader className="pb-2">
            <CardTitle
              id={`${stat.id}-title`}
              className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold text-tabiya-accent"
              aria-labelledby={`${stat.id}-title`}
              aria-describedby={`${stat.id}-description`}
            >
              {stat.value}
            </div>
            <div id={`${stat.id}-description`} className="sr-only">
              {stat.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
