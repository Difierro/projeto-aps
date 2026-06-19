import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, Users, DollarSign, LogOut, Scissors, Briefcase } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: 'Agenda', path: '/', icon: Calendar },
    { name: 'Clientes', path: '/clientes', icon: Users },
    { name: 'Equipe', path: '/equipe', icon: Briefcase },
    { name: 'Financeiro', path: '/financeiro', icon: DollarSign },
  ];

  return (
    <div className="flex h-screen bg-background font-sans text-dark-900 overflow-hidden">
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-white/50 flex flex-col z-20 relative shadow-soft">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-8 pl-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white shadow-glow">
              <Scissors size={18} />
            </div>
            <div><h1 className="text-lg font-bold tracking-tight text-dark-900 leading-none">Gestor</h1><span className="text-[9px] font-bold text-dark-500 tracking-[0.2em] uppercase">Salão</span></div>
          </div>
          
          <div className="text-[9px] font-bold text-dark-500 uppercase tracking-wider mb-3 px-4">Menu</div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-[1rem] transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-dark-900 text-white shadow-lg shadow-dark-900/20' : 'text-dark-500 hover:bg-white hover:shadow-card hover:text-primary-600'}`}>
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'stroke-2' : 'stroke-[1.5]'}`} />
                  <span className="font-medium relative z-10 text-xs">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5 pt-0">
          <div className="bg-gradient-to-b from-white/50 to-white/90 p-1 rounded-[1.5rem] border border-white shadow-card">
            <button onClick={logout} className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-3xl text-[10px] font-bold text-dark-500 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-wide">
              <LogOut size={12} /> Sair
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="fixed bottom-0 left-20 w-[500px] h-[500px] bg-secondary-50/50 rounded-full blur-3xl translate-y-1/3 pointer-events-none"></div>
        <div className="max-w-[1600px] mx-auto p-8 lg:p-10 pb-24 relative z-10"><Outlet /></div>
      </main>
    </div>
  );
};
export default Layout;
