import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, MapPin, ExternalLink, Calendar, Plus, Terminal, Instagram } from 'lucide-react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

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

const SectionHeading = ({ children, number }: { children: React.ReactNode, number: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <span className="font-mono text-zinc-500 text-sm">{number}.</span>
    <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 flex items-center gap-4">
      {children} 
      <div 
        className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
        title="Showing database content"
      />
    </h2>
    <div className="h-px bg-zinc-800 flex-grow ml-4"></div>
  </div>
);

export default function Home() {
  const [profile, setProfile] = useState<any>({
    name: '',
    jobTitle: '',
    bio1: '',
    bio2: '',
    email: '',
    github: '',
    linkedin: '',
    instagram: '',
    location: '',
    statusText: '',
    technicalArsenal: []
  });
  
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    navLogo: 'APAS.',
    footerText: 'Built by Andyderis'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubProfile = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
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
            <SectionHeading number="01">About Me</SectionHeading>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="text-zinc-400 leading-relaxed space-y-4 font-light">
                <p>{profile.bio1}</p>
                <p>{profile.bio2}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-4 font-mono">Technical Arsenal</h3>
                <ul className="space-y-4">
                  {(profile.technicalArsenal || []).map((skill: any, i: number) => (
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
            <SectionHeading number="02">Selected Projects</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
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
            <SectionHeading number="03">Where I've Worked</SectionHeading>
            <div className="space-y-12 border-l border-zinc-800 ml-3 md:ml-0 pl-6 md:pl-8">
              {experiences.map((job, i) => (
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
            <SectionHeading number="04">Education</SectionHeading>
            <div className="space-y-12">
              {educations.map((edu, i) => (
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
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
              {profile.contactTitle || 'Get In Touch'}
            </h2>
            <p className="max-w-md mx-auto text-zinc-400 mb-10 font-light">
              {profile.contactText || "I'm actively looking for an internship opportunity where I can apply my skills in Software Engineering and AI. Whether you have a position available or just want to connect, my inbox is always open."}
            </p>
            <a href={`mailto:${profile.email}`} className="inline-block bg-zinc-100 text-zinc-900 px-8 py-4 rounded text-sm font-medium hover:bg-zinc-300 transition-colors">
              Say Hello
            </a>
          </FadeIn>
        </section>      </main>

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
