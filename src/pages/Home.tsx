import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, MapPin, ExternalLink, Calendar, Plus, Terminal, Instagram } from 'lucide-react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const RESUME_DATA = {
  projects: [
    {
      id: '1', title: "AIRA (AI Resume Analyzer)", subtitle: "Full-Stack AI Platform",
      desc: "Engineered an ATS-friendly analysis platform integrating Vercel AI SDK for ultra-fast, progressively streamed feedback. Implemented Prompt Injection Defense and automated Webhook-based cleanup to prevent orphaned cloud files.",
      stack: ["Next.js 16", "Gemini 2.5 Flash", "MongoDB", "Clerk"], link: "https://ai-ra.vercel.app"
    },
    {
      id: '2', title: "Lost & Found Platform", subtitle: "Final Year Project",
      desc: "Designed a secure web app to reunite lost items with owners using dynamic QR code generation and real-time in-app notifications. Optimized frontend performance with 80-95% client-side image compression and strict Zod validation.",
      stack: ["Next.js", "TypeScript", "Ably Realtime", "Resend API"], link: "https://lostfoundplatform.me"
    },
    {
      id: '3', title: "AI/ML Job Market Text Analytics", subtitle: "Data Science Pipeline",
      desc: "Processed 5,700+ job postings using an automated NLP pipeline and TF-IDF to map skill-to-salary correlations, highlighting the current tech market demands and trends.",
      stack: ["Python", "NLTK", "Scikit-Learn", "Pandas"], link: "https://github.com/andyderis36/ai-jobs-analytics"
    },
    {
      id: '4', title: "Employee Churn Prediction", subtitle: "Machine Learning Application",
      desc: "Trained an MLP classifier achieving ~96.5% accuracy and deployed the model to an interactive real-time web interface. Designed to help HR quickly identify at-risk staff.",
      stack: ["Python", "Neural Networks", "Streamlit"], link: "https://employeechurnmodeling.streamlit.app"
    },
    {
      id: '5', title: "4P Flask", subtitle: "Simple Daily Progress Tracker",
      desc: "Built a server-side web application for recording daily updates (Project, Progress, Problem, Plan) with full CRUD functionality.",
      stack: ["Python", "Flask", "SQLAlchemy"], link: "https://github.com/andyderis36/4p-flask"
    }
  ],
  experiences: [
    {
      id: '1', role: "Backend Developer Intern", company: "Kedata Indonesia Digital",
      date: "Jan 2022 – Jun 2022", location: "Yogyakarta, Indonesia",
      tasks: ["Assisted production and deployment of data management solutions by debugging code and managing server configurations.", "Acted as technical support during customer guidance sessions, ensuring smooth user onboarding and issue resolution."]
    },
    {
      id: '2', role: "Network Support Technician Intern", company: "Buana Lintas Media",
      date: "May 2021 – Oct 2021", location: "Yogyakarta, Indonesia",
      tasks: ["Maintained 24/7 network availability through proactive monitoring and routing/switching configuration.", "Resolved hardware and connectivity issues via on-site troubleshooting and cross-team coordination with field engineers."]
    }
  ],
  educations: [
    {
      id: '1', institution: "Universiti Utara Malaysia (UUM)", degree: "Bachelor of IT (Hons) – Major in Artificial Intelligence",
      date: "2023 - Nov 2027 (Expected)", location: "Kedah, Malaysia",
      description: "Relevant Coursework: Machine Learning, Neural Networks, NLP, Expert System & Knowledge Engineering, System Analysis & Design.\nLeadership: Orchestrated visual multimedia & technical operations for Pesta Rakyat Indonesia; managed technical requirements for Kelab Pecinta Haiwan UUM."
    },
    {
      id: '2', institution: "SMK Muhammadiyah Kajen", degree: "Vocational High School Diploma – Computer and Network Engineering (TKJ)",
      date: "2017 – 2020", location: "Pekalongan, Indonesia",
      description: "Focus on network infrastructure, server configuration, and hardware troubleshooting."
    }
  ]
};

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SectionHeading = ({ children, number, isDefault = false }: { children: React.ReactNode, number: string, isDefault?: boolean }) => (
  <div className="flex items-center gap-4 mb-8">
    <span className="font-mono text-zinc-500 text-sm">{number}.</span>
    <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 flex items-center gap-4">
      {children} 
      <div 
        className={`w-2 h-2 rounded-full ${isDefault ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}
        title={isDefault ? "Showing default content" : "Showing custom content"}
      />
    </h2>
    <div className="h-px bg-zinc-800 flex-grow ml-4"></div>
  </div>
);

export default function Home() {
  const [profile, setProfile] = useState<any>({
    name: 'Andyderis Putra Aji Syabana.',
    jobTitle: 'I build intelligent web apps.',
    bio1: 'I am an adaptive and forward-thinking Information Technology student majoring in Artificial Intelligence. My passion lies in utilizing AI-augmented development tools to accelerate delivery, optimize system architecture, and solve complex technical challenges.',
    bio2: 'I have hands-on experience in modern stack development, heavily focusing on Next.js, React, and Python ecosystems. From fine-tuning ML models to crafting ultra-fast progressively streamed UI interfaces, I enjoy being involved in every part of the product lifecycle.',
    email: 'andyderis33@gmail.com',
    github: 'https://github.com/andyderis36',
    linkedin: 'https://linkedin.com/in/andyderis33',
    instagram: 'https://instagram.com/andyderis33',
    location: 'Kedah, Malaysia',
    statusText: 'Available for Internship',
    technicalArsenal: [
      { category: "Languages", tech: "Python, TypeScript, JavaScript (ES6+), SQL, Dart, Prolog" },
      { category: "Web & Mobile", tech: "Next.js 16, React 19, Tailwind CSS v4, Flask, Flutter" },
      { category: "AI & Data", tech: "LLM Integration (Gemini), NLP, Neural Networks, EDA" },
      { category: "DB & Cloud", tech: "MongoDB, Vercel Blob, Supabase, MySQL, VPS" },
      { category: "Tools", tech: "Git, Clerk, Ably (Realtime), Zod, Linux Admin" }
    ]
  });
  
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [profileIsDefault, setProfileIsDefault] = useState(true);
  const [settings, setSettings] = useState<any>({
    navLogo: 'APAS.',
    footerText: 'Built by Andyderis'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubProfile = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
        setProfileIsDefault(false);
      } else {
        setProfileIsDefault(true);
      }
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });

    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      setProjects(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.order - b.order));
    });

    const unsubExperiences = onSnapshot(collection(db, 'experiences'), (snap) => {
      setExperiences(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.order - b.order));
    });

    const unsubEducations = onSnapshot(collection(db, 'educations'), (snap) => {
      setEducations(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.order - b.order));
    });

    setLoading(false);

    return () => {
      unsubProfile();
      unsubSettings();
      unsubProjects();
      unsubExperiences();
      unsubEducations();
    };
  }, []);

  const displayProjects = projects.length > 0 ? projects : RESUME_DATA.projects;
  const displayExperiences = experiences.length > 0 ? experiences : RESUME_DATA.experiences;
  const displayEducations = educations.length > 0 ? educations : RESUME_DATA.educations;

  return (
    <div className="min-h-screen font-sans selection:bg-zinc-800 selection:text-zinc-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-mono font-bold text-zinc-100 tracking-tighter text-xl">{settings.navLogo}</div>
          <div className="hidden md:flex gap-8 font-mono text-sm items-center">
            <a href="#about" className="text-zinc-400 hover:text-zinc-100 transition-colors"><span className="text-zinc-600 mr-2">01.</span>About</a>
            <a href="#projects" className="text-zinc-400 hover:text-zinc-100 transition-colors"><span className="text-zinc-600 mr-2">02.</span>Projects</a>
            <a href="#experience" className="text-zinc-400 hover:text-zinc-100 transition-colors"><span className="text-zinc-600 mr-2">03.</span>Experience</a>
            <a href="#education" className="text-zinc-400 hover:text-zinc-100 transition-colors"><span className="text-zinc-600 mr-2">04.</span>Education</a>
            <a href="#contact" className="text-zinc-400 hover:text-zinc-100 transition-colors"><span className="text-zinc-600 mr-2">05.</span>Contact</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-32">
        {/* HERO SECTION */}
        <section className="min-h-[70vh] flex flex-col justify-center">
          <FadeIn delay={0.1}>
            <span className="font-mono text-zinc-400 mb-4 block">Hi, my name is</span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-100 mb-4">
              {profile.name}
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-600 mb-6">
              {profile.jobTitle}
            </h2>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="max-w-2xl text-lg text-zinc-400 mb-10 leading-relaxed font-light">
              {profile.bio1}
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="flex flex-wrap gap-4">
              <a href={`mailto:${profile.email}`} className="bg-zinc-100 text-zinc-900 px-6 py-3 rounded text-sm font-medium hover:bg-zinc-300 transition-colors">
                Say Hello
              </a>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="border border-zinc-800 bg-zinc-900/50 text-zinc-300 px-6 py-3 rounded text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2">
                  <Github size={16} /> GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="border border-zinc-800 bg-zinc-900/50 text-zinc-300 px-6 py-3 rounded text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2">
                  <Linkedin size={16} /> LinkedIn
                </a>
              )}
            </div>
            <div className="flex gap-4 items-center mt-10 text-zinc-500 font-mono text-xs">
              <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>
              <span className="flex items-center gap-1"><Terminal size={14} /> {profile.statusText || 'Available for Internship'}</span>
            </div>
          </FadeIn>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="scroll-mt-24">
          <FadeIn>
            <SectionHeading number="01" isDefault={profileIsDefault}>About Me</SectionHeading>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="text-zinc-400 leading-relaxed space-y-4 font-light">
                <p>{profile.bio1}</p>
                <p>{profile.bio2}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-4 font-mono">Technical Arsenal</h3>
                <ul className="space-y-4">
                  {(profile.technicalArsenal || [
                    { category: "Languages", tech: "Python, TypeScript, JavaScript (ES6+), SQL, Dart, Prolog" },
                    { category: "Web & Mobile", tech: "Next.js 16, React 19, Tailwind CSS v4, Flask, Flutter" },
                    { category: "AI & Data", tech: "LLM Integration (Gemini), NLP, Neural Networks, EDA" },
                    { category: "DB & Cloud", tech: "MongoDB, Vercel Blob, Supabase, MySQL, VPS" },
                    { category: "Tools", tech: "Git, Clerk, Ably (Realtime), Zod, Linux Admin" }
                  ]).map((skill: any, i: number) => (
                    <li key={i} className="group">
                      <span className="block text-zinc-100 text-sm mb-1">{skill.category}</span>
                      <span className="font-mono text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{skill.tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="scroll-mt-24">
          <FadeIn>
            <SectionHeading number="02" isDefault={projects.length === 0}>Selected Projects</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayProjects.map((project, i) => (
                <div key={project.id || i} className="group flex flex-col justify-between bg-[#0e0e11] border border-zinc-800/50 hover:border-zinc-600 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-zinc-900/50">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-zinc-400 group-hover:text-zinc-300 transition-colors"><Terminal size={24} /></div>
                      <div className="flex gap-3">
                        {(project.github || (project.link && project.link.includes('github.com'))) && (
                          <a href={project.github || project.link} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-200 transition-colors" title="Source Code">
                            <Github size={20} />
                          </a>
                        )}
                        {(project.live || (project.link && !project.link.includes('github.com'))) && (
                          <a href={project.live || project.link} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-200 transition-colors" title="Live Preview">
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100 group-hover:text-zinc-300 transition-colors">{project.title}</h3>
                    <h4 className="text-xs font-mono text-zinc-500 mb-4">{project.subtitle}</h4>
                    <p className="text-sm text-zinc-400 font-light mb-6 leading-relaxed">
                      {project.desc}
                    </p>
                  </div>
                  <ul className="flex flex-wrap gap-2 text-xs font-mono text-zinc-500">
                    {project.stack?.map((tech: string) => (
                      <li key={tech} className="bg-zinc-900 px-2 py-1 rounded">{tech}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-24">
          <FadeIn>
            <SectionHeading number="03" isDefault={experiences.length === 0}>Where I've Worked</SectionHeading>
            <div className="space-y-12 border-l border-zinc-800 ml-3 md:ml-0 pl-6 md:pl-8">
              {displayExperiences.map((job, i) => (
                <div key={job.id || i} className="relative">
                  <div className="absolute -left-[31px] md:-left-[39px] top-1 h-3 w-3 bg-zinc-950 border border-zinc-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-zinc-100 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    {job.role} <span className="hidden md:inline text-zinc-600">@</span> <span className="text-zinc-300">{job.company}</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-1 mb-4">
                    <span className="font-mono text-xs text-zinc-500">{job.date}</span>
                    <span className="text-zinc-700">•</span>
                    <span className="font-mono text-xs text-zinc-500">{job.location}</span>
                  </div>
                  <ul className="space-y-2 text-zinc-400 font-light text-sm">
                    {job.tasks?.map((task: string, j: number) => (
                      <li key={j} className="flex items-start gap-2">
                        <Plus size={16} className="text-zinc-600 mt-1 shrink-0" />
                        <span className="leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>
        
        {/* EDUCATION SECTION */}
        <section id="education" className="scroll-mt-24">
          <FadeIn>
            <SectionHeading number="04" isDefault={educations.length === 0}>Education</SectionHeading>
            <div className="space-y-12">
              {displayEducations.map((edu, i) => (
                <div key={edu.id || i}>
                  <h3 className="text-xl font-semibold text-zinc-100">{edu.institution}</h3>
                  <h4 className="text-zinc-400 mt-1">{edu.degree}</h4>
                  <div className="font-mono text-xs text-zinc-500 mt-2 flex items-center gap-2">
                    <Calendar size={14} /> {edu.date} <span className="text-zinc-700">|</span> {edu.location}
                  </div>
                  <div className="mt-4 text-sm font-light text-zinc-400 space-y-2 whitespace-pre-line">
                    {edu.description}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 text-center scroll-mt-24 border-t border-zinc-900">
          <FadeIn>
            <span className="font-mono text-zinc-500 text-sm mb-4 block">05. What's Next?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">Get In Touch</h2>
            <p className="max-w-md mx-auto text-zinc-400 mb-10 font-light">
              I'm actively looking for an internship opportunity where I can apply my skills in Software Engineering and AI. Whether you have a position available or just want to connect, my inbox is always open.
            </p>
            <a href={`mailto:${profile.email}`} className="inline-block bg-zinc-100 text-zinc-900 px-8 py-4 rounded text-sm font-medium hover:bg-zinc-300 transition-colors">
              Say Hello
            </a>
          </FadeIn>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 border-t border-zinc-900 text-xs font-mono text-zinc-500 max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-5">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" title="GitHub">
              <Github size={18} />
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" title="LinkedIn">
              <Linkedin size={18} />
            </a>
          )}
          {profile.instagram && (
            <a href={profile.instagram} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Instagram">
              <Instagram size={18} />
            </a>
          )}
        </div>
        <a href={profile.github || "https://github.com/andyderis36"} target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">
          {settings.footerText}
        </a>
        <Link to="/login" className="hover:text-zinc-300 transition-colors">Admin Login</Link>
      </footer>
    </div>
  );
}
