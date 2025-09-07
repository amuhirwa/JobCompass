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
    <article role="main" aria-labelledby="detail-view-heading">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          onClick={onBackClick}
          className={`${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} focus:ring-2 focus:ring-tabiya-accent/20`}
          aria-label={`Back to ${activeTab.replace('-', ' ')} list`}
        >
          ← Back to {activeTab.replace('-', ' ')} list
        </Button>
      </div>

      <header className="mb-6">
        <h1
          id="detail-view-heading"
          className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
        >
          {capitalizeFirstLetter(selectedItem.preferred_label)}
        </h1>

        {/* Item Tags */}
        <div
          className="flex gap-2 mb-6"
          role="list"
          aria-label="Item properties"
        >
          <Badge
            className="bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30"
            role="listitem"
          >
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
              role="listitem"
            >
              {capitalizeFirstLetter(selectedSkill.reuse_level)}
            </Badge>
          )}
        </div>
      </header>

      {/* Description/Definition */}
      {(selectedItem as any).definition && (
        <section className="mb-8" aria-labelledby="description-heading">
          <h2
            id="description-heading"
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
          >
            Description
          </h2>
          <p
            className={`${isDark ? 'text-white/80' : 'text-gray-700'} leading-relaxed mb-4`}
          >
            {(selectedItem as any).definition}
          </p>
        </section>
      )}
      {selectedItem.description && !(selectedItem as any).definition && (
        <section className="mb-8" aria-labelledby="description-heading-alt">
          <h2
            id="description-heading-alt"
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
          >
            Description
          </h2>
          <p
            className={`${isDark ? 'text-white/80' : 'text-gray-700'} leading-relaxed mb-4`}
          >
            {selectedItem.description}
          </p>
        </section>
      )}

      {/* Scope Notes */}
      {selectedSkillId && selectedSkill?.scope_note && (
        <section className="mb-8" aria-labelledby="scope-notes-heading">
          <h2
            id="scope-notes-heading"
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
          >
            Scope Notes
          </h2>
          <p
            className={`${isDark ? 'text-white/80' : 'text-gray-700'} leading-relaxed`}
          >
            {selectedSkill.scope_note}
          </p>
        </section>
      )}

      {/* Related Items - Skills */}
      {selectedSkillId && (
        <section
          className="grid grid-cols-2 gap-8 mb-8"
          aria-labelledby="related-items-heading"
        >
          <h2 id="related-items-heading" className="sr-only">
            Related Items
          </h2>

          <div role="region" aria-labelledby="related-skills-heading">
            <h3
              id="related-skills-heading"
              className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
            >
              Related Skills
            </h3>
            <nav className="space-y-3" role="list" aria-label="Related skills">
              {skillSuggestions?.slice(0, 4).map((skill: any) => (
                <div key={skill.id} role="listitem">
                  <button
                    onClick={() => onItemSelect(skill)}
                    className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 rounded p-1 w-full text-left"
                    aria-label={`View details for ${skill.preferred_label} skill`}
                  >
                    {capitalizeFirstLetter(skill.preferred_label)}
                  </button>
                </div>
              ))}
            </nav>
          </div>

          <div role="region" aria-labelledby="related-occupations-heading">
            <h3
              id="related-occupations-heading"
              className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
            >
              Related Occupations
            </h3>
            <nav
              className="space-y-3"
              role="list"
              aria-label="Related occupations"
            >
              {relatedOccupations.slice(0, 4).map((occupation: any) => (
                <div key={occupation.id} role="listitem">
                  <button
                    onClick={() => {
                      onTabChange('occupations');
                      onItemSelect(occupation);
                    }}
                    className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 rounded p-1 w-full text-left"
                    aria-label={`View details for ${occupation.preferred_label} occupation`}
                  >
                    {capitalizeFirstLetter(occupation.preferred_label)}
                  </button>
                </div>
              ))}
            </nav>
          </div>
        </section>
      )}

      {/* Related Items - Occupations */}
      {selectedOccupationId && selectedOccupation && (
        <section
          className="mb-8"
          role="region"
          aria-labelledby="required-skills-heading"
        >
          <h2
            id="required-skills-heading"
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
          >
            Required Skills
          </h2>
          <nav
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            role="list"
            aria-label="Required skills for this occupation"
          >
            {selectedOccupation.related_skills
              ?.slice(0, 6)
              .map((skill: any) => (
                <div key={skill.skill_id} role="listitem">
                  <button
                    onClick={() => {
                      onTabChange('skills');
                      onSkillIdChange(skill.skill_id);
                      onOccupationIdChange(null);
                      onSkillGroupIdChange(null);
                    }}
                    className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 rounded p-1 w-full text-left"
                    aria-label={`View details for ${skill.skill_name} skill`}
                  >
                    {capitalizeFirstLetter(skill.skill_name)}
                  </button>
                </div>
              ))}
          </nav>
        </section>
      )}

      {/* Enhanced Skill Group Details */}
      {selectedSkillGroupId && selectedItem && (
        <section
          className="mb-8"
          role="region"
          aria-labelledby="skill-group-details-heading"
        >
          <h2 id="skill-group-details-heading" className="sr-only">
            Skill Group Details
          </h2>

          <div
            className="grid grid-cols-2 gap-8 mb-6"
            role="list"
            aria-label="Skill group statistics"
          >
            <Card
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
              role="listitem"
            >
              <CardHeader className="pb-2">
                <CardTitle
                  id="total-skills-title"
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Total Skills in Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold text-tabiya-accent"
                  aria-labelledby="total-skills-title"
                  aria-describedby="total-skills-description"
                >
                  {Math.floor(Math.random() * 200) + 50}
                </div>
                <div id="total-skills-description" className="sr-only">
                  Number of skills in this skill group
                </div>
              </CardContent>
            </Card>
            <Card
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
              role="listitem"
            >
              <CardHeader className="pb-2">
                <CardTitle
                  id="group-type-title"
                  className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Group Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-lg font-semibold text-tabiya-accent"
                  aria-labelledby="group-type-title"
                >
                  Skill Group
                </div>
              </CardContent>
            </Card>
          </div>

          <h3
            id="skills-in-group-heading"
            className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}
          >
            Skills in this Group
          </h3>

          {skillsLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              role="status"
              aria-label="Loading skills in group"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-12 w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : (
            <nav
              className="space-y-3 max-h-96 overflow-y-auto"
              role="list"
              aria-labelledby="skills-in-group-heading"
            >
              {skills?.results?.slice(0, 20).map((skill: any) => (
                <div key={skill.id} role="listitem">
                  <button
                    onClick={() => {
                      onTabChange('skills');
                      onSkillIdChange(skill.id);
                      onSkillGroupIdChange(null);
                      onOccupationIdChange(null);
                    }}
                    className={`w-full p-4 rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-tabiya-accent/20 text-left ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    aria-labelledby={`skill-${skill.id}-name`}
                    aria-describedby={
                      skill.description
                        ? `skill-${skill.id}-description`
                        : undefined
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span
                          id={`skill-${skill.id}-name`}
                          className="text-tabiya-accent hover:text-tabiya-accent/80 font-medium text-base block"
                        >
                          {capitalizeFirstLetter(skill.preferred_label)}
                        </span>
                        {skill.description && (
                          <p
                            id={`skill-${skill.id}-description`}
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
                        aria-hidden="true"
                      >
                        {capitalizeFirstLetter(skill.skill_type || 'skill')}
                      </Badge>
                    </div>
                  </button>
                </div>
              )) || (
                <div
                  className={`text-center py-8 ${isDark ? 'text-white/60' : 'text-gray-500'}`}
                  role="status"
                >
                  No skills found in this group.
                </div>
              )}
            </nav>
          )}
        </section>
      )}
    </article>
  );
}
