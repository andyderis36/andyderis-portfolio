import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', subtitle: '', desc: '', stack: '', link: '', order: 0
  });

  const fetchProjects = async () => {
    try {
      const snap = await getDocs(collection(db, 'projects'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => a.order - b.order);
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'order' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleEdit = (proj: any) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title, subtitle: proj.subtitle,
      desc: proj.desc, stack: proj.stack.join(', '),
      link: proj.link, order: proj.order
    });
  };

  const handleDelete = async (id: string) => {
    setStatus({ type: '', message: '' });
    try {
      await deleteDoc(doc(db, 'projects', id));
      setConfirmDelete(null);
      fetchProjects();
      setStatus({ type: 'success', message: 'Project deleted successfully!' });
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
        title: formData.title,
        subtitle: formData.subtitle,
        desc: formData.desc,
        stack: formData.stack.split(',').map(s => s.trim()).filter(Boolean),
        link: formData.link,
        order: formData.order,
        updatedAt: serverTimestamp()
      };
      if (!editingId) {
        payload.createdAt = serverTimestamp();
      }
      
      await setDoc(doc(db, 'projects', id), payload, { merge: true });
      setEditingId(null);
      setFormData({ title: '', subtitle: '', desc: '', stack: '', link: '', order: 0 });
      fetchProjects();
      setStatus({ type: 'success', message: 'Project saved!' });
    } catch(err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-6">Manage Projects</h2>
      
      {status.message && (
        <div className={`p-4 mb-6 rounded ${status.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-300' : 'bg-red-900/30 border border-red-800 text-red-300'}`}>
          {status.message}
        </div>
      )}

      <div className="bg-[#0e0e11] border border-zinc-800 rounded p-4 sm:p-6 mb-8">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
            <input type="text" name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleChange} required className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
          </div>
          <textarea name="desc" placeholder="Description" value={formData.desc} onChange={handleChange} required rows={3} className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full"></textarea>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="stack" placeholder="Tech Stack (comma separated)" value={formData.stack} onChange={handleChange} className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full col-span-2" />
            <input type="number" name="order" placeholder="Order (0, 1, 2...)" value={formData.order} onChange={handleChange} className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
          </div>
          <input type="url" name="link" placeholder="Project Link" value={formData.link} onChange={handleChange} className="bg-[#09090b] border border-zinc-800 rounded px-4 py-2 text-zinc-300 w-full" />
          
          <div className="flex gap-2">
            <button type="submit" className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded text-sm font-medium hover:bg-zinc-300 flex items-center gap-2">
              <Plus size={16} /> {editingId ? 'Update' : 'Add Project'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', subtitle: '', desc: '', stack: '', link: '', order: 0 }); }} className="border border-zinc-800 text-zinc-300 px-4 py-2 rounded text-sm hover:bg-zinc-800">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {loading ? <p className="text-zinc-500">Loading...</p> : (
        <div className="space-y-4">
          {projects.map(proj => (
            <div key={proj.id} className="bg-[#0e0e11] border border-zinc-800 rounded-lg p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-zinc-200 text-lg">{proj.title} <span className="text-xs text-zinc-600 font-mono block sm:inline-block sm:ml-2">(Order: {proj.order})</span></h4>
                <p className="text-sm text-zinc-400 mt-1">{proj.subtitle}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {proj.stack.map((s: string) => <span key={s} className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-500 px-2.5 py-1 rounded-md">{s}</span>)}
                </div>
              </div>
              <div className="flex gap-2 self-end sm:self-start shrink-0">
                {confirmDelete === proj.id ? (
                  <div className="flex items-center gap-2 bg-red-950/20 p-1 rounded-lg border border-red-900/30">
                    <span className="text-xs text-red-400 px-2 font-medium">Delete?</span>
                    <button onClick={() => handleDelete(proj.id)} className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-600 transition-colors">Yes</button>
                    <button onClick={() => setConfirmDelete(null)} className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-zinc-700 transition-colors">No</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handleEdit(proj)} className="p-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-all" title="Edit"><Edit2 size={18} /></button>
                    <button onClick={() => setConfirmDelete(proj.id)} className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button>
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
