import Navigation from '@/components/custom/Navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function TabiyaDatasetExplorer() {
  const [selectedSkill, setSelectedSkill] = useState('Machine Learning');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-tabiya-dark w-screen overflow-x-hidden">
      <div className="w-full overflow-hidden">
        <Navigation />
      </div>

      <div className="flex w-full">
        {/* Left Sidebar */}
        <div className="w-80 bg-white/5 border-r border-white/10 min-h-screen p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white/80"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">
                Tabiya Dataset Explorer
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search skills or occupations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/60 rounded-lg border border-white/20 focus:border-tabiya-accent focus:outline-none"
              />
            </div>

            <Button className="w-full bg-tabiya-accent hover:bg-tabiya-accent/90 text-white mb-6">
              My Bookmarks
            </Button>
          </div>

          {/* Filters Section */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10 text-tabiya-accent focus:ring-tabiya-accent"
                />
                <span className="text-sm text-white/80">
                  Cross-sector skills only
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10 text-tabiya-accent focus:ring-tabiya-accent"
                />
                <span className="text-sm text-white/80">
                  Local occupations only
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10 text-tabiya-accent focus:ring-tabiya-accent"
                />
                <span className="text-sm text-white/80">Emerging skills</span>
              </label>
            </div>
          </div>

          {/* Skill Groups */}
          <div className="mb-8">
            <h3 className="font-semibold text-white mb-4">Skill Groups</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-white/80">Technical Skills</span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                  247
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-white/80">
                  Communication Skills
                </span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                  89
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-white/80">Analytical Skills</span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                  156
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-white/80">
                  Operational Skills
                </span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                  203
                </span>
              </div>
              <div className="text-sm text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer mt-3">
                Project Management
              </div>
              <div className="text-sm text-white/70 hover:text-tabiya-accent cursor-pointer">
                Quality Control
              </div>
              <div className="text-sm text-white/70 hover:text-tabiya-accent cursor-pointer">
                Process Optimization
              </div>
            </div>
          </div>

          {/* Occupation Groups */}
          <div>
            <h3 className="font-semibold text-white mb-4">Occupation Groups</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-white/80">Technology</span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                  45
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-white/80">Healthcare</span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                  67
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-white/80">Education</span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                  32
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-white/80">Finance</span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                  28
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 bg-tabiya-dark">
          {/* Navigation Tabs */}
          <div className="flex gap-1 mb-8 border-b border-white/10">
            <button className="px-4 py-2 text-sm font-medium text-tabiya-accent border-b-2 border-tabiya-accent">
              Home
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white/70 hover:text-tabiya-accent">
              Skill Groups
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white/70 hover:text-tabiya-accent">
              Technical Skills
            </button>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-4">
              {selectedSkill}
            </h1>

            {/* Skill Tags */}
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-tabiya-accent/20 text-tabiya-accent text-sm font-medium rounded-full border border-tabiya-accent/30">
                technical
              </span>
              <span className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20">
                Cross-sector
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">
                Description
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                The ability to design, develop, and implement machine learning
                algorithms and models to solve complex problems, make patterns,
                and make predictions based on historical data.
              </p>
            </div>

            {/* Scope Notes */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">
                Scope Notes
              </h2>
              <p className="text-white/80 leading-relaxed">
                Includes supervised and unsupervised learning techniques, neural
                networks, deep learning, natural language processing, and
                computer vision applications.
              </p>
            </div>

            {/* Related Skills and Occupations */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">
                  Related Skills
                </h2>
                <div className="space-y-3">
                  <div className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer">
                    Python Programming
                  </div>
                  <div className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer">
                    Statistical Analysis
                  </div>
                  <div className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer">
                    Data Mining
                  </div>
                  <div className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer">
                    Deep Learning
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-4">
                  Related Occupations
                </h2>
                <div className="space-y-3">
                  <div className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer">
                    Data Scientist
                  </div>
                  <div className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer">
                    AI Engineer
                  </div>
                  <div className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer">
                    Research Scientist
                  </div>
                  <div className="text-tabiya-accent hover:text-tabiya-accent/80 cursor-pointer">
                    Business Analyst
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Occupation Assistant */}
          <div className="fixed bottom-8 right-8 max-w-sm">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-white/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-tabiya-accent/20 rounded-full flex items-center justify-center flex-shrink-0 border border-tabiya-accent/30">
                  <svg
                    className="w-4 h-4 text-tabiya-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm">
                    Skills & Occupation Assistant
                  </h3>
                  <p className="text-white/70 text-xs mt-1">
                    Hi! I'm here to help you explore Tabiya's taxonomy. You can
                    ask me about skills, occupations, or their relationships.
                    Try asking:
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-white/60 mb-3">
                <div>"What jobs require Data Science skills?"</div>
                <div>"Tell me about Data Science skills"</div>
                <div>"Most in demand tech skills"</div>
              </div>

              <div className="bg-white/10 rounded p-2 mb-3 border border-white/20">
                <div className="text-xs font-medium text-white mb-1">
                  What skills are required for a Data Scientist role?
                </div>
                <div className="text-xs text-white/80">
                  Based on our taxonomy, Data Scientists typically need these
                  key skills:
                </div>
                <div className="space-y-1 mt-2">
                  <div className="text-xs text-tabiya-accent">
                    Machine Learning
                  </div>
                  <div className="text-xs text-tabiya-accent">
                    Statistical Analysis
                  </div>
                  <div className="text-xs text-tabiya-accent">
                    Python Programming
                  </div>
                  <div className="text-xs text-tabiya-accent">
                    Data Visualization
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about skills or occupations..."
                  className="flex-1 px-3 py-2 text-xs bg-white/10 text-white placeholder-white/60 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-tabiya-accent focus:border-tabiya-accent"
                />
                <Button
                  size="sm"
                  className="bg-tabiya-accent hover:bg-tabiya-accent/90 px-3"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
