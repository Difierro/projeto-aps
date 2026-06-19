import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Trash2, ShieldAlert, User, Briefcase, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const Team = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', funcao: '', tipo_usuario: 'colaborador' });

  useEffect(() => { carregarUsuarios(); }, []);

  const carregarUsuarios = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) { console.error("Erro", error); }
  };

  const handleCadastro = async (e) => { e.preventDefault(); try { await api.post('/users', form); addToast("Colaborador cadastrado!", "success"); setForm({ nome: '', email: '', senha: '', funcao: '', tipo_usuario: 'colaborador' }); carregarUsuarios(); } catch (e) { addToast(e.response?.data?.detail || "Erro ao cadastrar", "error"); } };
  const handleRemover = async (id) => { if (confirm("Excluir?")) try { await api.delete(`/users/${id}`); carregarUsuarios(); addToast("Removido", "success"); } catch (e) { addToast("Erro ao excluir", "error"); } };

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)]">
      <header className="mb-6 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark-900 tracking-tight mb-1">Equipe</h1><p className="text-dark-400 text-xs font-medium">Gerencie sua equipe</p></div>
        <span className="bg-white px-3 py-1.5 rounded-lg text-[10px] font-bold text-dark-500 shadow-sm border border-gray-100 tracking-wider uppercase">Total: {users.length}</span>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
        <div className="xl:col-span-5 h-full">
           {user?.isGerente ? (
             <div className="bg-dark-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white h-fit flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-3"><div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10"><UserPlus size={18}/></div>Novo Membro</h2>
                  <form onSubmit={handleCadastro} className="space-y-4">
                    <input maxLength="50" className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 focus:bg-white/10 outline-none text-xs text-white placeholder-white/30" placeholder="Nome (máx 50 caracteres)" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
                    <input className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 focus:bg-white/10 outline-none text-xs text-white placeholder-white/30" placeholder="Email (admin@test.com)" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    <input type="password" minLength="6" maxLength="12" className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 focus:bg-white/10 outline-none text-xs text-white placeholder-white/30" placeholder="Senha (6-12 caracteres)" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} required />
                    <input maxLength="40" className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 focus:bg-white/10 outline-none text-xs text-white placeholder-white/30" placeholder="Função (máx 40 caracteres)" value={form.funcao} onChange={e => setForm({...form, funcao: e.target.value})} />
                    <div className="bg-white/5 p-1.5 rounded-xl border border-white/10 flex gap-2">{['colaborador', 'gerente'].map(role => (<button key={role} type="button" onClick={() => setForm({...form, tipo_usuario: role})} className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold capitalize transition-all ${form.tipo_usuario === role ? 'bg-primary-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/10'}`}>{role}</button>))}</div>
                    <button type="submit" className="w-full bg-white text-dark-900 py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all mt-4 flex items-center justify-center gap-2 text-xs">Cadastrar <ArrowRight size={14} /></button>
                  </form>
                </div>
             </div>
           ) : (
             <div className="bg-gray-50 p-10 rounded-[2.5rem] h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 min-h-[400px]">
               <div className="bg-white p-6 rounded-full shadow-sm mb-6 text-gray-400"><Lock size={40}/></div>
               <h3 className="text-xl font-bold text-gray-600 mb-2">Acesso Restrito</h3>
               <p className="text-gray-400 text-sm max-w-xs">Cadastro exclusivo para gerentes.</p>
             </div>
           )}
        </div>
        <div className="xl:col-span-7 h-full overflow-hidden flex flex-col">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-white h-full flex flex-col">
            <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold text-dark-900 flex items-center gap-3"><div className="bg-primary-50 p-2 rounded-xl text-primary-600"><ShieldAlert size={18}/></div>Membros</h2></div>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {users.map(user => (
                <div key={user.id} className="group flex items-center justify-between p-4 bg-[#f8fafc] rounded-[1.5rem] border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${user.tipo_usuario === 'gerente' ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>{user.tipo_usuario === 'gerente' ? <ShieldCheck size={20}/> : <User size={20}/>}</div>
                    <div><h3 className="font-bold text-dark-900 text-sm mb-0.5">{user.nome}</h3><p className="text-xs text-dark-400 font-medium mb-1">{user.email}</p>{user.funcao && <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-gray-100 text-[9px] font-bold text-dark-400 uppercase shadow-sm"><Briefcase size={10}/> {user.funcao}</div>}</div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={`text-[9px] px-3 py-1.5 rounded-full font-extrabold uppercase tracking-widest border ${user.tipo_usuario === 'gerente' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{user.tipo_usuario}</span>
                     {user.ativo && user?.isGerente && <button onClick={() => handleRemover(user.id)} className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl translate-x-4 group-hover:translate-x-0" title="Remover acesso">
                        <Trash2 size={20}/>
                      </button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Team;
