import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({
    navLogo: 'APAS.',
    footerText: 'Built by Andyderis'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data() as any);
        }
      } catch (err) {
        console.error("Error fetching settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      await setDoc(doc(db, 'settings', 'main'), {
        ...formData,
        updatedAt: serverTimestamp()
      });
      setStatus({ type: 'success', message: 'Settings saved successfully!' });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to save settings: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-zinc-700 rounded"></div></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Site Settings</h2>
        <p className="text-sm text-zinc-500 mt-1">Configure global website branding and footer information.</p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-300' : 'bg-red-900/30 border border-red-800 text-red-300'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 gap-6">
          <div className="group">
            <label className="block text-sm font-medium text-zinc-400 mb-2 group-focus-within:text-zinc-200 transition-colors">Nav Logo / Text</label>
            <input 
              type="text" 
              name="navLogo" 
              value={formData.navLogo} 
              onChange={handleChange} 
              required 
              className="w-full bg-[#0e0e11] border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 focus:outline-none focus:border-zinc-500 focus:bg-[#16161a] transition-all" 
              placeholder="e.g. MYLOGO."
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-zinc-400 mb-2 group-focus-within:text-zinc-200 transition-colors">Footer Custom Text</label>
            <input 
              type="text" 
              name="footerText" 
              value={formData.footerText} 
              onChange={handleChange} 
              required 
              className="w-full bg-[#0e0e11] border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 focus:outline-none focus:border-zinc-500 focus:bg-[#16161a] transition-all" 
              placeholder="e.g. Built with Love"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving} 
          className="w-full sm:w-auto bg-zinc-100 text-zinc-900 px-8 py-3 rounded-lg text-sm font-bold hover:bg-zinc-300 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-black/20"
        >
          {saving ? 'Saving Settings...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
