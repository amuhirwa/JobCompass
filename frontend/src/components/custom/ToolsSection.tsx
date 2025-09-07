import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { ScrollAnimation } from '@/components/ui/scroll-animation';

export const ToolsSection = () => {
  const { isDark } = useDarkMode();

  return (
    <section
      id="tools"
      className={`w-full px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28 ${isDark ? 'bg-gradient-to-br from-tabiya-dark via-tabiya-medium/10 to-tabiya-dark' : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50'} relative overflow-hidden`}
      aria-labelledby="tools-heading"
    >
      <div className="w-full max-w-7xl mx-auto">
        <ScrollAnimation className="text-center mb-16">
          <p
            className="text-tabiya-accent font-sans text-sm font-medium uppercase tracking-wide mb-4"
            aria-label="Section category"
          >
            Powerful Tools
          </p>
          <h2
            id="tools-heading"
            className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-3xl sm:text-4xl md:text-5xl font-bold leading-[110%] mb-6 max-w-4xl mx-auto`}
          >
            Everything You Need for Career Success
          </h2>
          <p
            className={`${isDark ? 'text-white/90' : 'text-gray-700'} font-sans text-lg font-medium leading-[140%] max-w-3xl mx-auto`}
            id="tools-description"
          >
            Discover our comprehensive suite of AI-powered tools designed to
            accelerate your career growth and skill development journey.
          </p>
        </ScrollAnimation>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12"
          role="grid"
          aria-labelledby="tools-heading"
        >
          <Card
            className={`${isDark ? 'bg-tabiya-dark/50 border-white/10 hover:border-tabiya-accent/30' : 'bg-white border-gray-200 hover:border-tabiya-accent/50'} border transition-all duration-300 group backdrop-blur-sm shadow-lg hover:shadow-xl`}
            role="article"
            aria-labelledby="ai-assistant-title"
            aria-describedby="ai-assistant-desc"
          >
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 ${isDark ? 'bg-tabiya-accent/20 group-hover:bg-tabiya-accent/30' : 'bg-tabiya-accent/10 group-hover:bg-tabiya-accent/20'} rounded-2xl flex items-center justify-center transition-colors duration-300`}
                  aria-hidden="true"
                >
                  <span className="text-2xl" role="img" aria-label="Robot icon">
                    🤖
                  </span>
                </div>
                <div>
                  <h3
                    id="ai-assistant-title"
                    className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-xl font-bold`}
                  >
                    AI Career Assistant
                  </h3>
                  <Badge
                    className={`${isDark ? 'bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30' : 'bg-tabiya-accent/10 text-tabiya-accent border-tabiya-accent/20'} mt-2`}
                  >
                    AI Powered
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p
                id="ai-assistant-desc"
                className={`${isDark ? 'text-white/80' : 'text-gray-700'} font-sans text-base leading-[150%] mb-6 font-medium`}
              >
                A smart chatbot powered by AI that helps you discover the best
                resources to grow your skills. Whether you want to master a new
                technology, improve your soft skills, or prepare for a specific
                career path, the assistant provides tailored suggestions to
                guide your learning journey.
              </p>
              <Button
                variant="read-more"
                className="text-tabiya-accent hover:text-white font-sans text-sm font-semibold p-0 h-auto group focus:ring-2 focus:ring-tabiya-accent focus:ring-offset-2 focus:outline-none"
                aria-describedby="ai-assistant-desc"
              >
                Try Assistant
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
                </svg>
              </Button>
            </CardContent>
          </Card>

          <Card
            className={`${isDark ? 'bg-tabiya-dark/50 border-white/10 hover:border-tabiya-accent/30' : 'bg-white border-gray-200 hover:border-tabiya-accent/50'} border transition-all duration-300 group backdrop-blur-sm shadow-lg hover:shadow-xl`}
            role="article"
            aria-labelledby="jobs-map-title"
            aria-describedby="jobs-map-desc"
          >
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 ${isDark ? 'bg-tabiya-accent/20 group-hover:bg-tabiya-accent/30' : 'bg-tabiya-accent/10 group-hover:bg-tabiya-accent/20'} rounded-2xl flex items-center justify-center transition-colors duration-300`}
                  aria-hidden="true"
                >
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label="Location pin icon"
                  >
                    📍
                  </span>
                </div>
                <div>
                  <h3
                    id="jobs-map-title"
                    className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-xl font-bold`}
                  >
                    Jobs Around You
                  </h3>
                  <Badge
                    className={`${isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-500/10 text-green-600 border-green-500/20'} mt-2`}
                  >
                    Real-time
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p
                id="jobs-map-desc"
                className={`${isDark ? 'text-white/80' : 'text-gray-700'} font-sans text-base leading-[150%] mb-6 font-medium`}
              >
                An interactive map that lets you explore real-time job
                opportunities near your location. With this tool, you can easily
                see which industries are hiring in your area, filter jobs by
                role or skills, and even discover new opportunities you may not
                have considered.
              </p>
              <Button
                variant="read-more"
                className={`text-tabiya-accent font-sans text-sm font-semibold ${isDark ? 'hover:text-white' : 'hover:text-tabiya-accent/80'} transition-colors group p-0 h-auto focus:ring-2 focus:ring-tabiya-accent focus:ring-offset-2 focus:outline-none`}
                aria-describedby="jobs-map-desc"
              >
                Explore Map
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
                </svg>
              </Button>
            </CardContent>
          </Card>

          <Card
            className={`${isDark ? 'bg-tabiya-dark/50 border-white/10 hover:border-tabiya-accent/30' : 'bg-white border-gray-200 hover:border-tabiya-accent/50'} border transition-all duration-300 group backdrop-blur-sm shadow-lg hover:shadow-xl`}
            role="article"
            aria-labelledby="skill-graph-title"
            aria-describedby="skill-graph-desc"
          >
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 ${isDark ? 'bg-tabiya-accent/20 group-hover:bg-tabiya-accent/30' : 'bg-tabiya-accent/10 group-hover:bg-tabiya-accent/20'} rounded-2xl flex items-center justify-center transition-colors duration-300`}
                  aria-hidden="true"
                >
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label="Connection network icon"
                  >
                    🔗
                  </span>
                </div>
                <div>
                  <h3
                    id="skill-graph-title"
                    className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-xl font-bold`}
                  >
                    Skill Graph Explorer
                  </h3>
                  <Badge
                    className={`${isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'} mt-2`}
                  >
                    Interactive
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p
                id="skill-graph-desc"
                className={`${isDark ? 'text-white/80' : 'text-gray-700'} font-sans text-base leading-[150%] mb-6 font-medium`}
              >
                A powerful visualization tool that shows how skills are
                connected to each other and to occupations. Starting from your
                current skills, you can explore related skills, see which jobs
                they unlock, and plan a clear pathway to career growth.
              </p>
              <Button
                variant="read-more"
                className={`text-tabiya-accent font-sans text-sm font-semibold ${isDark ? 'hover:text-white' : 'hover:text-tabiya-accent/80'} transition-colors group p-0 h-auto focus:ring-2 focus:ring-tabiya-accent focus:ring-offset-2 focus:outline-none`}
                aria-describedby="skill-graph-desc"
              >
                View Graph
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
                </svg>
              </Button>
            </CardContent>
          </Card>

          <Card
            className={`${isDark ? 'bg-tabiya-dark/50 border-white/10 hover:border-tabiya-accent/30' : 'bg-white border-gray-200 hover:border-tabiya-accent/50'} border transition-all duration-300 group backdrop-blur-sm shadow-lg hover:shadow-xl`}
            role="article"
            aria-labelledby="community-title"
            aria-describedby="community-desc"
          >
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 ${isDark ? 'bg-tabiya-accent/20 group-hover:bg-tabiya-accent/30' : 'bg-tabiya-accent/10 group-hover:bg-tabiya-accent/20'} rounded-2xl flex items-center justify-center transition-colors duration-300`}
                  aria-hidden="true"
                >
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label="Speech bubble icon"
                  >
                    💬
                  </span>
                </div>
                <div>
                  <h3
                    id="community-title"
                    className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-xl font-bold`}
                  >
                    Community Insights
                  </h3>
                  <Badge
                    className={`${isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-500/10 text-purple-600 border-purple-500/20'} mt-2`}
                  >
                    Social
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p
                id="community-desc"
                className={`${isDark ? 'text-white/80' : 'text-gray-700'} font-sans text-base leading-[150%] mb-6 font-medium`}
              >
                A space where you can connect with other learners,
                professionals, and career explorers. Ask questions, share
                experiences, and gain valuable insights about skills,
                industries, and career strategies. This tool turns learning into
                a collaborative experience.
              </p>
              <Button
                variant="read-more"
                className={`text-tabiya-accent font-sans text-sm font-semibold ${isDark ? 'hover:text-white' : 'hover:text-tabiya-accent/80'} transition-colors group p-0 h-auto focus:ring-2 focus:ring-tabiya-accent focus:ring-offset-2 focus:outline-none`}
                aria-describedby="community-desc"
              >
                Join Community
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
                </svg>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card
          className={`${isDark ? 'bg-tabiya-dark/30 border-tabiya-accent/20' : 'bg-white border-tabiya-accent/30'} border backdrop-blur-sm shadow-lg hover:border-tabiya-accent/40 transition-all duration-300 group hover:shadow-xl`}
          role="article"
          aria-labelledby="tabiya-explorer-title"
          aria-describedby="tabiya-explorer-desc"
        >
          <CardContent className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex-shrink-0">
                <div
                  className={`w-24 h-24 ${isDark ? 'bg-tabiya-accent/20 group-hover:bg-tabiya-accent/30' : 'bg-tabiya-accent/10 group-hover:bg-tabiya-accent/20'} rounded-3xl flex items-center justify-center transition-colors duration-300`}
                  aria-hidden="true"
                >
                  <span className="text-4xl" role="img" aria-label="Books icon">
                    📚
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  <h3
                    id="tabiya-explorer-title"
                    className={`${isDark ? 'text-white' : 'text-gray-900'} font-sans text-2xl font-bold`}
                  >
                    Tabiya Dataset Explorer
                  </h3>
                  <Badge
                    className={`${isDark ? 'bg-tabiya-accent/20 text-tabiya-accent border-tabiya-accent/30' : 'bg-tabiya-accent/10 text-tabiya-accent border-tabiya-accent/20'}`}
                  >
                    Featured
                  </Badge>
                </div>
                <p
                  id="tabiya-explorer-desc"
                  className={`${isDark ? 'text-white/80' : 'text-gray-700'} font-sans text-lg leading-[150%] mb-6 max-w-3xl font-medium`}
                >
                  A simplified interface for exploring the Tabiya dataset. You
                  can stumble upon new skills, understand how they fit into the
                  wider labor market, and identify potential learning paths.
                  This tool makes structured career data more accessible and
                  engaging for everyday use.
                </p>
                <Button
                  variant="accent"
                  size="cta"
                  className="font-sans font-semibold focus:ring-2 focus:ring-tabiya-accent focus:ring-offset-2 focus:outline-none"
                  aria-describedby="tabiya-explorer-desc"
                >
                  Explore Dataset
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
