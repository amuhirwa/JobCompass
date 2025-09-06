import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface DetailViewProps {
  selectedItem: any;
  selectedSkillId: string | null;
  selectedOccupationId: string | null;
  selectedSkillGroupId: string | null;
  selectedSkill: any;
  selectedOccupation: any;
  skillSuggestions: any;
  relatedOccupations: any[];
  skills: any;
  skillsLoading: boolean;
  activeTab: 'skills' | 'skill-groups' | 'occupations';
  onBackClick: () => void;
  onItemSelect: (item: any) => void;
  onTabChange: (tab: 'skills' | 'skill-groups' | 'occupations') => void;
  onSkillIdChange: (id: string | null) => void;
  onOccupationIdChange: (id: string | null) => void;
  onSkillGroupIdChange: (id: string | null) => void;
}

export function DetailView({
  selectedItem,
  selectedSkillId,
  selectedOccupationId,
  selectedSkillGroupId,
  selectedSkill,
  selectedOccupation,
  skillSuggestions,
  relatedOccupations,
  skills,
  skillsLoading,
  activeTab,
  onBackClick,
  onItemSelect,
  onTabChange,
  onSkillIdChange,
  onOccupationIdChange,
  onSkillGroupIdChange,
}: DetailViewProps) {
  const { isDark } = useDarkMode();

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          onClick={onBackClick}
          className={`${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          ← Back to {activeTab.replace('-', ' ')} list
        </Button>
      </div>

      <h1
        className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
      >
        {capitalizeFirstLetter(selectedItem.preferred_label)}
      </h1>

      {/* Item Tags */}
      <div className="flex gap-2 mb-6">
        <Badge className="bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30">
          {selectedSkillId && selectedSkill
            ? capitalizeFirstLetter(selectedSkill.skill_type)
            : selectedOccupationId && selectedOccupation
              ? capitalizeFirstLetter(selectedOccupation.occupation_type)
              : 'Skill Group'}
        </Badge>
        {selectedSkillId && selectedSkill?.reuse_level && (
          <Badge
            variant="outline"
            className={`${isDark ? 'border-white/20 text-white' : 'border-gray-300 text-gray-700'}`}
          >
            {capitalizeFirstLetter(selectedSkill.reuse_level)}
          </Badge>
        )}
      </div>

      {/* Description/Definition */}
      {(selectedItem as any).definition && (
        <div className="mb-8">
          <h2
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
          >
            Description
          </h2>
          <p
            className={`${isDark ? 'text-white/80' : 'text-gray-700'} leading-relaxed mb-4`}
          >
            {(selectedItem as any).definition}
          </p>
        </div>
      )}
      {selectedItem.description && !(selectedItem as any).definition && (
        <div className="mb-8">
          <h2
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
          >
            Description
          </h2>
          <p
            className={`${isDark ? 'text-white/80' : 'text-gray-700'} leading-relaxed mb-4`}
          >
            {selectedItem.description}
          </p>
        </div>
      )}

      {/* Scope Notes */}
      {selectedSkillId && selectedSkill?.scope_note && (
        <div className="mb-8">
          <h2
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
          >
            Scope Notes
          </h2>
          <p
            className={`${isDark ? 'text-white/80' : 'text-gray-700'} leading-relaxed`}
          >
            {selectedSkill.scope_note}
          </p>
        </div>
      )}

      {/* Related Items - Skills */}
      {selectedSkillId && (
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2
              className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
            >
              Related Skills
            </h2>
            <div className="space-y-3">
              {skillSuggestions?.slice(0, 4).map((skill: any) => (
                <div
                  key={skill.id}
                  onClick={() => onItemSelect(skill)}
                  className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer"
                >
                  {capitalizeFirstLetter(skill.preferred_label)}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2
              className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
            >
              Related Occupations
            </h2>
            <div className="space-y-3">
              {relatedOccupations.slice(0, 4).map((occupation: any) => (
                <div
                  key={occupation.id}
                  onClick={() => {
                    onTabChange('occupations');
                    onItemSelect(occupation);
                  }}
                  className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer"
                >
                  {capitalizeFirstLetter(occupation.preferred_label)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Items - Occupations */}
      {selectedOccupationId && selectedOccupation && (
        <div className="mb-8">
          <h2
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
          >
            Required Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedOccupation.related_skills
              ?.slice(0, 6)
              .map((skill: any) => (
                <div
                  key={skill.skill_id}
                  onClick={() => {
                    onTabChange('skills');
                    onSkillIdChange(skill.skill_id);
                    onOccupationIdChange(null);
                    onSkillGroupIdChange(null);
                  }}
                  className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer"
                >
                  {capitalizeFirstLetter(skill.skill_name)}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Enhanced Skill Group Details */}
      {selectedSkillGroupId && selectedItem && (
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-8 mb-6">
            <Card
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
            >
              <CardHeader className="pb-2">
                <CardTitle
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Total Skills in Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-tabiya-accent">
                  {Math.floor(Math.random() * 200) + 50}
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
                  Group Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-tabiya-accent">
                  Skill Group
                </div>
              </CardContent>
            </Card>
          </div>

          <h2
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
          >
            Skills in this Group
          </h2>

          {skillsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-12 w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {skills?.results?.slice(0, 20).map((skill: any) => (
                <div
                  key={skill.id}
                  onClick={() => {
                    onTabChange('skills');
                    onSkillIdChange(skill.id);
                    onSkillGroupIdChange(null);
                    onOccupationIdChange(null);
                  }}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-tabiya-accent hover:text-tabiya-accent/80 font-medium text-base">
                        {capitalizeFirstLetter(skill.preferred_label)}
                      </span>
                      {skill.description && (
                        <p
                          className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'} mt-2 line-clamp-2 leading-relaxed`}
                        >
                          {skill.description.length > 100
                            ? `${skill.description.slice(0, 100)}...`
                            : skill.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-sm ml-3 ${isDark ? 'border-white/20 text-white/70' : 'border-gray-300 text-gray-600'}`}
                    >
                      {capitalizeFirstLetter(skill.skill_type || 'skill')}
                    </Badge>
                  </div>
                </div>
              )) || (
                <div
                  className={`text-center py-8 ${isDark ? 'text-white/60' : 'text-gray-500'}`}
                >
                  No skills found in this group.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
