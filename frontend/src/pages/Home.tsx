import { useState } from "react";

const Home = () => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-tabiya-dark text-white">
      {/* Hero Section */}
      <section className="w-full px-16 py-20 bg-tabiya-dark">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center min-h-[900px]">
            {/* Left Content */}
            <div className="flex-1 pr-20">
              <div className="max-w-none">
                <h1 className="text-white font-space-mono text-7xl font-normal leading-[120%] tracking-[-0.72px] mb-6">
                  Discover Your Path in the World of Work
                </h1>
                <p className="text-white font-inter text-lg font-normal leading-[150%] mb-8">
                  At Tabiya, we empower individuals to explore the vast
                  landscape of jobs and skills. Our mission is to make the
                  connections between occupations clearer and more accessible,
                  helping you navigate your career journey.
                </p>
                <div className="flex items-start gap-4">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-tabiya-accent border border-tabiya-accent text-white font-inter text-base font-medium leading-6 hover:bg-white hover:text-tabiya-dark transition-colors">
                    Explore
                  </button>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-inter text-base font-medium leading-6 hover:bg-white hover:text-tabiya-dark transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Image Columns */}
            <div className="flex-1 flex gap-4 h-[900px] relative">
              <div className="flex flex-col gap-4 w-1/2 transform translate-y-[-100px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/08f049040e7e14881aa077d0f299b083e7bdc2ca?width=623"
                  alt="Career exploration"
                  className="w-full aspect-[77/82] object-cover"
                />
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/2733900e63b37a281a3197b89178581ed6aa52e8?width=623"
                  alt="Professional development"
                  className="w-full aspect-[77/82] object-cover"
                />
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/06f445d48cc27572897e6baf41b9f1b51e5b6502?width=623"
                  alt="Skills assessment"
                  className="w-full aspect-[77/82] object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 w-1/2 transform translate-y-[-50px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/133b6f62c0ddedbe91c116845a8fe3f43a144ee5?width=623"
                  alt="Job opportunities"
                  className="w-full aspect-[77/82] object-cover"
                />
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/fb964eae91a7157c5fe531c08c77b5b5dd0fb411?width=623"
                  alt="Career guidance"
                  className="w-full aspect-[77/82] object-cover"
                />
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/fab795cc1b18b961d4f382355434f7d412166de6?width=623"
                  alt="Industry insights"
                  className="w-full aspect-[77/82] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-16 py-28 bg-tabiya-dark">
        <div className="max-w-8xl mx-auto">
          <h2 className="text-white text-center font-space-mono text-5xl font-normal leading-[120%] tracking-[-0.44px] mb-20 max-w-4xl mx-auto">
            Discover the intricate connections between jobs and skills
            effortlessly.
          </h2>

          <div className="flex gap-12">
            {/* Feature 1 */}
            <div className="flex-1">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/5066489b675e4c4283879d436419dad5dba894ac?width=789"
                alt="Skill pathways"
                className="w-full h-60 object-cover mb-8"
              />
              <div className="text-center">
                <h3 className="text-white font-space-mono text-3xl font-normal leading-[140%] tracking-[-0.28px] mb-4">
                  Navigate your career journey with personalized skill pathways.
                </h3>
                <p className="text-white font-inter text-base font-normal leading-[150%] mb-8">
                  Stay informed with real-time insights into labor market
                  trends.
                </p>
                <button className="flex items-center justify-center gap-2 mx-auto text-white font-inter text-base font-medium leading-6 hover:text-tabiya-accent transition-colors">
                  Explore
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.38721 6.67285C9.48803 6.67285 9.56501 6.70326 9.64307 6.78125L14.5874 11.7256C14.6413 11.7795 14.6665 11.8215 14.6782 11.8496V11.8506C14.693 11.8861 14.7017 11.9259 14.7017 11.9746C14.7017 12.0233 14.693 12.0631 14.6782 12.0986V12.0996C14.6665 12.1277 14.6413 12.1697 14.5874 12.2236L9.61865 17.1924C9.54088 17.2702 9.47374 17.292 9.39307 17.2891C9.29904 17.2856 9.21818 17.2537 9.13232 17.168C9.0542 17.0898 9.02295 17.013 9.02295 16.9121C9.02295 16.8112 9.0542 16.7344 9.13232 16.6562L13.814 11.9746L9.10693 7.26758C9.02927 7.18988 9.00733 7.12357 9.01025 7.04297C9.0137 6.9487 9.04627 6.86731 9.13232 6.78125C9.21025 6.70344 9.28662 6.67293 9.38721 6.67285Z"
                      fill="white"
                      stroke="white"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex-1">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/f5286c84647f88f57f08fd9a0dbcc10afdf39e50?width=789"
                alt="Skill development"
                className="w-full h-60 object-cover mb-8"
              />
              <div className="text-center">
                <h3 className="text-white font-space-mono text-3xl font-normal leading-[140%] tracking-[-0.28px] mb-4">
                  Unlock your potential with tailored skill development
                  opportunities.
                </h3>
                <p className="text-white font-inter text-base font-normal leading-[150%] mb-8">
                  Identify the skills needed for your dream job and bridge the
                  gap.
                </p>
                <button className="flex items-center justify-center gap-2 mx-auto text-white font-inter text-base font-medium leading-6 hover:text-tabiya-accent transition-colors">
                  Learn
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.38721 6.67285C9.48803 6.67285 9.56501 6.70326 9.64307 6.78125L14.5874 11.7256C14.6413 11.7795 14.6665 11.8215 14.6782 11.8496V11.8506C14.693 11.8861 14.7017 11.9259 14.7017 11.9746C14.7017 12.0233 14.693 12.0631 14.6782 12.0986V12.0996C14.6665 12.1277 14.6413 12.1697 14.5874 12.2236L9.61865 17.1924C9.54088 17.2702 9.47374 17.292 9.39307 17.2891C9.29904 17.2856 9.21818 17.2537 9.13232 17.168C9.0542 17.0898 9.02295 17.013 9.02295 16.9121C9.02295 16.8112 9.0542 16.7344 9.13232 16.6562L13.814 11.9746L9.10693 7.26758C9.02927 7.18988 9.00733 7.12357 9.01025 7.04297C9.0137 6.9487 9.04627 6.86731 9.13232 6.78125C9.21025 6.70344 9.28662 6.67293 9.38721 6.67285Z"
                      fill="white"
                      stroke="white"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex-1">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/ad69f29f297bf6f05b03f7c3b11f95956d77f4a5?width=789"
                alt="Market analysis"
                className="w-full h-60 object-cover mb-8"
              />
              <div className="text-center">
                <h3 className="text-white font-space-mono text-3xl font-normal leading-[140%] tracking-[-0.28px] mb-4">
                  Analyze job postings to understand current market demands and
                  opportunities.
                </h3>
                <p className="text-white font-inter text-base font-normal leading-[150%] mb-8">
                  Gain insights into which skills are trending and in high
                  demand.
                </p>
                <button className="flex items-center justify-center gap-2 mx-auto text-white font-inter text-base font-medium leading-6 hover:text-tabiya-accent transition-colors">
                  Discover
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.38721 6.67285C9.48803 6.67285 9.56501 6.70326 9.64307 6.78125L14.5874 11.7256C14.6413 11.7795 14.6665 11.8215 14.6782 11.8496V11.8506C14.693 11.8861 14.7017 11.9259 14.7017 11.9746C14.7017 12.0233 14.693 12.0631 14.6782 12.0986V12.0996C14.6665 12.1277 14.6413 12.1697 14.5874 12.2236L9.61865 17.1924C9.54088 17.2702 9.47374 17.292 9.39307 17.2891C9.29904 17.2856 9.21818 17.2537 9.13232 17.168C9.0542 17.0898 9.02295 17.013 9.02295 16.9121C9.02295 16.8112 9.0542 16.7344 9.13232 16.6562L13.814 11.9746L9.10693 7.26758C9.02927 7.18988 9.00733 7.12357 9.01025 7.04297C9.0137 6.9487 9.04627 6.86731 9.13232 6.78125C9.21025 6.70344 9.28662 6.67293 9.38721 6.67285Z"
                      fill="white"
                      stroke="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Potential Section */}
      <section className="w-full px-16 py-28 bg-tabiya-medium">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center gap-20">
            {/* Left Content */}
            <div className="flex-1">
              <div className="mb-8">
                <span className="text-white font-inter text-base font-bold leading-6 mb-4 block">
                  Explore
                </span>
                <h2 className="text-white font-space-mono text-5xl font-normal leading-[120%] tracking-[-0.52px] mb-6">
                  Unlock Your Career Potential with Tabiya
                </h2>
                <p className="text-white font-inter text-lg font-normal leading-[150%] mb-8">
                  Discover a world of opportunities with Tabiya's comprehensive
                  taxonomy. Navigate your career path with confidence and
                  clarity.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-white font-space-mono text-xl font-normal leading-[140%] tracking-[-0.22px] mb-4">
                    Career Pathways
                  </h3>
                  <p className="text-white font-inter text-base font-normal leading-[150%]">
                    Identify hidden career pathways tailored to your skills and
                    interests.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-space-mono text-xl font-normal leading-[140%] tracking-[-0.22px] mb-4">
                    Skill Demands
                  </h3>
                  <p className="text-white font-inter text-base font-normal leading-[150%]">
                    Stay ahead by understanding the skills that employers are
                    actively seeking.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-inter text-base font-medium leading-6 hover:bg-white hover:text-tabiya-dark transition-colors">
                  Learn More
                </button>
                <button className="flex items-center justify-center gap-2 text-white font-inter text-base font-medium leading-6 hover:text-tabiya-accent transition-colors">
                  Sign Up
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.38721 6.67285C9.48803 6.67285 9.56501 6.70326 9.64307 6.78125L14.5874 11.7256C14.6413 11.7795 14.6665 11.8215 14.6782 11.8496V11.8506C14.693 11.8861 14.7017 11.9259 14.7017 11.9746C14.7017 12.0233 14.693 12.0631 14.6782 12.0986V12.0996C14.6665 12.1277 14.6413 12.1697 14.5874 12.2236L9.61865 17.1924C9.54088 17.2702 9.47374 17.292 9.39307 17.2891C9.29904 17.2856 9.21818 17.2537 9.13232 17.168C9.0542 17.0898 9.02295 17.013 9.02295 16.9121C9.02295 16.8112 9.0542 16.7344 9.13232 16.6562L13.814 11.9746L9.10693 7.26758C9.02927 7.18988 9.00733 7.12357 9.01025 7.04297C9.0137 6.9487 9.04627 6.86731 9.13232 6.78125C9.21025 6.70344 9.28662 6.67293 9.38721 6.67285Z"
                      fill="white"
                      stroke="white"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/9e8d462740c6a08155fdf9f66635b1cd6fe8938e?width=1200"
                alt="Career potential visualization"
                className="w-full h-[640px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Navigate Career Section */}
      <section className="w-full px-16 py-28 bg-tabiya-dark">
        <div className="max-w-8xl mx-auto text-center">
          <div className="mb-20">
            <span className="text-white font-inter text-base font-bold leading-6 mb-4 block">
              Explore
            </span>
            <h2 className="text-white font-space-mono text-5xl font-normal leading-[120%] tracking-[-0.52px] mb-6 max-w-4xl mx-auto">
              Navigate Your Career with Tabiya
            </h2>
            <p className="text-white font-inter text-lg font-normal leading-[150%] max-w-4xl mx-auto">
              Discover a world of job opportunities and skills with Tabiya. Our
              platform simplifies the complex connections between occupations,
              making career exploration engaging and insightful.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-12 mb-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 49 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.0247 32.3785L27.2562 29.2935C27.8212 29.1195 28.3057 28.8305 28.7097 28.4265C29.1137 28.0225 29.4027 27.538 29.5767 26.973L32.6617 16.7415C32.7693 16.4215 32.701 16.1361 32.4567 15.8855C32.212 15.6351 31.9237 15.5638 31.5917 15.6715L21.3602 18.7565C20.7952 18.9305 20.3107 19.2195 19.9067 19.6235C19.5027 20.0275 19.2137 20.512 19.0397 21.077L15.9547 31.3085C15.847 31.6285 15.9153 31.9138 16.1597 32.1645C16.4043 32.4148 16.6927 32.4861 17.0247 32.3785ZM24.3187 25.8205C23.8173 25.8205 23.391 25.64 23.0397 25.279C22.6883 24.9176 22.5127 24.4865 22.5127 23.9855C22.5127 23.4841 22.6932 23.0578 23.0542 22.7065C23.4155 22.3551 23.8467 22.1795 24.3477 22.1795C24.849 22.1795 25.2753 22.36 25.6267 22.721C25.978 23.0823 26.1537 23.5135 26.1537 24.0145C26.1537 24.5158 25.9732 24.9421 25.6122 25.2935C25.2508 25.6448 24.8197 25.8205 24.3187 25.8205ZM57.4298 44.299C21.5415 44.299 18.9075 43.7676 16.4462 42.705C13.9848 41.6423 11.8322 40.189 9.98818 38.345C8.14418 36.501 6.69085 34.3476 5.62818 31.885C4.56551 29.4223 4.03418 26.7861 4.03418 23.9765C4.03418 21.1671 4.56551 18.5305 5.62818 16.0665C6.69085 13.6028 8.14351 11.4571 9.98618 9.62946C11.8288 7.80146 13.9818 6.35446 16.4452 5.28846C18.9085 4.22213 21.5453 3.68896 24.3557 3.68896C27.1657 3.68896 29.8032 4.2218 32.2682 5.28746C34.7328 6.35313 36.8787 7.7993 38.7057 9.62596C40.533 11.4526 41.9795 13.6006 43.0452 16.07C44.1112 18.5393 44.6442 21.1781 44.6442 23.9865C44.6442 26.7945 44.111 29.429 43.0447 31.89C41.9787 34.3513 40.5317 36.5005 38.7037 38.3375C36.876 40.1741 34.7282 41.627 32.2602 42.696C29.7922 43.7646 27.1548 44.299 24.3482 44.299ZM24.3552 40.8925C29.0578 40.8925 33.0452 39.249 36.3172 35.962C39.5895 32.675 41.2257 28.6803 41.2257 23.978C41.2257 19.2753 39.5903 15.288 36.3197 12.016C33.049 8.74363 29.0623 7.10746 24.3597 7.10746C19.657 7.10746 15.6615 8.7428 12.3732 12.0135C9.08485 15.2841 7.44068 19.2708 7.44068 23.9735C7.44068 28.6761 9.08418 32.6716 12.3712 35.96C15.6582 39.2483 19.6528 40.8925 24.3552 40.8925Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h3 className="text-white font-space-mono text-4xl font-normal leading-[130%] tracking-[-0.36px] mb-6">
                Uncover Hidden Career Pathways
              </h3>
              <p className="text-white font-inter text-base font-normal leading-[150%]">
                Use our interactive tools to reveal new career options.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M35.9749 41.8195C36.3236 41.8195 36.6161 41.7095 36.8524 41.4895C37.0891 41.2699 37.2074 40.9794 37.2074 40.618C37.2074 40.2567 37.0874 39.964 36.8474 39.74C36.6078 39.5164 36.3253 39.4045 35.9999 39.4045C35.6346 39.4045 35.3421 39.5164 35.1224 39.74C34.9024 39.964 34.7924 40.2567 34.7924 40.618C34.7924 40.9794 34.9024 41.2699 35.1224 41.4895C35.3421 41.7095 35.6263 41.8195 35.9749 41.8195ZM35.9999 37.3185C36.2826 37.3185 36.5069 37.228 36.6729 37.047C36.8386 36.866 36.9214 36.6325 36.9214 36.3465V31.09C36.9214 30.814 36.8303 30.5914 36.6479 30.422C36.4653 30.253 36.2326 30.1685 35.9499 30.1685C35.6673 30.1685 35.4429 30.2614 35.2769 30.447C35.1113 30.633 35.0284 30.864 35.0284 31.14V36.3965C35.0284 36.6825 35.1196 36.9077 35.3019 37.072C35.4846 37.2364 35.7173 37.3185 35.9999 37.3185ZM7.10743 42.299C6.18743 42.299 5.38976 41.9612 4.71443 41.2855C4.03876 40.6102 3.70093 39.8125 3.70093 38.8925V15.251C3.70093 14.3277 4.03876 13.5272 4.71443 12.8495C5.38976 12.1715 6.18743 11.8325 7.10743 11.8325H15.7249V6.83253C15.7249 5.94586 16.0628 5.15652 16.7384 4.46452C17.4138 3.77219 18.2114 3.42603 19.1314 3.42603H28.8684C29.7884 3.42603 30.5861 3.77219 31.2614 4.46452C31.9371 5.15652 32.2749 5.94586 32.2749 6.83253V11.8325H40.8924C41.8158 11.8325 42.6163 12.1715 43.2939 12.8495C43.9719 13.5272 44.3109 14.3277 44.3109 15.251V23.6825C44.3109 24.1599 44.1441 24.5547 43.8104 24.867C43.4764 25.1797 43.0683 25.336 42.5859 25.336C42.1033 25.336 41.7003 25.1724 41.3769 24.845C41.0539 24.5177 40.8924 24.1135 40.8924 23.6325V15.251H7.10743V38.8925H21.8294C22.3101 38.8925 22.7141 39.057 23.0414 39.386C23.3688 39.715 23.5324 40.1212 23.5324 40.6045C23.5324 41.0879 23.3688 41.491 23.0414 41.814C22.7141 42.1374 22.3101 42.299 21.8294 42.299H7.10743ZM19.1314 11.8325H28.8684V6.83253H19.1314V11.8325ZM35.9999 45.65C33.3666 45.65 31.0999 44.7 29.1999 42.8C27.2999 40.9 26.3499 38.6334 26.3499 36C26.3499 33.3667 27.2999 31.1 29.1999 29.2C31.0999 27.3 33.3666 26.35 35.9999 26.35C38.6333 26.35 40.8999 27.3 42.7999 29.2C44.6999 31.1 45.6499 33.3667 45.6499 36C45.6499 38.6334 44.6999 40.9 42.7999 42.8C40.8999 44.7 38.6333 45.65 35.9999 45.65Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h3 className="text-white font-space-mono text-4xl font-normal leading-[130%] tracking-[-0.36px] mb-6">
                Understand Labor Market Trends
              </h3>
              <p className="text-white font-inter text-base font-normal leading-[150%]">
                Stay informed about job postings and skill demands.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 49 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.6668 35.914L10.9213 42.162C10.5563 42.3447 10.2082 42.3883 9.87684 42.293C9.5455 42.1977 9.26384 42.04 9.03184 41.82C8.80817 41.5917 8.65067 41.3105 8.55934 40.9765C8.46801 40.6422 8.51367 40.2957 8.69634 39.937L23.1253 7.03049C23.263 6.69049 23.4773 6.43565 23.7683 6.26599C24.0593 6.09599 24.3585 6.01099 24.6658 6.01099C24.9732 6.01099 25.2725 6.09599 25.5638 6.26599C25.8555 6.43565 26.0703 6.69049 26.2083 7.03049L40.6373 39.937C40.82 40.2957 40.8657 40.6422 40.7743 40.9765C40.683 41.3105 40.5255 41.5917 40.3018 41.82C40.0698 42.04 39.7882 42.1977 39.4568 42.293C39.1255 42.3883 38.7773 42.3447 38.4123 42.162L24.6668 35.914ZM13.7938 37.076L24.6668 32.2715L35.5398 37.076L24.6668 11.8665L13.7938 37.076Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h3 className="text-white font-space-mono text-4xl font-normal leading-[130%] tracking-[-0.36px] mb-6">
                Engage with Our User-Friendly Interface
              </h3>
              <p className="text-white font-inter text-base font-normal leading-[150%]">
                Easily navigate through our comprehensive job taxonomy.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-inter text-base font-medium leading-6 hover:bg-white hover:text-tabiya-dark transition-colors">
              Learn More
            </button>
            <button className="flex items-center justify-center gap-2 text-white font-inter text-base font-medium leading-6 hover:text-tabiya-accent transition-colors">
              Sign Up
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.38721 6.67285C9.48803 6.67285 9.56501 6.70326 9.64307 6.78125L14.5874 11.7256C14.6413 11.7795 14.6665 11.8215 14.6782 11.8496V11.8506C14.693 11.8861 14.7017 11.9259 14.7017 11.9746C14.7017 12.0233 14.693 12.0631 14.6782 12.0986V12.0996C14.6665 12.1277 14.6413 12.1697 14.5874 12.2236L9.61865 17.1924C9.54088 17.2702 9.47374 17.292 9.39307 17.2891C9.29904 17.2856 9.21818 17.2537 9.13232 17.168C9.0542 17.0898 9.02295 17.013 9.02295 16.9121C9.02295 16.8112 9.0542 16.7344 9.13232 16.6562L13.814 11.9746L9.10693 7.26758C9.02927 7.18988 9.00733 7.12357 9.01025 7.04297C9.0137 6.9487 9.04627 6.86731 9.13232 6.78125C9.21025 6.70344 9.28662 6.67293 9.38721 6.67285Z"
                  fill="white"
                  stroke="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <section
        className="w-full px-16 py-28 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://api.builder.io/api/v1/image/assets/TEMP/94aa130eebc90ad071dbec3be2aca56ba5dae612?width=2880')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-8xl mx-auto">
          <div className="max-w-4xl">
            <h2 className="text-white font-space-mono text-5xl font-normal leading-[120%] tracking-[-0.52px] mb-6">
              Stay Ahead in Your Career
            </h2>
            <p className="text-white font-inter text-lg font-normal leading-[150%] mb-8">
              Subscribe to our newsletter for insights on labor market trends
              and career opportunities.
            </p>

            <form
              onSubmit={handleEmailSubmit}
              className="flex gap-4 mb-4 max-w-lg"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Here"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/60 font-inter text-base leading-6"
                required
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-white text-tabiya-dark font-inter text-base font-medium leading-6 hover:bg-tabiya-accent hover:text-white transition-colors"
              >
                Sign Up
              </button>
            </form>
            <p className="text-white font-inter text-xs font-normal leading-[150%]">
              By clicking Sign Up, you agree to our Terms and Conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full px-16 py-28 bg-tabiya-medium">
        <div className="max-w-8xl mx-auto">
          <div className="mb-20">
            <h2 className="text-white font-space-mono text-5xl font-normal leading-[120%] tracking-[-0.52px] mb-6 max-w-lg">
              Customer Testimonials
            </h2>
            <p className="text-white font-inter text-lg font-normal leading-[150%] max-w-lg">
              This platform transformed my career exploration journey!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-16 mb-12">
            {/* Testimonial 1 */}
            <div>
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.07088 0.612344C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612344Z"
                      fill="white"
                    />
                  </svg>
                ))}
              </div>
              <blockquote className="text-white font-space-mono text-xl font-normal leading-[140%] tracking-[-0.22px] mb-8">
                "Tabiya's insights helped me uncover new opportunities I never
                considered before."
              </blockquote>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div>
                  <div className="text-white font-inter text-base font-bold leading-6">
                    Jane Doe
                  </div>
                  <div className="text-white font-inter text-base font-normal leading-6">
                    Career Coach, ABC Corp
                  </div>
                </div>
                <div className="w-px h-16 bg-white/20 mx-5"></div>
                <div className="w-30 h-12 bg-white/10 rounded"></div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div>
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.07088 0.612344C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612344Z"
                      fill="white"
                    />
                  </svg>
                ))}
              </div>
              <blockquote className="text-white font-space-mono text-xl font-normal leading-[140%] tracking-[-0.22px] mb-8">
                "Navigating the job market has never been easier thanks to
                Tabiya!"
              </blockquote>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div>
                  <div className="text-white font-inter text-base font-bold leading-6">
                    John Smith
                  </div>
                  <div className="text-white font-inter text-base font-normal leading-6">
                    HR Manager, XYZ Ltd
                  </div>
                </div>
                <div className="w-px h-16 bg-white/20 mx-5"></div>
                <div className="w-30 h-12 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/20"}`}
                ></div>
              ))}
            </div>
            <div className="flex gap-4">
              <button className="p-3 border border-tabiya-dark/15 bg-tabiya-dark text-white hover:bg-white hover:text-tabiya-dark transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.09502 13.7404L12.5968 19.2419C12.7668 19.4123 12.8527 19.6123 12.8545 19.8419C12.8565 20.0716 12.7726 20.2723 12.6028 20.4439C12.4328 20.6161 12.2322 20.7012 12.001 20.6992C11.7699 20.6972 11.5686 20.6113 11.3973 20.4414L4.44727 13.4914C4.35627 13.3994 4.29011 13.3038 4.24877 13.2044C4.20727 13.1049 4.18652 12.9994 4.18652 12.8879C4.18652 12.7764 4.20727 12.6712 4.24877 12.5722C4.29011 12.473 4.35627 12.3776 4.44727 12.2859L11.4033 5.32995C11.5791 5.16011 11.7805 5.0752 12.0075 5.0752C12.2344 5.0752 12.4328 5.16011 12.6028 5.32995C12.7726 5.50395 12.8575 5.70469 12.8575 5.93219C12.8575 6.15986 12.7726 6.35894 12.6028 6.52944L7.09502 12.0369H19.2978C19.5419 12.0369 19.7459 12.1178 19.9098 12.2794C20.0736 12.4411 20.1555 12.6442 20.1555 12.8887C20.1555 13.1332 20.0736 13.3363 19.9098 13.4979C19.7459 13.6596 19.5419 13.7404 19.2978 13.7404H7.09502Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button className="p-3 border border-tabiya-dark/15 bg-tabiya-dark text-white hover:bg-white hover:text-tabiya-dark transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.9051 13.7404H4.70234C4.45767 13.7404 4.25459 13.6596 4.09309 13.4979C3.93142 13.3362 3.85059 13.1332 3.85059 12.8887C3.85059 12.6442 3.93142 12.4411 4.09309 12.2794C4.25459 12.1177 4.45767 12.0369 4.70234 12.0369H16.9051L11.4033 6.53541C11.2333 6.36541 11.1473 6.16516 11.1451 5.93466C11.1428 5.70399 11.2267 5.50324 11.3968 5.33241C11.5672 5.16091 11.7679 5.07616 11.9991 5.07816C12.2303 5.08016 12.4315 5.16608 12.6028 5.33591L19.5528 12.2859C19.6438 12.3779 19.71 12.4736 19.7513 12.5729C19.7928 12.6724 19.8136 12.7779 19.8136 12.8894C19.8136 13.0009 19.7928 13.1062 19.7513 13.2052C19.71 13.3043 19.6438 13.3997 19.5528 13.4914L12.5968 20.4414C12.421 20.6152 12.2196 20.7022 11.9926 20.7022C11.7658 20.7022 11.5673 20.6147 11.3973 20.4399C11.2275 20.2697 11.1426 20.071 11.1426 19.8437C11.1426 19.6165 11.2275 19.4179 11.3973 19.2479L16.9051 13.7404Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Labor Market Evolution Section */}
      <section className="w-full px-16 py-28 bg-tabiya-dark">
        <div className="max-w-8xl mx-auto">
          <div className="flex gap-20">
            {/* Left Content */}
            <div className="flex-1">
              <div className="mb-8">
                <span className="text-white font-inter text-base font-bold leading-6 mb-4 block">
                  Explore
                </span>
                <h2 className="text-white font-space-mono text-5xl font-normal leading-[120%] tracking-[-0.52px] mb-8">
                  Understanding the Evolution of the Labor Market
                </h2>
              </div>

              <div className="flex items-center gap-6">
                <button className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-inter text-base font-medium leading-6 hover:bg-white hover:text-tabiya-dark transition-colors">
                  Learn More
                </button>
                <button className="flex items-center justify-center gap-2 text-white font-inter text-base font-medium leading-6 hover:text-tabiya-accent transition-colors">
                  View
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.38721 6.67285C9.48803 6.67285 9.56501 6.70326 9.64307 6.78125L14.5874 11.7256C14.6413 11.7795 14.6665 11.8215 14.6782 11.8496V11.8506C14.693 11.8861 14.7017 11.9259 14.7017 11.9746C14.7017 12.0233 14.693 12.0631 14.6782 12.0986V12.0996C14.6665 12.1277 14.6413 12.1697 14.5874 12.2236L9.61865 17.1924C9.54088 17.2702 9.47374 17.292 9.39307 17.2891C9.29904 17.2856 9.21818 17.2537 9.13232 17.168C9.0542 17.0898 9.02295 17.013 9.02295 16.9121C9.02295 16.8112 9.0542 16.7344 9.13232 16.6562L13.814 11.9746L9.10693 7.26758C9.02927 7.18988 9.00733 7.12357 9.01025 7.04297C9.0137 6.9487 9.04627 6.86731 9.13232 6.78125C9.21025 6.70344 9.28662 6.67293 9.38721 6.67285Z"
                      fill="white"
                      stroke="white"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Timeline */}
            <div className="flex-1">
              <div className="space-y-8">
                {/* Timeline Item 1 */}
                <div className="flex gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 flex-shrink-0">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 49"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M41.46 15.1287L41.18 14.6287C40.8188 14.0241 40.3094 13.5215 39.7 13.1687L26.28 5.42867C25.6724 5.07617 24.9826 4.88991 24.28 4.88867H23.7C22.9974 4.88991 22.3076 5.07617 21.7 5.42867L8.28 13.1887C7.67394 13.5392 7.17052 14.0426 6.82 14.6487L6.54 15.1487C6.1875 15.7564 6.00124 16.4462 6 17.1487V32.6487C6.00124 33.3513 6.1875 34.0411 6.54 34.6487L6.82 35.1487C7.17958 35.7477 7.68098 36.2491 8.28 36.6087L21.72 44.3487C22.3246 44.7085 23.0164 44.8953 23.72 44.8887H24.28C24.9826 44.8875 25.6724 44.7013 26.28 44.3487L39.7 36.5887C40.312 36.2461 40.8174 35.7407 41.16 35.1287L41.46 34.6287C41.8082 34.0193 41.9942 33.3307 42 32.6287V17.1287C41.9988 16.4261 41.8126 15.7363 41.46 15.1287ZM23.7 8.88867H24.28L36 15.6487L24 22.5687L12 15.6487L23.7 8.88867ZM26 39.8887L37.7 33.1287L38 32.6287V19.1087L26 26.0487V39.8887Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="w-0.5 h-25 bg-white/20 mt-4"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-space-mono text-xl font-normal leading-[140%] tracking-[-0.22px] mb-4">
                      Job Trends
                    </h3>
                    <p className="text-white font-inter text-base font-normal leading-[150%]">
                      Discover how job roles have transformed over time and what
                      that means for you.
                    </p>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="flex gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 flex-shrink-0">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 49"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M41.46 15.1287L41.18 14.6287C40.8188 14.0241 40.3094 13.5215 39.7 13.1687L26.28 5.42867C25.6724 5.07617 24.9826 4.88991 24.28 4.88867H23.7C22.9974 4.88991 22.3076 5.07617 21.7 5.42867L8.28 13.1887C7.67394 13.5392 7.17052 14.0426 6.82 14.6487L6.54 15.1487C6.1875 15.7564 6.00124 16.4462 6 17.1487V32.6487C6.00124 33.3513 6.1875 34.0411 6.54 34.6487L6.82 35.1487C7.17958 35.7477 7.68098 36.2491 8.28 36.6087L21.72 44.3487C22.3246 44.7085 23.0164 44.8953 23.72 44.8887H24.28C24.9826 44.8875 25.6724 44.7013 26.28 44.3487L39.7 36.5887C40.312 36.2461 40.8174 35.7407 41.16 35.1287L41.46 34.6287C41.8082 34.0193 41.9942 33.3307 42 32.6287V17.1287C41.9988 16.4261 41.8126 15.7363 41.46 15.1287ZM23.7 8.88867H24.28L36 15.6487L24 22.5687L12 15.6487L23.7 8.88867ZM26 39.8887L37.7 33.1287L38 32.6287V19.1087L26 26.0487V39.8887Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="w-0.5 h-25 bg-white/20 mt-4"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-space-mono text-xl font-normal leading-[140%] tracking-[-0.22px] mb-4">
                      Skill Development
                    </h3>
                    <p className="text-white font-inter text-base font-normal leading-[150%]">
                      Learn about the essential skills needed for future job
                      opportunities in various industries.
                    </p>
                  </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="flex gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 flex-shrink-0">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 49"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M41.46 15.1287L41.18 14.6287C40.8188 14.0241 40.3094 13.5215 39.7 13.1687L26.28 5.42867C25.6724 5.07617 24.9826 4.88991 24.28 4.88867H23.7C22.9974 4.88991 22.3076 5.07617 21.7 5.42867L8.28 13.1887C7.67394 13.5392 7.17052 14.0426 6.82 14.6487L6.54 15.1487C6.1875 15.7564 6.00124 16.4462 6 17.1487V32.6487C6.00124 33.3513 6.1875 34.0411 6.54 34.6487L6.82 35.1487C7.17958 35.7477 7.68098 36.2491 8.28 36.6087L21.72 44.3487C22.3246 44.7085 23.0164 44.8953 23.72 44.8887H24.28C24.9826 44.8875 25.6724 44.7013 26.28 44.3487L39.7 36.5887C40.312 36.2461 40.8174 35.7407 41.16 35.1287L41.46 34.6287C41.8082 34.0193 41.9942 33.3307 42 32.6287V17.1287C41.9988 16.4261 41.8126 15.7363 41.46 15.1287ZM23.7 8.88867H24.28L36 15.6487L24 22.5687L12 15.6487L23.7 8.88867ZM26 39.8887L37.7 33.1287L38 32.6287V19.1087L26 26.0487V39.8887Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="w-0.5 h-25 bg-white/20 mt-4"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-space-mono text-xl font-normal leading-[140%] tracking-[-0.22px] mb-4">
                      Career Pathways
                    </h3>
                    <p className="text-white font-inter text-base font-normal leading-[150%]">
                      Uncover hidden career paths that align with your skills
                      and interests.
                    </p>
                  </div>
                </div>

                {/* Timeline Item 4 */}
                <div className="flex gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 flex-shrink-0">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 49"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M41.46 15.1287L41.18 14.6287C40.8188 14.0241 40.3094 13.5215 39.7 13.1687L26.28 5.42867C25.6724 5.07617 24.9826 4.88991 24.28 4.88867H23.7C22.9974 4.88991 22.3076 5.07617 21.7 5.42867L8.28 13.1887C7.67394 13.5392 7.17052 14.0426 6.82 14.6487L6.54 15.1487C6.1875 15.7564 6.00124 16.4462 6 17.1487V32.6487C6.00124 33.3513 6.1875 34.0411 6.54 34.6487L6.82 35.1487C7.17958 35.7477 7.68098 36.2491 8.28 36.6087L21.72 44.3487C22.3246 44.7085 23.0164 44.8953 23.72 44.8887H24.28C24.9826 44.8875 25.6724 44.7013 26.28 44.3487L39.7 36.5887C40.312 36.2461 40.8174 35.7407 41.16 35.1287L41.46 34.6287C41.8082 34.0193 41.9942 33.3307 42 32.6287V17.1287C41.9988 16.4261 41.8126 15.7363 41.46 15.1287ZM23.7 8.88867H24.28L36 15.6487L24 22.5687L12 15.6487L23.7 8.88867ZM26 39.8887L37.7 33.1287L38 32.6287V19.1087L26 26.0487V39.8887Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-space-mono text-xl font-normal leading-[140%] tracking-[-0.22px] mb-4">
                      Market Insights
                    </h3>
                    <p className="text-white font-inter text-base font-normal leading-[150%]">
                      Stay informed on labor market trends and how they affect
                      your career choices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full px-16 py-28 bg-tabiya-dark">
        <div className="max-w-8xl mx-auto">
          <div className="mb-20">
            <span className="text-white font-inter text-base font-bold leading-6 mb-4 block">
              Team
            </span>
            <h2 className="text-white font-space-mono text-5xl font-normal leading-[120%] tracking-[-0.52px] mb-6 max-w-4xl">
              Our Team
            </h2>
            <p className="text-white font-inter text-lg font-normal leading-[150%] max-w-4xl">
              Meet the passionate individuals behind Tabiya.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-12 mb-12">
            {/* Team Member 1 */}
            <div className="text-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/52bc13dc469e29c0d7ab703c1b49d9ffe0eb460b?width=789"
                alt="Alex Johnson"
                className="w-full aspect-square object-cover mb-6"
              />
              <div className="mb-4">
                <h3 className="text-white font-inter text-xl font-bold leading-[150%] mb-1">
                  Alex Johnson
                </h3>
                <p className="text-white font-inter text-lg font-normal leading-[150%]">
                  CEO
                </p>
              </div>
              <p className="text-white font-inter text-base font-normal leading-[150%] mb-4">
                Leading our mission to simplify career exploration and skill
                mapping.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="text-white hover:text-tabiya-accent transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.5 3.80127C3.67157 3.80127 3 4.47284 3 5.30127V20.3013C3 21.1297 3.67157 21.8013 4.5 21.8013H19.5C20.3284 21.8013 21 21.1297 21 20.3013V5.30127C21 4.47284 20.3284 3.80127 19.5 3.80127H4.5ZM8.52076 7.80399C8.52639 8.76024 7.81061 9.34946 6.96123 9.34524C6.16107 9.34102 5.46357 8.70399 5.46779 7.8054C5.47201 6.96024 6.13998 6.28102 7.00764 6.30071C7.88795 6.3204 8.52639 6.96587 8.52076 7.80399ZM12.2797 10.563H9.75971H9.7583V19.1229H12.4217V18.9232C12.4217 18.5433 12.4214 18.1633 12.4211 17.7832C12.4203 16.7694 12.4194 15.7545 12.4246 14.741C12.426 14.4949 12.4372 14.239 12.5005 14.0041C12.7381 13.1266 13.5271 12.5599 14.4074 12.6992C14.9727 12.7877 15.3467 13.1154 15.5042 13.6484C15.6013 13.9816 15.6449 14.3402 15.6491 14.6876C15.6605 15.7352 15.6589 16.7828 15.6573 17.8305C15.6567 18.2003 15.6561 18.5703 15.6561 18.9401V19.1215H18.328V18.9162C18.328 18.4642 18.3278 18.0123 18.3275 17.5604C18.327 16.4309 18.3264 15.3014 18.3294 14.1715C18.3308 13.661 18.276 13.1576 18.1508 12.664C17.9638 11.9299 17.5771 11.3224 16.9485 10.8837C16.5027 10.5715 16.0133 10.3704 15.4663 10.3479C15.404 10.3453 15.3412 10.3419 15.2781 10.3385C14.9984 10.3234 14.7141 10.308 14.4467 10.3619C13.6817 10.5152 13.0096 10.8654 12.5019 11.4827C12.4429 11.5535 12.3852 11.6254 12.2991 11.7327L12.2797 11.757V10.563ZM5.68164 19.1257H8.33242V10.5686H5.68164V19.1257Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-tabiya-accent transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.1761 4.80127H19.9362L13.9061 11.5787L21 20.8013H15.4456L11.0951 15.2079L6.11723 20.8013H3.35544L9.80517 13.5521L3 4.80127H8.69545L12.6279 9.91389L17.1761 4.80127ZM16.2073 19.1767H17.7368L7.86441 6.34055H6.2232L16.2073 19.1767Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-tabiya-accent transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 3.55859C7.03145 3.55859 3 7.59004 3 12.5586C3 17.5272 7.03145 21.5586 12 21.5586C16.9588 21.5586 21 17.5272 21 12.5586C21 7.59004 16.9588 3.55859 12 3.55859ZM17.9447 7.70718C19.0184 9.01521 19.6627 10.6844 19.6822 12.4903C19.4284 12.4415 16.8904 11.9241 14.333 12.2462C14.2744 12.1193 14.2256 11.9827 14.167 11.846C14.0108 11.4751 13.8352 11.0944 13.6594 10.7332C16.4902 9.58139 17.7787 7.92193 17.9447 7.70718ZM12 4.88614C13.9523 4.88614 15.7386 5.61825 17.0955 6.8189C16.9588 7.01412 15.7972 8.56618 13.064 9.59112C11.8048 7.27768 10.4089 5.38397 10.1942 5.09113C10.77 4.95447 11.3753 4.88614 12 4.88614ZM8.72996 5.60848C8.93494 5.8818 10.3015 7.78527 11.5803 10.0499C7.98807 11.0066 4.81562 10.987 4.47397 10.987C4.9718 8.60523 6.58243 6.62366 8.72996 5.60848ZM4.30803 12.5684C4.30803 12.4903 4.30803 12.4122 4.30803 12.3341C4.63991 12.3438 8.36876 12.3927 12.205 11.2408C12.4295 11.6703 12.6345 12.1096 12.8297 12.5488C12.7321 12.5781 12.6247 12.6074 12.5271 12.6367C8.56399 13.9154 6.45553 17.41 6.27983 17.7028C5.05965 16.346 4.30803 14.5402 4.30803 12.5684ZM12 20.2506C10.2234 20.2506 8.58352 19.6454 7.28525 18.6302C7.42191 18.3471 8.98371 15.3406 13.3178 13.8276C13.3373 13.8178 13.3471 13.8178 13.3666 13.8081C14.4501 16.6096 14.8894 18.962 15.0065 19.6356C14.0792 20.0358 13.064 20.2506 12 20.2506ZM16.2852 18.9328C16.2072 18.4642 15.7972 16.2191 14.7917 13.4566C17.2028 13.0759 19.3113 13.7007 19.5749 13.7886C19.243 15.9263 18.013 17.7712 16.2852 18.9328Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/61a2c65d2e2c2022bc5c501dde987fb7caeba2b7?width=789"
                alt="Maria Smith"
                className="w-full aspect-square object-cover mb-6"
              />
              <div className="mb-4">
                <h3 className="text-white font-inter text-xl font-bold leading-[150%] mb-1">
                  Maria Smith
                </h3>
                <p className="text-white font-inter text-lg font-normal leading-[150%]">
                  CTO
                </p>
              </div>
              <p className="text-white font-inter text-base font-normal leading-[150%] mb-4">
                Innovating technology solutions for better job and skill
                visibility.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="text-white hover:text-tabiya-accent transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.5 3.80127C3.67157 3.80127 3 4.47284 3 5.30127V20.3013C3 21.1297 3.67157 21.8013 4.5 21.8013H19.5C20.3284 21.8013 21 21.1297 21 20.3013V5.30127C21 4.47284 20.3284 3.80127 19.5 3.80127H4.5ZM8.52076 7.80399C8.52639 8.76024 7.81061 9.34946 6.96123 9.34524C6.16107 9.34102 5.46357 8.70399 5.46779 7.8054C5.47201 6.96024 6.13998 6.28102 7.00764 6.30071C7.88795 6.3204 8.52639 6.96587 8.52076 7.80399ZM12.2797 10.563H9.75971H9.7583V19.1229H12.4217V18.9232C12.4217 18.5433 12.4214 18.1633 12.4211 17.7832C12.4203 16.7694 12.4194 15.7545 12.4246 14.741C12.426 14.4949 12.4372 14.239 12.5005 14.0041C12.7381 13.1266 13.5271 12.5599 14.4074 12.6992C14.9727 12.7877 15.3467 13.1154 15.5042 13.6484C15.6013 13.9816 15.6449 14.3402 15.6491 14.6876C15.6605 15.7352 15.6589 16.7828 15.6573 17.8305C15.6567 18.2003 15.6561 18.5703 15.6561 18.9401V19.1215H18.328V18.9162C18.328 18.4642 18.3278 18.0123 18.3275 17.5604C18.327 16.4309 18.3264 15.3014 18.3294 14.1715C18.3308 13.661 18.276 13.1576 18.1508 12.664C17.9638 11.9299 17.5771 11.3224 16.9485 10.8837C16.5027 10.5715 16.0133 10.3704 15.4663 10.3479C15.404 10.3453 15.3412 10.3419 15.2781 10.3385C14.9984 10.3234 14.7141 10.308 14.4467 10.3619C13.6817 10.5152 13.0096 10.8654 12.5019 11.4827C12.4429 11.5535 12.3852 11.6254 12.2991 11.7327L12.2797 11.757V10.563ZM5.68164 19.1257H8.33242V10.5686H5.68164V19.1257Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-tabiya-accent transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.1761 4.80127H19.9362L13.9061 11.5787L21 20.8013H15.4456L11.0951 15.2079L6.11723 20.8013H3.35544L9.80517 13.5521L3 4.80127H8.69545L12.6279 9.91389L17.1761 4.80127ZM16.2073 19.1767H17.7368L7.86441 6.34055H6.2232L16.2073 19.1767Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-tabiya-accent transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 3.55859C7.03145 3.55859 3 7.59004 3 12.5586C3 17.5272 7.03145 21.5586 12 21.5586C16.9588 21.5586 21 17.5272 21 12.5586C21 7.59004 16.9588 3.55859 12 3.55859ZM17.9447 7.70718C19.0184 9.01521 19.6627 10.6844 19.6822 12.4903C19.4284 12.4415 16.8904 11.9241 14.333 12.2462C14.2744 12.1193 14.2256 11.9827 14.167 11.846C14.0108 11.4751 13.8352 11.0944 13.6594 10.7332C16.4902 9.58139 17.7787 7.92193 17.9447 7.70718ZM12 4.88614C13.9523 4.88614 15.7386 5.61825 17.0955 6.8189C16.9588 7.01412 15.7972 8.56618 13.064 9.59112C11.8048 7.27768 10.4089 5.38397 10.1942 5.09113C10.77 4.95447 11.3753 4.88614 12 4.88614ZM8.72996 5.60848C8.93494 5.8818 10.3015 7.78527 11.5803 10.0499C7.98807 11.0066 4.81562 10.987 4.47397 10.987C4.9718 8.60523 6.58243 6.62366 8.72996 5.60848ZM4.30803 12.5684C4.30803 12.4903 4.30803 12.4122 4.30803 12.3341C4.63991 12.3438 8.36876 12.3927 12.205 11.2408C12.4295 11.6703 12.6345 12.1096 12.8297 12.5488C12.7321 12.5781 12.6247 12.6074 12.5271 12.6367C8.56399 13.9154 6.45553 17.41 6.27983 17.7028C5.05965 16.346 4.30803 14.5402 4.30803 12.5684ZM12 20.2506C10.2234 20.2506 8.58352 19.6454 7.28525 18.6302C7.42191 18.3471 8.98371 15.3406 13.3178 13.8276C13.3373 13.8178 13.3471 13.8178 13.3666 13.8081C14.4501 16.6096 14.8894 18.962 15.0065 19.6356C14.0792 20.0358 13.064 20.2506 12 20.2506ZM16.2852 18.9328C16.2072 18.4642 15.7972 16.2191 14.7917 13.4566C17.2028 13.0759 19.3113 13.7007 19.5749 13.7886C19.243 15.9263 18.013 17.7712 16.2852 18.9328Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/8ae37fcde8f021bde7a412b1045665b7f0edb0d9?width=789"
                alt="James Lee"
                className="w-full aspect-square object-cover mb-6"
              />
              <div className="mb-4">
                <h3 className="text-white font-inter text-xl font-bold leading-[150%] mb-1">
                  James Lee
                </h3>
                <p className="text-white font-inter text-lg font-normal leading-[150%]">
                  Product Manager
                </p>
              </div>
              <p className="text-white font-inter text-base font-normal leading-[150%] mb-4">
                Crafting user experiences that connect people with
                opportunities.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="text-white hover:text-tabiya-accent transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.5 3.80127C3.67157 3.80127 3 4.47284 3 5.30127V20.3013C3 21.1297 3.67157 21.8013 4.5 21.8013H19.5C20.3284 21.8013 21 21.1297 21 20.3013V5.30127C21 4.47284 20.3284 3.80127 19.5 3.80127H4.5ZM8.52076 7.80399C8.52639 8.76024 7.81061 9.34946 6.96123 9.34524C6.16107 9.34102 5.46357 8.70399 5.46779 7.8054C5.47201 6.96024 6.13998 6.28102 7.00764 6.30071C7.88795 6.3204 8.52639 6.96587 8.52076 7.80399ZM12.2797 10.563H9.75971H9.7583V19.1229H12.4217V18.9232C12.4217 18.5433 12.4214 18.1633 12.4211 17.7832C12.4203 16.7694 12.4194 15.7545 12.4246 14.741C12.426 14.4949 12.4372 14.239 12.5005 14.0041C12.7381 13.1266 13.5271 12.5599 14.4074 12.6992C14.9727 12.7877 15.3467 13.1154 15.5042 13.6484C15.6013 13.9816 15.6449 14.3402 15.6491 14.6876C15.6605 15.7352 15.6589 16.7828 15.6573 17.8305C15.6567 18.2003 15.6561 18.5703 15.6561 18.9401V19.1215H18.328V18.9162C18.328 18.4642 18.3278 18.0123 18.3275 17.5604C18.327 16.4309 18.3264 15.3014 18.3294 14.1715C18.3308 13.661 18.276 13.1576 18.1508 12.664C17.9638 11.9299 17.5771 11.3224 16.9485 10.8837C16.5027 10.5715 16.0133 10.3704 15.4663 10.3479C15.404 10.3453 15.3412 10.3419 15.2781 10.3385C14.9984 10.3234 14.7141 10.308 14.4467 10.3619C13.6817 10.5152 13.0096 10.8654 12.5019 11.4827C12.4429 11.5535 12.3852 11.6254 12.2991 11.7327L12.2797 11.757V10.563ZM5.68164 19.1257H8.33242V10.5686H5.68164V19.1257Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-tabiya-accent transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.1761 4.80127H19.9362L13.9061 11.5787L21 20.8013H15.4456L11.0951 15.2079L6.11723 20.8013H3.35544L9.80517 13.5521L3 4.80127H8.69545L12.6279 9.91389L17.1761 4.80127ZM16.2073 19.1767H17.7368L7.86441 6.34055H6.2232L16.2073 19.1767Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-tabiya-accent transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 3.55859C7.03145 3.55859 3 7.59004 3 12.5586C3 17.5272 7.03145 21.5586 12 21.5586C16.9588 21.5586 21 17.5272 21 12.5586C21 7.59004 16.9588 3.55859 12 3.55859ZM17.9447 7.70718C19.0184 9.01521 19.6627 10.6844 19.6822 12.4903C19.4284 12.4415 16.8904 11.9241 14.333 12.2462C14.2744 12.1193 14.2256 11.9827 14.167 11.846C14.0108 11.4751 13.8352 11.0944 13.6594 10.7332C16.4902 9.58139 17.7787 7.92193 17.9447 7.70718ZM12 4.88614C13.9523 4.88614 15.7386 5.61825 17.0955 6.8189C16.9588 7.01412 15.7972 8.56618 13.064 9.59112C11.8048 7.27768 10.4089 5.38397 10.1942 5.09113C10.77 4.95447 11.3753 4.88614 12 4.88614ZM8.72996 5.60848C8.93494 5.8818 10.3015 7.78527 11.5803 10.0499C7.98807 11.0066 4.81562 10.987 4.47397 10.987C4.9718 8.60523 6.58243 6.62366 8.72996 5.60848ZM4.30803 12.5684C4.30803 12.4903 4.30803 12.4122 4.30803 12.3341C4.63991 12.3438 8.36876 12.3927 12.205 11.2408C12.4295 11.6703 12.6345 12.1096 12.8297 12.5488C12.7321 12.5781 12.6247 12.6074 12.5271 12.6367C8.56399 13.9154 6.45553 17.41 6.27983 17.7028C5.05965 16.346 4.30803 14.5402 4.30803 12.5684ZM12 20.2506C10.2234 20.2506 8.58352 19.6454 7.28525 18.6302C7.42191 18.3471 8.98371 15.3406 13.3178 13.8276C13.3373 13.8178 13.3471 13.8178 13.3666 13.8081C14.4501 16.6096 14.8894 18.962 15.0065 19.6356C14.0792 20.0358 13.064 20.2506 12 20.2506ZM16.2852 18.9328C16.2072 18.4642 15.7972 16.2191 14.7917 13.4566C17.2028 13.0759 19.3113 13.7007 19.5749 13.7886C19.243 15.9263 18.013 17.7712 16.2852 18.9328Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Pagination for team section */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/20"}`}
                ></div>
              ))}
            </div>
            <div className="flex gap-4">
              <button className="p-3 border border-tabiya-dark/15 bg-tabiya-medium text-white hover:bg-white hover:text-tabiya-dark transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.09502 13.7404L12.5968 19.2419C12.7668 19.4123 12.8527 19.6123 12.8545 19.8419C12.8565 20.0716 12.7726 20.2723 12.6028 20.4439C12.4328 20.6161 12.2322 20.7012 12.001 20.6992C11.7699 20.6972 11.5686 20.6113 11.3973 20.4414L4.44727 13.4914C4.35627 13.3994 4.29011 13.3038 4.24877 13.2044C4.20727 13.1049 4.18652 12.9994 4.18652 12.8879C4.18652 12.7764 4.20727 12.6712 4.24877 12.5722C4.29011 12.473 4.35627 12.3776 4.44727 12.2859L11.4033 5.32995C11.5791 5.16011 11.7805 5.0752 12.0075 5.0752C12.2344 5.0752 12.4328 5.16011 12.6028 5.32995C12.7726 5.50395 12.8575 5.70469 12.8575 5.93219C12.8575 6.15986 12.7726 6.35894 12.6028 6.52944L7.09502 12.0369H19.2978C19.5419 12.0369 19.7459 12.1178 19.9098 12.2794C20.0736 12.4411 20.1555 12.6442 20.1555 12.8887C20.1555 13.1332 20.0736 13.3363 19.9098 13.4979C19.7459 13.6596 19.5419 13.7404 19.2978 13.7404H7.09502Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button className="p-3 border border-tabiya-dark/15 bg-tabiya-medium text-white hover:bg-white hover:text-tabiya-dark transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.9051 13.7404H4.70234C4.45767 13.7404 4.25459 13.6596 4.09309 13.4979C3.93142 13.3362 3.85059 13.1332 3.85059 12.8887C3.85059 12.6442 3.93142 12.4411 4.09309 12.2794C4.25459 12.1177 4.45767 12.0369 4.70234 12.0369H16.9051L11.4033 6.53541C11.2333 6.36541 11.1473 6.16516 11.1451 5.93466C11.1428 5.70399 11.2267 5.50324 11.3968 5.33241C11.5672 5.16091 11.7679 5.07616 11.9991 5.07816C12.2303 5.08016 12.4315 5.16608 12.6028 5.33591L19.5528 12.2859C19.6438 12.3779 19.71 12.4736 19.7513 12.5729C19.7928 12.6724 19.8136 12.7779 19.8136 12.8894C19.8136 13.0009 19.7928 13.1062 19.7513 13.2052C19.71 13.3043 19.6438 13.3997 19.5528 13.4914L12.5968 20.4414C12.421 20.6152 12.2196 20.7022 11.9926 20.7022C11.7658 20.7022 11.5673 20.6147 11.3973 20.4399C11.2275 20.2697 11.1426 20.071 11.1426 19.8437C11.1426 19.6165 11.2275 19.4179 11.3973 19.2479L16.9051 13.7404Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/bbb7480c157d223a73aa68c173eb5d3bdb8d3cb6?width=2880"
          alt="Footer"
          className="w-full h-auto"
        />
      </footer>
    </div>
  );
};

export default Home;
