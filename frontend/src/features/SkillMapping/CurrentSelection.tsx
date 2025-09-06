import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface CurrentSelectionProps {
  loading: boolean;
  selectedItem: any;
  selectedSkillId: string | null;
  selectedSkill: any;
  selectedOccupation: any;
  activeTab: 'skills' | 'occupations';
}

export function CurrentSelection({
  loading,
  selectedItem,
  selectedSkillId,
  selectedSkill,
  selectedOccupation,
  activeTab,
}: CurrentSelectionProps) {
  const { isDark } = useDarkMode();

  return (
    <div
      className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-4 border`}
    >
      <h3
        className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-3 text-lg`}
      >
        Current Selection
      </h3>
      {loading ? (
        <div
          className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg p-3`}
        >
          <Skeleton
            className={`h-6 w-24 mb-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
          />
          <Skeleton
            className={`h-4 w-32 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
          />
        </div>
      ) : selectedItem ? (
        <div className="bg-tabiya-accent/20 rounded-lg p-3 border border-tabiya-accent/30">
          <div className="text-tabiya-accent font-medium text-lg">
            {selectedItem.preferred_label}
          </div>
          <div
            className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm mt-1`}
          >
            {selectedSkillId
              ? selectedSkill?.skill_type
              : selectedOccupation?.occupation_type}
          </div>
          {(selectedItem as any).definition && (
            <p
              className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-xs mt-2`}
            >
              {(selectedItem as any).definition.length > 100
                ? `${(selectedItem as any).definition.slice(0, 100)}...`
                : (selectedItem as any).definition}
            </p>
          )}
          {selectedSkillId && selectedSkill?.reuse_level && (
            <Badge
              variant="outline"
              className={`mt-2 ${isDark ? 'border-white/20 text-white/80' : 'border-gray-300 text-gray-700'} text-xs`}
            >
              {selectedSkill.reuse_level}
            </Badge>
          )}
        </div>
      ) : (
        <div
          className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-sm`}
        >
          Select a {activeTab.slice(0, -1)} to see details
        </div>
      )}
    </div>
  );
}
