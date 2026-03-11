import React, { useState, useRef, useEffect } from 'react';
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useMotionTemplate
} from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  GraduationCap, 
  ChevronRight,
  MapPin,      
  Languages,   
  Film,
  Sun,
  Moon
} from 'lucide-react';

// --- DATA SECTION ---
const userData = {
  name: "Varshini Krishnamurthy",
  role: "Applied Artificial Intelligence",
  location: "Sheffield, United Kingdom",
  profileImage: "images/profile.jpg", 
  
  socials: {
    linkedin: "https://www.linkedin.com/in/varshinikrishn/",
    github: "https://github.com/varshinikrishn",
    scholar: "https://scholar.google.com/citations?user=R4NlDZIAAAAJ&hl=en",
    email: "varshnk@amazon.com",
    mailto: "mailto:varshnk@amazon.com"
  },

  experience: [
    {
      company: "University of Sheffield",
      role: "Grad Student",
      date: "2025",
      logo: "images/sheffield.jpg",
      desc: "Advisor: Andrew Stratton" 
    },
    {
      company: "Amazon",
      role: "Data Analyst",
      date: "July 2025 - Present",
      logo: "images/amazon.jpg", 
      desc: null 
    },
    {
      company: "Property Loop",
      role: "AI Engineer",
      date: "March - June 2025",
      logo: "images/property-loop.jpg",
      desc: null 
    }
  ],

  publications: [
    {
      title: "Yantra AI: An intelligence platform which interacts with manufacturing operations",
      status: "2025",
      venue: "V Krishnamurthy • arXiv preprint arXiv:2512.15758",
      image: "images/research-paper.jpg", 
      abstract: "A comprehensive intelligence platform designed to optimize and interact with complex manufacturing operations using advanced machine learning techniques.",
      links: [
        { label: "View Paper", url: "https://scholar.google.com/citations?user=R4NlDZIAAAAJ&hl=en" }
      ]
    }
  ],
  
  hobbies: [
    {
      title: "Travel", // Kept in data for reference, but removed from UI
      icon: "MapPin", 
      text: "Traveling and immersing myself in different cultures is something I love. It’s fascinating to see life from new perspectives."
    },
    {
      title: "Languages",
      icon: "Languages",
      text: "Really into languages and the little ways words shape how we think and connect. Love picking up new phrases and quirks."
    },
    {
      title: "Cinema",
      icon: "Film",
      text: "A fair amount of my free time goes into watching films. Recommendations or thoughtful discussions are always welcome."
    }
  ]
};

// --- UTILS & HOOKS ---

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

// --- ANIMATION COMPONENTS ---

// 1. Magnetic Wrapper
const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    position.x.set(middleX * 0.1); 
    position.y.set(middleY * 0.1);
  };

  const reset = () => {
    position.x.set(0);
    position.y.set(0);
  };

  const { x, y } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: 0, y: 0 }}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block relative z-10" 
    >
      {children}
    </motion.div>
  );
};

// 2. Spotlight Card
const SpotlightCard = ({ children, className = "" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="relative overflow-hidden bg-apple-card dark:bg-apple-dark-card border border-gray-100 dark:border-apple-dark-border shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 rounded-3xl group h-full"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              var(--spotlight-color),
              transparent 80%
            )
          `
        }}
      />
      <style>{`
        .group:hover { --spotlight-color: rgba(14, 165, 233, 0.05); }
        .dark .group:hover { --spotlight-color: rgba(255, 255, 255, 0.05); }
      `}</style>
      
      <div className={`relative h-full z-10 ${className}`}>
        {children}
      </div>
    </div>
  );
};

// 3. Parallax Avatar
const ParallaxImage = ({ src }) => {
  const ref = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      const handleMouseMove = (e) => {
        const { innerWidth, innerHeight } = window;
        mouseX.set((e.clientX - innerWidth / 2) / 20);
        mouseY.set((e.clientY - innerHeight / 2) / 20);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-blue-400 dark:bg-blue-600 blur-[80px] opacity-20 rounded-full animate-pulse"></div>
      <motion.img 
        ref={ref}
        src={src} 
        alt="Profile" 
        style={{ x: springX, y: springY }} 
        className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 border-white dark:border-apple-dark-border z-10 grayscale-[10%] hover:grayscale-0 transition-all duration-500"
      />
    </div>
  );
};

// --- MAIN COMPONENTS ---

const getIcon = (iconName) => {
  switch (iconName) {
    case 'MapPin': return <MapPin size={28} />;
    case 'Languages': return <Languages size={28} />;
    case 'Film': return <Film size={28} />;
    default: return null;
  }
};

const Navbar = ({ theme, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState('home');
  const navContainerRef = useRef(null);

  useEffect(() => {
    const sections = ['home', 'research', 'experience', 'hobbies', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  // Auto-scroll logic for mobile navbar
  useEffect(() => {
    if (navContainerRef.current) {
      const activeLinkElement = document.getElementById(`nav-link-${activeSection}`);
      if (activeLinkElement) {
        const container = navContainerRef.current;
        const scrollLeft = 
          activeLinkElement.offsetLeft - 
          (container.clientWidth / 2) + 
          (activeLinkElement.clientWidth / 2);
          
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSection]);

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div 
        ref={navContainerRef}
        className="pointer-events-auto bg-white/70 dark:bg-apple-dark-card/70 backdrop-blur-xl shadow-lg border border-white/50 dark:border-white/10 rounded-full px-2 py-2 flex gap-1 items-center text-sm font-medium text-apple-subtext dark:text-apple-dark-subtext overflow-x-auto max-w-[95vw] md:max-w-none no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
        
        {['Home', 'Research', 'Experience', 'Hobbies', 'Contact'].map((item) => {
          const id = item.toLowerCase();
          const isActive = activeSection === id;
          return (
            <Magnetic key={item}>
              <a 
                id={`nav-link-${id}`}
                href={`#${id}`} 
                onClick={() => setActiveSection(id)}
                className={`relative px-4 py-2 rounded-full transition-all duration-300 block whitespace-nowrap ${
                  isActive 
                    ? "text-black dark:text-white font-semibold" 
                    : "hover:text-black dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white dark:bg-white/10 shadow-sm rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item}
              </a>
            </Magnetic>
          );
        })}
        
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1 flex-shrink-0"></div>
        <Magnetic>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-apple-text dark:text-apple-dark-text flex-shrink-0"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </Magnetic>
      </div>
    </motion.div>
  );
};

const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`relative z-10 py-20 md:py-28 px-6 max-w-5xl mx-auto ${className}`}>
    {children}
  </section>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-500 bg-apple-bg dark:bg-apple-dark-bg selection:bg-apple-blue/20 text-apple-text dark:text-apple-dark-text overflow-x-hidden font-sans relative">
      <div className="fixed inset-0 z-0 bg-apple-bg dark:bg-apple-dark-bg transition-colors duration-500 pointer-events-none"></div>

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* HERO SECTION */}
      <Section id="home" className="min-h-screen flex items-center">
        <motion.div 
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 w-full"
        >
          <motion.div variants={itemVariants} className="flex-1 text-center md:text-left">
             <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-white/5 mb-6 mx-auto md:mx-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold text-apple-subtext dark:text-gray-300 uppercase tracking-wide">Available to collaborate</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight text-apple-text dark:text-white">
              {userData.name}
            </h1>
            <p className="text-lg md:text-xl text-apple-subtext dark:text-apple-dark-subtext mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
              {userData.role}.<br/>Based in {userData.location}.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Magnetic>
                <a href={userData.socials.github} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-full font-medium hover:border-black/20 dark:hover:border-white/30 hover:shadow-lg transition-all dark:text-white">
                  <Github size={22} />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={userData.socials.linkedin} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-full font-medium hover:text-[#0077b5] dark:hover:text-[#0077b5] hover:shadow-lg transition-all dark:text-white">
                  <Linkedin size={22} />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={userData.socials.scholar} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-apple-blue text-white rounded-full font-medium hover:bg-apple-blue/90 hover:shadow-lg transition-all">
                  <GraduationCap size={22} />
                </a>
              </Magnetic>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1 flex justify-center w-full">
            <ParallaxImage src={userData.profileImage} />
          </motion.div>
        </motion.div>
      </Section>

      {/* PUBLICATIONS SECTION */}
      <Section id="research">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 flex items-center gap-3 text-apple-text dark:text-white"
        >
          Publications
        </motion.h2>

        <motion.div 
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           className="grid gap-8"
        >
           {userData.publications.map((pub, index) => (
             <motion.div key={index} variants={itemVariants}>
               <SpotlightCard className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-52 md:h-auto bg-gray-100 dark:bg-white/5 relative overflow-hidden group">
                    <img src={pub.image} alt={pub.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-apple-subtext dark:text-gray-300 shadow-sm">
                      {pub.status}
                    </div>
                  </div>
                  <div className="p-8 md:w-3/5 flex flex-col justify-center">
                    <p className="text-sm text-apple-subtext dark:text-apple-dark-subtext mb-2 font-medium">{pub.venue}</p>
                    <h3 className="text-2xl font-bold mb-4 leading-tight text-apple-text dark:text-white">{pub.title}</h3>
                    <p className="text-apple-text/80 dark:text-gray-400 mb-6 leading-relaxed">
                      {pub.abstract}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {pub.links.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-apple-blue hover:underline">
                          {link.label} <ChevronRight size={16} />
                        </a>
                      ))}
                    </div>
                  </div>
               </SpotlightCard>
             </motion.div>
           ))}
        </motion.div>
      </Section>

      {/* EXPERIENCE SECTION */}
      <Section id="experience">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 flex items-center gap-3 text-apple-text dark:text-white"
        >
          Experience
        </motion.h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6"
        >
          {userData.experience.map((job, index) => (
            <motion.div key={index} variants={itemVariants}>
              <SpotlightCard className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex-shrink-0">
                  <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-full border border-gray-100 dark:border-white/10 object-cover" />
                </div>
                <div className="flex-grow z-10">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <h3 className="text-xl font-bold text-apple-text dark:text-white">{job.company}</h3>
                    <span className="text-sm font-medium text-apple-subtext dark:text-gray-400 bg-gray-50 dark:bg-white/10 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">
                      {job.date}
                    </span>
                  </div>
                  <p className="text-apple-blue font-medium mb-1">{job.role}</p>
                  {job.desc && (
                    <p className="text-apple-subtext dark:text-gray-400 text-sm mt-1">
                      {job.desc}
                    </p>
                  )}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* HOBBIES SECTION */}
      <Section id="hobbies">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 flex items-center gap-3 text-apple-text dark:text-white"
        >
          Hobbies
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-10 pl-2"
        >
          {userData.hobbies.map((hobby, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-8 items-start group">
                <div className="shrink-0 w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-apple-text dark:text-white group-hover:scale-105 transition-transform duration-300 shadow-sm border border-gray-200 dark:border-white/10">
                  {getIcon(hobby.icon)}
                </div>
                
                <div className="flex-grow pt-1">
                  {/* REMOVED H3 TITLE, ONLY TEXT REMAINS */}
                  <p className="text-apple-text dark:text-white leading-relaxed text-lg">
                    {hobby.text}
                  </p>
                </div>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* CONTACT SECTION (FLOATING, NO BOX) */}
      <Section id="contact">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           // REMOVED BACKGROUND BOX, NOW FLOATING
           className="text-center max-w-3xl mx-auto py-12"
         >
           <h2 className="text-2xl md:text-3xl font-bold mb-4 text-apple-text dark:text-white">Let's work together.</h2>
           <p className="text-apple-subtext dark:text-gray-400 mb-8 max-w-lg mx-auto text-base">
             I'm always open to discussing new projects, research collaborations, or just having a chat about AI.
           </p>

           <Magnetic>
             <a 
               href={userData.socials.mailto}
               className="text-xl md:text-3xl font-bold text-apple-text dark:text-white hover:text-gray-500 dark:hover:text-gray-300 transition-colors border-b-2 border-gray-200 dark:border-white/20 pb-1 mb-10 inline-block"
             >
               {userData.socials.email}
             </a>
           </Magnetic>

           <div className="flex justify-center gap-5 mt-4">
              <Magnetic>
                <a href={userData.socials.github} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-full font-medium hover:border-black/20 dark:hover:border-white/30 hover:shadow-lg transition-all dark:text-white">
                  <Github size={22} />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={userData.socials.linkedin} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-full font-medium hover:text-[#0077b5] dark:hover:text-[#0077b5] hover:shadow-lg transition-all dark:text-white">
                  <Linkedin size={22} />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={userData.socials.scholar} target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-apple-blue text-white rounded-full font-medium hover:bg-apple-blue/90 hover:shadow-lg transition-all">
                  <GraduationCap size={22} />
                </a>
              </Magnetic>
           </div>
         </motion.div>
      </Section>

      <footer className="py-10 text-center text-apple-subtext dark:text-gray-500 text-sm border-t border-gray-200/60 dark:border-white/10 mt-10 relative z-10">
        <p>&copy; {new Date().getFullYear()} {userData.name}. All rights reserved. <br className="md:hidden"/> Inspired by João Maria Janeiro.</p>
      </footer>
    </div>
  );
}
