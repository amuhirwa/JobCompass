import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface MarketInsightsSectionProps {
  selectedOccupationId: string | null;
  marketInsights: any;
  marketInsightsLoading: boolean;
  generateMarketInsights: any;
  generateCareerPaths: any;
  onGenerateInsights: () => void;
  onGenerateCareerPaths: () => void;
}

export function MarketInsightsSection({
  selectedOccupationId,
  marketInsights,
  marketInsightsLoading,
  generateMarketInsights,
  generateCareerPaths,
  onGenerateInsights,
  onGenerateCareerPaths,
}: MarketInsightsSectionProps) {
  const { isDark } = useDarkMode();

  return (
    <div className="px-6 pb-6">
      <section
        className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-lg p-6 border`}
        aria-labelledby="market-insights-heading"
        role="region"
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            id="market-insights-heading"
            className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-xl`}
          >
            Market Insights
          </h3>
          {selectedOccupationId && (
            <div
              className="flex gap-2"
              role="toolbar"
              aria-label="Market insights actions"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onGenerateInsights}
                disabled={generateMarketInsights.isPending}
                className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                type="button"
                aria-describedby={
                  generateMarketInsights.isPending
                    ? 'generating-insights-status'
                    : undefined
                }
              >
                {generateMarketInsights.isPending
                  ? 'Generating...'
                  : 'Generate Insights'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onGenerateCareerPaths}
                disabled={generateCareerPaths.isPending}
                className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                type="button"
                aria-describedby={
                  generateCareerPaths.isPending
                    ? 'generating-paths-status'
                    : undefined
                }
              >
                {generateCareerPaths.isPending
                  ? 'Generating...'
                  : 'Generate Career Paths'}
              </Button>
              {generateMarketInsights.isPending && (
                <span id="generating-insights-status" className="sr-only">
                  Generating market insights, please wait
                </span>
              )}
              {generateCareerPaths.isPending && (
                <span id="generating-paths-status" className="sr-only">
                  Generating career paths, please wait
                </span>
              )}
            </div>
          )}
        </div>

        {marketInsightsLoading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            role="status"
            aria-label="Loading market insights"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton
                  className={`h-8 w-20 mx-auto mb-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                />
                <Skeleton
                  className={`h-4 w-24 mx-auto ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                />
              </div>
            ))}
          </div>
        ) : marketInsights ? (
          <div className="space-y-6">
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              role="list"
              aria-label="Market statistics"
            >
              <div className="text-center" role="listitem">
                <div
                  className="text-tabiya-accent font-bold text-3xl"
                  aria-label={`Average salary: ${marketInsights.average_salary ? '$' + marketInsights.average_salary.toLocaleString() : 'Not available'}`}
                >
                  ${marketInsights.average_salary?.toLocaleString() || 'N/A'}
                </div>
                <div
                  className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
                  id="avg-salary-label"
                >
                  Average Salary
                </div>
              </div>
              <div className="text-center" role="listitem">
                <div
                  className={`${marketInsights.growth_rate >= 0 ? 'text-green-400' : 'text-red-400'} font-bold text-3xl`}
                  aria-label={`Growth rate: ${marketInsights.growth_rate >= 0 ? 'positive' : 'negative'} ${Math.abs(marketInsights.growth_rate || 0).toFixed(1)} percent`}
                >
                  {marketInsights.growth_rate >= 0 ? '+' : ''}
                  {marketInsights.growth_rate?.toFixed(1) || '0'}%
                </div>
                <div
                  className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
                  id="growth-rate-label"
                >
                  Growth Rate
                </div>
              </div>
              <div className="text-center" role="listitem">
                <div
                  className="text-tabiya-accent font-bold text-3xl"
                  aria-label={`Remote opportunities: ${marketInsights.remote_opportunities_percentage?.toFixed(0) || '0'} percent`}
                >
                  {marketInsights.remote_opportunities_percentage?.toFixed(0) ||
                    '0'}
                  %
                </div>
                <div
                  className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
                  id="remote-opportunities-label"
                >
                  Remote Opportunities
                </div>
              </div>
              <div className="text-center" role="listitem">
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className={`text-sm w-fit ${
                      marketInsights.demand_level === 'very_high'
                        ? 'border-green-500 text-green-500'
                        : marketInsights.demand_level === 'high'
                          ? 'border-tabiya-accent text-tabiya-accent'
                          : marketInsights.demand_level === 'medium'
                            ? 'border-yellow-500 text-yellow-500'
                            : 'border-red-500 text-red-500'
                    }`}
                    aria-label={`Market demand level: ${marketInsights.demand_level?.replace('_', ' ') || 'unknown'}`}
                  >
                    {marketInsights.demand_level
                      ?.replace('_', ' ')
                      .toUpperCase() || 'UNKNOWN'}{' '}
                    Demand
                  </Badge>
                </div>
                <div
                  className={`${isDark ? 'text-white/70' : 'text-gray-600'} text-sm`}
                  id="market-demand-label"
                >
                  Market Demand
                </div>
              </div>
            </div>

            {marketInsights.market_trends && (
              <div className="space-y-4">
                <h4
                  className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium text-lg`}
                  id="market-trends-heading"
                >
                  Market Trends
                </h4>
                <div
                  className={`${isDark ? 'text-white/80' : 'text-gray-700'} text-sm leading-relaxed`}
                  aria-labelledby="market-trends-heading"
                >
                  {marketInsights.market_trends
                    .split('\n\n')
                    .map((paragraph: string, index: number) => (
                      <div key={index} className="mb-4 last:mb-0">
                        {paragraph.includes('•') ? (
                          <ul className="space-y-1" role="list">
                            {paragraph
                              .split('\n')
                              .map((line: string, lineIndex: number) => {
                                const trimmedLine = line.trim();
                                if (trimmedLine.startsWith('•')) {
                                  return (
                                    <li
                                      key={lineIndex}
                                      className="flex items-start gap-2"
                                      role="listitem"
                                    >
                                      <span
                                        className="text-tabiya-accent mt-1"
                                        aria-hidden="true"
                                      >
                                        •
                                      </span>
                                      <span className="flex-1">
                                        {trimmedLine.substring(1).trim()}
                                      </span>
                                    </li>
                                  );
                                } else if (trimmedLine) {
                                  return (
                                    <p key={lineIndex} className="mb-2">
                                      {trimmedLine}
                                    </p>
                                  );
                                }
                                return null;
                              })}
                          </ul>
                        ) : (
                          <p>{paragraph}</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {marketInsights.key_regions?.length > 0 && (
              <div className="space-y-4">
                <h4
                  className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium text-lg`}
                  id="key-regions-heading"
                >
                  Key Regions
                </h4>
                <div
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-labelledby="key-regions-heading"
                >
                  {marketInsights.key_regions.map(
                    (region: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'} text-xs`}
                        role="listitem"
                      >
                        {region}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ) : selectedOccupationId ? (
          <div
            className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-center py-8`}
            role="status"
          >
            <div className="space-y-3">
              <div className="text-lg font-medium">
                No market insights available
              </div>
              <div className="text-sm">
                Click "Generate Insights" to get AI-powered market analysis for
                this occupation.
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${isDark ? 'text-white/60' : 'text-gray-600'} text-center py-8`}
            role="status"
          >
            <div className="space-y-3">
              <div className="text-lg font-medium">
                Select an occupation to view market insights
              </div>
              <div className="text-sm">
                Choose an occupation from the career opportunities section to
                see AI-powered market analysis.
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
