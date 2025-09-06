import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDarkMode } from '@/contexts/DarkModeContext';
import type { CareerStepSkill } from '@/lib/types';

interface CareerPathsSectionProps {
  selectedOccupationId: string | null;
  careerPaths: any;
  careerPathsLoading: boolean;
  onSkillClick: (skillInfo: CareerStepSkill) => void;
}

export function CareerPathsSection({
  selectedOccupationId,
  careerPaths,
  careerPathsLoading,
  onSkillClick,
}: CareerPathsSectionProps) {
  const { isDark } = useDarkMode();

  if (!selectedOccupationId) {
    return null;
  }

  return (
    <div className="px-6 pb-6">
      <div
        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-6 border`}
      >
        <h3
          className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-6 text-xl`}
        >
          Career Progression Paths
        </h3>

        {careerPathsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-32 w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        ) : careerPaths && careerPaths.length > 0 ? (
          <div className="space-y-6">
            {careerPaths.map((path: any) => (
              <div
                key={path.id}
                className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} rounded-lg p-5 border`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4
                      className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium text-lg`}
                    >
                      {path.path_name}
                    </h4>
                    <p
                      className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm mt-1`}
                    >
                      {path.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'}`}
                    >
                      {path.difficulty_level}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
                    >
                      {path.estimated_duration}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  {path.steps.map((step: any) => (
                    <div
                      key={step.id}
                      className={`${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50'} rounded-lg p-4 border ${isDark ? 'border-white/10' : 'border-gray-200'} transition-colors cursor-pointer`}
                      onClick={() => {
                        // TODO: Show step details modal or expand inline
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-tabiya-accent text-white text-xs font-medium">
                              {step.step_number}
                            </div>
                            <h5
                              className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}
                            >
                              {step.title}
                            </h5>
                          </div>
                          <p
                            className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm ml-9`}
                          >
                            {step.description.length > 150
                              ? `${step.description.slice(0, 150)}...`
                              : step.description}
                          </p>

                          {step.required_skills?.length > 0 && (
                            <div className="ml-9 mt-3">
                              <div className="flex flex-wrap gap-1">
                                {step.required_skills.slice(0, 5).map((skillReq: any) => (
                                  <Badge
                                    key={skillReq.skill_id}
                                    variant="outline"
                                    className={`text-xs cursor-pointer hover:bg-tabiya-accent hover:text-white transition-colors ${isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Create a minimal skill info object
                                      const skillInfo = {
                                        skill_id: skillReq.skill_id,
                                        skill_name: skillReq.skill_name,
                                      };
                                      onSkillClick(skillInfo as any);
                                    }}
                                  >
                                    {skillReq.skill_name}
                                  </Badge>
                                ))}
                                {step.required_skills.length > 5 && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${isDark ? 'border-white/30 text-white/70' : 'border-gray-300 text-gray-600'}`}
                                  >
                                    +{step.required_skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <div
                            className={`${isDark ? 'text-white/60' : 'text-gray-500'} text-xs`}
                          >
                            {step.estimated_duration}
                          </div>
                          {step.typical_salary_range && (
                            <div
                              className={`${isDark ? 'text-white/80' : 'text-gray-700'} text-sm font-medium mt-1`}
                            >
                              {step.typical_salary_range}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-center py-8`}
          >
            <div className="space-y-3">
              <div className="text-lg font-medium">No career paths available</div>
              <div className="text-sm">
                Click "Generate Career Paths" to get AI-powered career progression paths for this occupation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
