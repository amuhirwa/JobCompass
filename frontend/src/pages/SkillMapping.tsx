import Navigation from '@/components/custom/Navigation';
import { Button } from '@/components/ui/button';

export default function SkillMapping() {
  return (
    <div className="min-h-screen bg-tabiya-dark w-screen overflow-x-hidden">
      <div className="w-full overflow-hidden">
        <Navigation />
      </div>

      {/* Header */}
      <div className="px-6 py-6 bg-tabiya-dark w-full">
        <h1 className="text-white font-sans text-4xl md:text-5xl font-bold mb-2">
          Skill Mapping
        </h1>
        <p className="text-white/70 font-medium text-lg mb-6 max-w-4xl">
          Explore the interconnected world of skills and careers through our
          interactive graph visualization. Discover how skills connect to
          various occupations, related competencies, and career pathways in a
          dynamic network view.
        </p>
      </div>

      {/* Main Content - Full Width Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-200px)] w-screen">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 bg-white/5 border-r border-white/10 p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search skills or industries..."
              className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-lg border border-white/20 focus:border-tabiya-accent focus:outline-none"
            />
            <svg
              className="absolute right-3 top-3 w-5 h-5 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button variant="accent" size="sm" className="flex-1 text-xs">
              Filter by Skills
            </Button>
            <Button
              variant="accent-outline"
              size="sm"
              className="flex-1 text-xs"
            >
              Filter by Group
            </Button>
          </div>

          {/* Current Selection */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3 text-lg">
              Current Selection
            </h3>
            <div className="bg-tabiya-accent/20 rounded-lg p-3 border border-tabiya-accent/30">
              <div className="text-tabiya-accent font-medium text-lg">
                JavaScript
              </div>
              <div className="text-white/70 text-sm mt-1">
                Programming Language
              </div>
            </div>
          </div>

          {/* Related Career Paths */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-lg">
              Related Career Paths
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <div>
                  <div className="text-white font-medium">Data Scientist</div>
                </div>
                <div className="text-tabiya-accent font-medium text-sm">
                  78% match
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <div>
                  <div className="text-white font-medium">Mobile Developer</div>
                </div>
                <div className="text-tabiya-accent font-medium text-sm">
                  85% match
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <div>
                  <div className="text-white font-medium">Product Manager</div>
                </div>
                <div className="text-tabiya-accent font-medium text-sm">
                  62% match
                </div>
              </div>
            </div>
          </div>

          {/* Related Skills */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-lg">
              Related Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-tabiya-accent/20 text-tabiya-accent rounded-full text-sm font-medium border border-tabiya-accent/30">
                Python
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                React
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
                SQL
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                Git
              </span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30">
                APIs
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Graph Area */}
        <div className="lg:col-span-2 bg-tabiya-dark p-4">
          <div className="bg-white/5 rounded-lg border border-white/10 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-white/60 text-xl mb-4">
                Sigma Graph Visualization
              </div>
              <div className="text-white/40 text-sm">
                Interactive graph will be inserted here
              </div>
              <div className="mt-8 w-16 h-16 bg-tabiya-accent/20 rounded-full mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 bg-white/5 border-l border-white/10 p-4 space-y-4">
          {/* Market Insights */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-lg">
              Market Insights
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-white/70 text-sm">Avg Salary</div>
                <div className="text-tabiya-accent font-bold text-xl">
                  $95,000
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Growth Rate</div>
                <div className="text-green-400 font-bold text-xl">+22%</div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Remote Jobs</div>
                <div className="text-blue-400 font-bold text-xl">68%</div>
              </div>
            </div>
          </div>

          {/* Career Path Info */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-lg">
              Career Path
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white/90 text-sm">
                  Junior Developer (2-3 years)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-tabiya-accent rounded-full"></div>
                <span className="text-white/90 text-sm">
                  Senior Developer (4-6 years)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-white/90 text-sm">
                  Tech Lead (7+ years)
                </span>
              </div>
            </div>
          </div>

          {/* Connection Info */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-center space-y-4">
              <div>
                <div className="text-white/70 text-sm">Connected Skills</div>
                <div className="text-white font-bold text-2xl">47</div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Related Jobs</div>
                <div className="text-white font-bold text-2xl">23</div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="accent" size="sm" className="flex-1 text-xs">
                  Explore Path
                </Button>
                <Button
                  variant="accent-outline"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  Save View
                </Button>
              </div>
              <Button
                variant="default"
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-xs"
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
