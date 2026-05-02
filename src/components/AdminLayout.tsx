import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0e0e11] border-r border-zinc-900 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-zinc-900">
          <h1 className="font-mono font-bold text-zinc-100 tracking-tighter text-xl text-center md:text-left">CMS Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink 
            to="/admin" end
            className={({isActive}) => `block px-4 py-2 rounded text-sm ${isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
          >
            Profile
          </NavLink>
          <NavLink 
            to="/admin/projects"
            className={({isActive}) => `block px-4 py-2 rounded text-sm ${isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
          >
            Projects
          </NavLink>
          <NavLink 
            to="/admin/experiences"
            className={({isActive}) => `block px-4 py-2 rounded text-sm ${isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
          >
            Experiences
          </NavLink>
          <NavLink 
            to="/admin/educations"
            className={({isActive}) => `block px-4 py-2 rounded text-sm ${isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
          >
            Educations
          </NavLink>
          <NavLink 
            to="/admin/settings"
            className={({isActive}) => `block px-4 py-2 rounded text-sm ${isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
          >
            Site Settings
          </NavLink>
        </nav>
        <div className="p-4 border-t border-zinc-900">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-900/20 text-red-400 px-4 py-2 rounded text-sm font-medium hover:bg-red-900/40 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#09090b]">
        {children}
      </main>
    </div>
  );
}
