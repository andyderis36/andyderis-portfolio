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
    <div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-6">Site Settings</h2>
      {status.message && (
        <div className={`p-4 mb-6 rounded ${status.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-300' : 'bg-red-900/30 border border-red-800 text-red-300'}`}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Nav Logo / Text</label>
            <input type="text" name="navLogo" value={formData.navLogo} onChange={handleChange} required className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Footer Custom Text</label>
            <input type="text" name="footerText" value={formData.footerText} onChange={handleChange} required className="w-full bg-[#0e0e11] border border-zinc-800 rounded px-4 py-2 text-zinc-300 focus:outline-none focus:border-zinc-500" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-zinc-100 text-zinc-900 px-6 py-2 rounded text-sm font-medium hover:bg-zinc-300 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
