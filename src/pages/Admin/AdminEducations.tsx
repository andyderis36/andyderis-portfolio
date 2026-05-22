import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function AdminEducations() {
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    institution: '', degree: '', date: '', location: '', description: '', order: 0
  });

  const fetchEducations = async () => {
    try {
      const snap = await getDocs(collection(db, 'educations'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => a.order - b.order);
      setEducations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEducations(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'order' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleEdit = (edu: any) => {
    setEditingId(edu.id);
    setFormData({
      institution: edu.institution, degree: edu.degree,
      date: edu.date, location: edu.location,
      description: edu.description, order: edu.order
    });
  };

  const handleDelete = async (id: string) => {
    setStatus({ type: '', message: '' });
    try {
      await deleteDoc(doc(db, 'educations', id));
      setConfirmDelete(null);
      fetchEducations();
      setStatus({ type: 'success', message: 'Education deleted successfully!' });
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
        institution: formData.institution,
        degree: formData.degree,
        date: formData.date,
        location: formData.location,
        description: formData.description,
        order: formData.order,
        updatedAt: serverTimestamp()
      };
      if (!editingId) {
        payload.createdAt = serverTimestamp();
      }
      
      await setDoc(doc(db, 'educations', id), payload, { merge: true });
      setEditingId(null);
      setFormData({ institution: '', degree: '', date: '', location: '', description: '', order: 0 });
      fetchEducations();
      setStatus({ type: 'success', message: 'Education saved!' });
    } catch(err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-6">Manage Educations</h2>

      {status.message && (
        <div className={`p-4 mb-6 rounded ${status.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-300' : 'bg-red-900/30 border border-red-800 text-red-300'}`}>
          {status.message}
        </div>
      )}

      <div className="bg-[#0e0e11] border border-zinc-800 rounded p-4 sm:p-6 mb-8">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">{editingId ? 'Edit Education' : 'Add New Education'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="institution" placeholder="Institution" value={formData.institution} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
            <input type="text" name="degree" placeholder="Degree" value={formData.degree} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
            <input type="text" name="date" placeholder="Date (e.g. 2023 - 2027)" value={formData.date} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
          </div>
          <div>
            <textarea name="description" placeholder="Description/Coursework" value={formData.description} onChange={handleChange} required rows={3} className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full"></textarea>
          </div>
          <div className="w-1/3">
            <input type="number" name="order" placeholder="Order (0, 1, 2...)" value={formData.order} onChange={handleChange} className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
          </div>
          
          <div className="flex gap-2">
            <button type="submit" className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded text-sm font-medium hover:bg-zinc-300 flex items-center gap-2">
              <Plus size={16} /> {editingId ? 'Update' : 'Add Education'}
            </button>
            {editingId && (
               <button type="button" onClick={() => { setEditingId(null); setFormData({ institution: '', degree: '', date: '', location: '', description: '', order: 0 }); }} className="border border-zinc-800 text-zinc-300 px-4 py-2 rounded text-sm hover:bg-zinc-800">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {loading ? <p className="text-zinc-500">Loading...</p> : (
        <div className="space-y-4">
          {educations.map(edu => (
            <div key={edu.id} className="bg-[#0e0e11] border border-zinc-800 rounded-lg p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-zinc-200 text-lg">{edu.institution} <span className="text-xs text-zinc-600 font-mono block sm:inline-block sm:ml-2">(Order: {edu.order})</span></h4>
                <div className="text-zinc-300 font-medium text-sm mt-1">{edu.degree}</div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 mt-2 mb-3 font-mono">
                  <span>{edu.date}</span>
                  <span className="hidden sm:inline text-zinc-800">•</span>
                  <span>{edu.location}</span>
                </div>
                <p className="text-sm text-zinc-400 mt-2 font-light leading-relaxed">
                  {edu.description}
                </p>
              </div>
              <div className="flex gap-2 self-end sm:self-start shrink-0">
                {confirmDelete === edu.id ? (
                  <div className="flex items-center gap-2 bg-red-950/20 p-1 rounded-lg border border-red-900/30">
                    <span className="text-xs text-red-400 px-2 font-medium">Delete?</span>
                    <button onClick={() => handleDelete(edu.id)} className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-600 transition-colors">Yes</button>
                    <button onClick={() => setConfirmDelete(null)} className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-zinc-700 transition-colors">No</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handleEdit(edu)} className="p-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-all" title="Edit"><Edit2 size={18} /></button>
                    <button onClick={() => setConfirmDelete(edu.id)} className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button>
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
