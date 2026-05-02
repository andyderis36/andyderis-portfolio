import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    role: '', company: '', date: '', location: '', tasks: '', order: 0
  });

  const fetchExperiences = async () => {
    try {
      const snap = await getDocs(collection(db, 'experiences'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => a.order - b.order);
      setExperiences(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperiences(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'order' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormData({
      role: exp.role, company: exp.company,
      date: exp.date, location: exp.location,
      tasks: exp.tasks.join('\n'), order: exp.order
    });
  };

  const handleDelete = async (id: string) => {
    setStatus({ type: '', message: '' });
    try {
      await deleteDoc(doc(db, 'experiences', id));
      setConfirmDelete(null);
      fetchExperiences();
      setStatus({ type: 'success', message: 'Experience deleted successfully!' });
    } catch(err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      const id = editingId || crypto.randomUUID();
      const payload: any = {
        role: formData.role,
        company: formData.company,
        date: formData.date,
        location: formData.location,
        tasks: formData.tasks.split('\n').filter(s => s.trim() !== ''),
        order: formData.order,
        updatedAt: serverTimestamp()
      };
      if (!editingId) {
        payload.createdAt = serverTimestamp();
      }
      
      await setDoc(doc(db, 'experiences', id), payload, { merge: true });
      setEditingId(null);
      setFormData({ role: '', company: '', date: '', location: '', tasks: '', order: 0 });
      fetchExperiences();
      setStatus({ type: 'success', message: 'Experience saved!' });
    } catch(err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-6">Manage Experiences</h2>

      {status.message && (
        <div className={`p-4 mb-6 rounded ${status.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-300' : 'bg-red-900/30 border border-red-800 text-red-300'}`}>
          {status.message}
        </div>
      )}

      <div className="bg-[#0e0e11] border border-zinc-800 rounded p-6 mb-8">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">{editingId ? 'Edit Experience' : 'Add New Experience'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="role" placeholder="Role (e.g. Backend Intern)" value={formData.role} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
            <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
            <input type="text" name="date" placeholder="Date (e.g. Jan 2022 - Jun 2022)" value={formData.date} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
          </div>
          <div>
            <textarea name="tasks" placeholder="Tasks (One per line)" value={formData.tasks} onChange={handleChange} required rows={4} className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full"></textarea>
          </div>
          <div className="w-1/3">
            <input type="number" name="order" placeholder="Order (0, 1, 2...)" value={formData.order} onChange={handleChange} className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
          </div>
          
          <div className="flex gap-2">
            <button type="submit" className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded text-sm font-medium hover:bg-zinc-300 flex items-center gap-2">
              <Plus size={16} /> {editingId ? 'Update' : 'Add Experience'}
            </button>
            {editingId && (
               <button type="button" onClick={() => { setEditingId(null); setFormData({ role: '', company: '', date: '', location: '', tasks: '', order: 0 }); }} className="border border-zinc-800 text-zinc-300 px-4 py-2 rounded text-sm hover:bg-zinc-800">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {loading ? <p className="text-zinc-500">Loading...</p> : (
        <div className="space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="bg-[#0e0e11] border border-zinc-800 rounded p-4 flex justify-between items-start">
              <div>
                <h4 className="font-bold text-zinc-200">{exp.role} @ {exp.company} <span className="text-xs text-zinc-600 font-mono">(Order: {exp.order})</span></h4>
                <div className="flex gap-2 text-xs text-zinc-500 mt-1 mb-2 font-mono">
                  <span>{exp.date}</span> • <span>{exp.location}</span>
                </div>
                <ul className="text-sm text-zinc-400 space-y-1 ml-4 list-disc">
                  {exp.tasks.map((t: string, i: number) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div className="flex gap-2">
                {confirmDelete === exp.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Sure?</span>
                    <button onClick={() => handleDelete(exp.id)} className="bg-red-900/40 text-red-400 px-3 py-1 rounded text-xs hover:bg-red-900/60">Yes</button>
                    <button onClick={() => setConfirmDelete(null)} className="border border-zinc-800 text-zinc-400 px-3 py-1 rounded text-xs hover:bg-zinc-800">No</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handleEdit(exp)} className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded"><Edit2 size={16} /></button>
                    <button onClick={() => setConfirmDelete(exp.id)} className="p-2 text-red-500 hover:text-red-400 hover:bg-red-950/30 rounded"><Trash2 size={16} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
