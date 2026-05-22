import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { AlertTriangle, X } from 'lucide-react';

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [arsenal, setArsenal] = useState<{category: string, tech: string}[]>([
    { category: "Languages", tech: "Python, TypeScript, JavaScript (ES6+), SQL, Dart, Prolog" },
    { category: "Web & Mobile", tech: "Next.js 16, React 19, Tailwind CSS v4, Flask, Flutter" },
    { category: "AI & Data", tech: "LLM Integration (Gemini), NLP, Neural Networks, EDA" },
    { category: "DB & Cloud", tech: "MongoDB, Vercel Blob, Supabase, MySQL, VPS" },
    { category: "Tools", tech: "Git, Clerk, Ably (Realtime), Zod, Linux Admin" }
  ]);
  const [formData, setFormData] = useState({
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
    contactTitle: 'Get In Touch',
    contactText: "I'm actively looking for an internship opportunity where I can apply my skills in Software Engineering and AI. Whether you have a position available or just want to connect, my inbox is always open."
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'profile', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({ ...prev, ...data }));
          if (data.technicalArsenal) {
            setArsenal(data.technicalArsenal);
          }
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      await setDoc(doc(db, 'profile', 'main'), {
        ...formData,
        technicalArsenal: arsenal,
        updatedAt: serverTimestamp()
      });
      setStatus({ type: 'success', message: 'Profile saved successfully!' });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to save profile: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-zinc-700 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-zinc-700 rounded col-span-2"></div><div className="h-2 bg-zinc-700 rounded col-span-1"></div></div><div className="h-2 bg-zinc-700 rounded"></div></div></div></div>;

  return (
    <div className="space-y-12">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-100">Edit Profile</h2>
        </div>

        {status.message && (
          <div className={`p-4 mb-6 rounded flex items-center gap-3 ${status.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-300' : 'bg-red-900/30 border border-red-800 text-red-300'}`}>
            {status.type === 'error' && <AlertTriangle size={18} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Job Title</label>
              <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">GitHub URL</label>
              <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">LinkedIn URL</label>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Instagram URL</label>
              <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Status Text</label>
              <input type="text" name="statusText" value={formData.statusText} onChange={handleChange} required className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-zinc-200 mb-4 mt-8">Technical Arsenal</h3>
            <div className="space-y-4">
              {arsenal.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-start bg-[#0e0e11] sm:bg-transparent p-4 sm:p-0 border border-zinc-800 sm:border-0 rounded-lg sm:rounded-none">
                  <input 
                    type="text" 
                    value={item.category} 
                    onChange={(e) => {
                      const newArsenal = [...arsenal];
                      newArsenal[index].category = e.target.value;
                      setArsenal(newArsenal);
                    }}
                    placeholder="Category (e.g., Languages)"
                    className="w-full sm:w-1/3 bg-[#09090b] sm:bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2.5 text-zinc-300 text-sm focus:outline-none focus:border-zinc-500 transition-all"
                  />
                  <input 
                    type="text" 
                    value={item.tech} 
                    onChange={(e) => {
                      const newArsenal = [...arsenal];
                      newArsenal[index].tech = e.target.value;
                      setArsenal(newArsenal);
                    }}
                    placeholder="Technologies (comma separated)"
                    className="w-full sm:flex-1 bg-[#09090b] sm:bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2.5 text-zinc-300 text-sm focus:outline-none focus:border-zinc-500 transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setArsenal(arsenal.filter((_, i) => i !== index))}
                    className="self-end sm:self-auto p-2.5 text-red-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
                    title="Remove"
                  >
                    <AlertTriangle size={18} className="sm:hidden inline mr-2" />
                    <span className="sm:hidden">Remove Skill</span>
                    <X size={18} className="hidden sm:inline" />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => setArsenal([...arsenal, { category: '', tech: '' }])}
                className="w-full sm:w-auto text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-lg transition-all hover:bg-zinc-800 active:scale-95"
              >
                + Add Technical Arsenal
              </button>
            </div>
          </div>          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Bio (Paragraph 1)</label>
            <textarea name="bio1" value={formData.bio1} onChange={handleChange} required rows={3} className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Bio (Paragraph 2)</label>
            <textarea name="bio2" value={formData.bio2} onChange={handleChange} required rows={4} className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500"></textarea>
          </div>

          <div className="border-t border-zinc-800 pt-8 mt-8">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Contact Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Contact Title</label>
                <input type="text" name="contactTitle" value={formData.contactTitle} onChange={handleChange} required className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Contact Message</label>
                <textarea name="contactText" value={formData.contactText} onChange={handleChange} required rows={3} className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500"></textarea>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="bg-zinc-100 text-zinc-900 px-6 py-2 rounded text-sm font-medium hover:bg-zinc-300 transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>
    </div>
  );
}
