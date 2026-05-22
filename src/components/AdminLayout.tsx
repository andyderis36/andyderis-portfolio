import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Menu, X, User, Briefcase, GraduationCap, Settings, LogOut, LayoutDashboard, Home } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      signOut(auth);
    }, 100);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const navItems = [
    { to: "/admin", label: "Profile", icon: <User size={18} />, end: true },
    { to: "/admin/projects", label: "Projects", icon: <Briefcase size={18} /> },
    { to: "/admin/experiences", label: "Experiences", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/educations", label: "Educations", icon: <GraduationCap size={18} /> },
    { to: "/admin/settings", label: "Site Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans flex flex-col md:flex-row-reverse">
      {/* Mobile Header */}
      <header className="md:hidden bg-[#0e0e11] border-b border-zinc-900 p-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="font-mono font-bold text-zinc-100 tracking-tighter text-lg">CMS Admin</h1>
        <button onClick={toggleSidebar} className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 right-0 z-[70] md:z-30 w-72 md:w-64 h-screen bg-[#0e0e11] border-l border-zinc-900 transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header (Mobile) */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between md:hidden">
          <span className="font-mono font-bold text-zinc-100">Navigation</span>
          <button onClick={closeSidebar} className="p-2 text-zinc-400 hover:text-zinc-100">
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Header (Desktop) */}
        <div className="p-6 border-b border-zinc-900 hidden md:block">
          <h1 className="font-mono font-bold text-zinc-100 tracking-tighter text-xl text-right">CMS Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              end={item.end}
              onClick={closeSidebar}
              className={({isActive}) => `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all flex-row-reverse
                ${isActive ? 'bg-zinc-800 text-zinc-100 shadow-lg shadow-black/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1 text-right">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-900 space-y-2">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex flex-row-reverse items-center justify-start gap-3 bg-zinc-900/50 text-zinc-400 border border-zinc-800 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 hover:text-zinc-200 transition-all active:scale-95"
          >
            <Home size={16} />
            <span className="flex-1 text-right">Home</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex flex-row-reverse items-center justify-start gap-3 bg-red-900/10 text-red-500 border border-red-900/20 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-900/20 transition-all active:scale-95"
          >
            <LogOut size={16} />
            <span className="flex-1 text-right">Sign Out</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
