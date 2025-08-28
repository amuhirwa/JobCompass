import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  HiOutlineArrowRight,
  HiOutlineChartBar,
  HiOutlineLightBulb,
  HiOutlineMap,
  HiOutlineAcademicCap,
  HiOutlineTrendingUp,
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';

function LandPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const quickHover = {
    whileHover: {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-backgroundWhite font-inter">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full bg-backgroundWhite/95 backdrop-blur-md z-50 border-b border-softGray"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center shadow-lg mr-3">
                  <HiOutlineMap className="w-6 h-6 text-white" />
                </div>
                <span className="font-rubik font-bold text-2xl bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
                  JobCompass
                </span>
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-textBlack hover:text-primary transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#job-trends"
                className="text-textBlack hover:text-primary transition-colors font-medium"
              >
                Job Trends
              </a>
              <a
                href="#explore-occupations"
                className="text-textBlack hover:text-primary transition-colors font-medium"
              >
                Explore Occupations
              </a>
              <a
                href="#demo"
                className="text-textBlack hover:text-primary transition-colors font-medium"
              >
                Demo
              </a>
              <a
                href="#testimonials"
                className="text-textBlack hover:text-primary transition-colors font-medium"
              >
                Stories
              </a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
              >
                Sign Up Free
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-textBlack hover:text-primary hover:bg-softGray focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
              >
                {isMenuOpen ? (
                  <HiOutlineX className="block h-6 w-6" />
                ) : (
                  <HiOutlineMenu className="block h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu */}
          <motion.div
            initial={false}
            animate={
              isMenuOpen
                ? { height: 'auto', opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 bg-backgroundWhite border-t border-softGray">
              <motion.a
                whileHover={{ scale: 1.02, x: 10 }}
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-textBlack hover:text-primary hover:bg-softGray transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02, x: 10 }}
                href="#job-trends"
                className="block px-3 py-2 rounded-md text-base font-medium text-textBlack hover:text-primary hover:bg-softGray transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Job Trends
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02, x: 10 }}
                href="#explore-occupations"
                className="block px-3 py-2 rounded-md text-base font-medium text-textBlack hover:text-primary hover:bg-softGray transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Occupations
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02, x: 10 }}
                href="#demo"
                className="block px-3 py-2 rounded-md text-base font-medium text-textBlack hover:text-primary hover:bg-softGray transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Demo
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02, x: 10 }}
                href="#testimonials"
                className="block px-3 py-2 rounded-md text-base font-medium text-textBlack hover:text-primary hover:bg-softGray transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Stories
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up Free
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-backgroundWhite via-softGray/30 to-primary/5">
        {/* Animated Background Objects */}
        <div className="absolute inset-0 overflow-hidden hidden lg:block">
          {/* Floating Circles */}
          <motion.div
            animate={{
              rotate: 360,
              x: [0, 30, -30, 0],
              y: [0, -20, 20, 0],
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 right-20 w-32 h-32 border-2 border-primary/20 rounded-full"
          />

          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl transform rotate-12"
          />

          {/* Floating Skill Nodes */}
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/6 left-1/8 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center shadow-lg"
          >
            <HiOutlineAcademicCap className="w-8 h-8 text-green-600" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-1/5 right-1/8 w-20 h-20 bg-purple-500/20 rounded-xl flex items-center justify-center shadow-lg"
          >
            <HiOutlineBriefcase className="w-10 h-10 text-purple-600" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Hero Text */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center lg:text-left"
          >
            <motion.h1
              variants={fadeInUp}
              className="font-rubik font-bold text-4xl sm:text-5xl lg:text-6xl text-textBlack leading-tight mb-6"
            >
              Navigate Your
              <span className="text-primary block">Career Journey</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Discover career pathways powered by the comprehensive Tabiya
              dataset. Map your skills, explore opportunities, and unlock your
              professional potential.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(0, 101, 255, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Your Journey
                <HiOutlineArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300"
              >
                Explore Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <img
                src="/images/heroImage.png"
                alt="Career exploration visualization showing skills connecting to various job opportunities"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              {/* Floating stats overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">1000+</div>
                    <div className="text-xs text-gray-600">Jobs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">500+</div>
                    <div className="text-xs text-gray-600">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">50+</div>
                    <div className="text-xs text-gray-600">Pathways</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-softGray relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-rubik font-bold text-4xl lg:text-5xl text-textBlack mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to unlock your career potential
            </p>
          </motion.div>

          {/* Connection Lines and Cards Container */}
          <div className="relative">
            {/* Connection Lines - Desktop Only */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-0">
              {/* First connecting line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                className="absolute left-1/4 transform translate-x-8 w-1/6 h-0.5 bg-gradient-to-r from-yellow-500/40 to-primary/40"
              />
              {/* Second connecting line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                className="absolute right-1/4 transform -translate-x-8 w-1/6 h-0.5 bg-gradient-to-r from-primary/40 to-green-500/40"
              />

              {/* Animated Arrows */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute left-1/3 transform translate-x-4 -translate-y-1 text-primary/60"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="absolute right-1/3 transform -translate-x-4 -translate-y-1 text-green-500/60"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </motion.div>
            </div>

            {/* Cards */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="relative z-10 grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: HiOutlineLightBulb,
                  title: 'Enter Your Skills',
                  description:
                    'Tell us about your current skills, experience, and interests',
                  color: 'text-yellow-500',
                  bgColor: 'from-yellow-50 to-yellow-100/50',
                  borderColor: 'border-yellow-200/30',
                  iconBg: 'bg-yellow-500',
                },
                {
                  icon: HiOutlineMap,
                  title: 'Discover Pathways',
                  description:
                    'Explore career paths and job opportunities tailored to your profile',
                  color: 'text-primary',
                  bgColor: 'from-blue-50 to-blue-100/50',
                  borderColor: 'border-blue-200/30',
                  iconBg: 'bg-primary',
                },
                {
                  icon: HiOutlineAcademicCap,
                  title: 'Upskill & Grow',
                  description:
                    'Get personalized learning recommendations to bridge skill gaps',
                  color: 'text-green-500',
                  bgColor: 'from-green-50 to-green-100/50',
                  borderColor: 'border-green-200/30',
                  iconBg: 'bg-green-500',
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  {...quickHover}
                  className={`relative bg-gradient-to-br ${step.bgColor} border ${step.borderColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`${step.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="font-rubik font-bold text-xl text-textBlack mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="absolute top-4 right-4 text-gray-400/60 font-bold text-2xl">
                    0{index + 1}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-backgroundWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-rubik font-bold text-4xl lg:text-5xl text-textBlack mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to navigate your career journey with
              confidence
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {[
              {
                icon: HiOutlineGlobeAlt,
                title: 'Interactive Skill ↔ Job Explorer',
                description:
                  'Visualize connections between skills and career opportunities with our dynamic network interface',
              },
              {
                icon: HiOutlineMap,
                title: 'Career Pathway Discovery',
                description:
                  'Find multiple routes to your dream job with step-by-step career progression paths',
              },
              {
                icon: HiOutlineTrendingUp,
                title: 'Labor Market Trends Dashboard',
                description:
                  'Stay ahead with real-time insights into job market demands and salary trends',
              },
              {
                icon: HiOutlineUsers,
                title: 'Personalized Recommendations',
                description:
                  'Get tailored job suggestions and skill recommendations based on your unique profile',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                {...quickHover}
                className="bg-softGray rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-softGray/20 to-softGray/40 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg border border-softGray/20">
                  <feature.icon className="w-8 h-8 text-primary drop-shadow-sm" />
                </div>
                <h3 className="font-rubik font-bold text-xl text-textBlack mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo/Preview Section */}
      <section
        id="demo"
        className="py-20 bg-gradient-to-br from-primary/5 via-softGray/50 to-primary/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="font-rubik font-bold text-4xl lg:text-5xl text-textBlack mb-6">
                See It In Action
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience how our interactive skill-job mapping works. Click,
                explore, and discover new career possibilities in real-time.
              </p>
              <div className="space-y-4">
                {[
                  'Interactive network visualization',
                  'Real-time skill matching',
                  'Career progression paths',
                  'Market demand indicators',
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-rubik font-bold text-lg">
                      Skill-Job Network
                    </h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                      <div
                        className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                        style={{ animationDelay: '0.5s' }}
                      />
                      <div
                        className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                        style={{ animationDelay: '1s' }}
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-primary/20 rounded-lg p-3 text-center">
                        <HiOutlineBriefcase className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm font-medium">
                          Data Scientist
                        </span>
                      </div>
                      <div className="bg-green-500/20 rounded-lg p-3 text-center">
                        <HiOutlineChartBar className="w-6 h-6 mx-auto mb-2 text-green-600" />
                        <span className="text-sm font-medium">Python</span>
                      </div>
                      <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                        <HiOutlineAcademicCap className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <span className="text-sm font-medium">ML Engineer</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                      >
                        Explore Interactive Demo
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Credits Section */}
      <section className="py-16 bg-softGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="font-rubik font-bold text-2xl text-textBlack mb-4">
              Powered by Open Data
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Built on the comprehensive Tabiya Open Taxonomy of Jobs & Skills,
              providing accurate and up-to-date career information.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <img
                src="/images/tabiya_logo.png"
                alt="Tabiya"
                className="h-12 w-auto opacity-80"
              />
              <div className="text-left">
                <div className="font-semibold text-textBlack">
                  Tabiya Open Taxonomy
                </div>
                <div className="text-sm text-gray-500">
                  Jobs & Skills Dataset
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-backgroundWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-rubik font-bold text-4xl lg:text-5xl text-textBlack mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how JobCompass has helped professionals navigate their careers
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                quote:
                  'JobCompass helped me transition from marketing to UX design by showing me the exact skills I needed to develop.',
                author: 'Sarah Chen',
                role: 'UX Designer',
                company: 'Tech Startup',
              },
              {
                quote:
                  'As a recent graduate, I was lost about career options. The platform mapped out clear pathways for my computer science degree.',
                author: 'Marcus Johnson',
                role: 'Software Engineer',
                company: 'Fortune 500',
              },
              {
                quote:
                  'The labor market insights helped our organization understand emerging skill demands and adjust our training programs accordingly.',
                author: 'Dr. Elena Rodriguez',
                role: 'HR Director',
                company: 'Global Corp',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                {...quickHover}
                className="bg-softGray rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <HiOutlineStar
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-textBlack">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="font-rubik font-bold text-4xl lg:text-5xl mb-6">
              Start Your Career Journey Today
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Join thousands of professionals who have discovered their ideal
              career path through data-driven insights.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 15px 30px rgba(255, 255, 255, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-3"
            >
              Get Started Free
              <HiOutlineArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-textBlack text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center mr-3">
                  <HiOutlineMap className="w-5 h-5 text-white" />
                </div>
                <span className="font-rubik font-bold text-xl">JobCompass</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Navigate your career journey with data-driven insights powered
                by the Tabiya Open Taxonomy of Jobs & Skills.
              </p>
              <div className="flex space-x-4">
                <FaLinkedin className="w-6 h-6 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                <FaTwitter className="w-6 h-6 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                <FaGithub className="w-6 h-6 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
                <FaInstagram className="w-6 h-6 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="font-rubik font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#demo"
                    className="hover:text-white transition-colors"
                  >
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-rubik font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 JobCompass. All rights reserved. Powered by Tabiya
              Open Taxonomy.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandPage;
