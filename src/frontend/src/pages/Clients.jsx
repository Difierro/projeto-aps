import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { Plus, Search, User, Phone, History, XCircle, Save, Star, Calendar, Filter, DollarSign, Scissors, Clock } from 'lucide-react';

const Clients = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const [clients, setClients] = useState([]);
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(false);
  const [modalHistory, setModalHistory] = useState(null); 
  const [historyData, setHistoryData] = useState([]); 
  const [novo, setNovo] = useState({ nome: '', telefone: '', preferencias: '' });
  
  const [historyFilter, setHistoryFilter] = useState({ start: '', end: '' });

  useEffect(() => { carregar(); }, [busca]);

  const carregar = async () => {
    try {
      const q = busca ? `?q=${busca}` : '';
      const res = await api.get(`/clients${q}`);
      setClients(res.data);
    } catch (e) { }
  };

  const mascaraTelefone = (v) => {
    v = v.replace(/\D/g, "");
    v = v.substring(0, 11);
    if (v.length > 10) {
        return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (v.length > 6) {
        return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
        return v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    } else if (v.length > 0) {
        return v.replace(/^(\d*)/, "($1");
    }
    return v;
  };

  const handlePhoneChange = (e) => {
    setNovo({...novo, telefone: mascaraTelefone(e.target.value)});
  };

  const salvarCliente = async (e) => { e.preventDefault(); try { await api.post('/clients', novo); setModal(false); setNovo({ nome: '', telefone: '', preferencias: '' }); carregar(); addToast("Cliente salvo!", "success"); } catch (e) { addToast(e.response?.data?.detail || "Erro ao salvar", "error"); } };

  const carregarHistorico = async (clienteId) => {
    try {
      let url = `/clients/${clienteId}/history`;
      const params = [];
      if (historyFilter.start) params.push(`start=${historyFilter.start}`);
      if (historyFilter.end) params.push(`end=${historyFilter.end}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await api.get(url);
      const agendamentos = res.data;

      const resUsers = await api.get('/users');
      const usuarios = resUsers.data;

      const historicoCompleto = agendamentos.map(item => {
        const prof = usuarios.find(u => u.id === item.profissional_id);
        return {
          ...item,
          nome_profissional: prof ? prof.nome : 'Desconhecido'
        };
      });
      
      setHistoryData(historicoCompleto);
    } catch (e) { 
      addToast("Erro ao buscar histórico", "error"); 
    }
  };

  const handleOpenHistory = (cliente) => {
    setModalHistory(cliente);
    setHistoryFilter({ start: '', end: '' });
    setHistoryData([]);
    carregarHistorico(cliente.id);
  };

  return (
    <div className="animate-fade-in">
      <header className="flex justify-between items-end mb-10">
        <div><h1 className="text-2xl font-bold text-dark-900 tracking-tighter mb-2">Clientes</h1><p className="text-dark-400 font-medium text-sm">Gerencie seus clientes</p></div>
        <button onClick={() => setModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-3xl flex items-center gap-3 font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"><Plus size={18} strokeWidth={3} /> Novo Cliente</button>
      </header>

      <div className="bg-white/60 backdrop-blur-md p-2 rounded-full shadow-sm border border-white mb-10 flex items-center gap-4 max-w-2xl focus-within:ring-4 focus-within:ring-primary-100 transition-all"><div className="bg-white p-3 rounded-full text-dark-400 shadow-sm"><Search size={20} /></div><input type="text" placeholder="Buscar cliente..." className="flex-1 outline-none text-dark-700 bg-transparent font-medium h-full py-2 text-lg" onChange={(e) => setBusca(e.target.value)} /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((c) => (
          <div key={c.id} className="group bg-white p-8 rounded-[2.5rem] shadow-card hover:shadow-soft border border-transparent hover:border-primary-100 transition-all duration-300 relative overflow-hidden cursor-default">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-primary-50 p-4 rounded-2xl text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors shadow-inner group-hover:shadow-lg"><User size={24} /></div>
                <button onClick={() => handleOpenHistory(c)} className="p-3 bg-white text-dark-400 rounded-2xl hover:text-primary-600 hover:bg-primary-50 shadow-sm border border-gray-50 transition-all" title="Ver Histórico">
                  <History size={20} />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-1">{c.nome}</h3>
              <p className="flex items-center gap-2 text-dark-400 font-medium mb-6"><Phone size={16} className="text-dark-300"/> {c.telefone || 'Sem telefone'}</p>
              {c.preferencias ? <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100"><div className="flex items-center gap-2 mb-2 text-xs font-bold text-dark-400 uppercase tracking-wider"><Star size={12} className="fill-current text-yellow-400" /> Preferências</div><p className="text-sm text-dark-600 font-medium leading-relaxed break-words line-clamp-3">{c.preferencias}</p></div> : <div className="h-[4.5rem]"></div>}
            </div>
          </div>
        ))}
      </div>
      
      {modal && (
        <div className="fixed inset-0 bg-dark-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-lg shadow-2xl animate-slide-up relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
             <h2 className="text-2xl font-bold mb-8">Novo Cliente</h2>
             <form onSubmit={salvarCliente} className="space-y-5">
               <input maxLength="100" className="w-full p-4 rounded-2xl bg-gray-50 outline-none font-medium" placeholder="Nome" value={novo.nome} onChange={e=>setNovo({...novo, nome:e.target.value})} required />
               <input maxLength="15" className="w-full p-4 rounded-2xl bg-gray-50 outline-none font-medium" placeholder="Telefone (84) 9XXXX-XXXX" value={novo.telefone} onChange={handlePhoneChange} />
               <textarea maxLength="50" className="w-full p-4 rounded-2xl bg-gray-50 outline-none font-medium h-32 resize-none" placeholder="Preferências (máx 50 caracteres)" value={novo.preferencias} onChange={e=>setNovo({...novo, preferencias:e.target.value})} />
               <div className="flex gap-3 mt-6"><button type="button" onClick={()=>setModal(false)} className="flex-1 py-4 text-gray-500 font-bold">Cancelar</button><button type="submit" className="flex-1 bg-dark-900 text-white rounded-2xl font-bold shadow-xl">Salvar</button></div>
             </form>
          </div>
        </div>
      )}

      {modalHistory && (
        <div className="fixed inset-0 bg-dark-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-2xl shadow-2xl animate-slide-up relative overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-start mb-6">
               <div>
                 <h2 className="text-2xl font-bold text-dark-900">Histórico de Atendimentos</h2>
                 <p className="text-primary-500 font-medium text-sm">{modalHistory.nome}</p>
               </div>
               <button onClick={() => setModalHistory(null)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"><XCircle size={24}/></button>
            </div>

            <div className="flex gap-3 mb-6 bg-gray-50 p-3 rounded-3xl border border-gray-100">
               <div className="flex items-center gap-2 flex-1 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm"><span className="text-[10px] font-bold text-gray-400 uppercase">De</span><input type="date" className="outline-none text-sm font-bold text-dark-700 w-full bg-transparent" value={historyFilter.start} onChange={e => setHistoryFilter({...historyFilter, start: e.target.value})} /></div>
               <div className="flex items-center gap-2 flex-1 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm"><span className="text-[10px] font-bold text-gray-400 uppercase">Até</span><input type="date" className="outline-none text-sm font-bold text-dark-700 w-full bg-transparent" value={historyFilter.end} onChange={e => setHistoryFilter({...historyFilter, end: e.target.value})} /></div>
               <button onClick={() => carregarHistorico(modalHistory.id)} className="bg-dark-900 text-white px-6 rounded-2xl font-bold text-sm hover:bg-black transition-colors shadow-lg flex items-center gap-2"><Filter size={16} /> Filtrar</button>
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar pr-2 space-y-3">
              {historyData.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm font-medium border-2 border-dashed border-gray-200 rounded-3xl">Nenhum histórico encontrado.</div>
              ) : (
                historyData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="flex flex-col items-center justify-center w-14 h-14 bg-primary-50 rounded-2xl text-primary-600 font-bold border border-primary-100/50">
                         <span className="text-lg leading-none">{new Date(item.data_hora).getDate()}</span>
                         <span className="text-[9px] uppercase tracking-wide mt-0.5">{new Date(item.data_hora).toLocaleString('pt-BR', { month: 'short' }).replace('.','')}</span>
                       </div>
                       <div>
                         <p className="font-bold text-dark-900 text-lg mb-0.5 flex items-center gap-2">{item.tipo_servico || 'Serviço Diverso'}</p>
                         <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                            <span className="flex items-center gap-1"><Scissors size={12}/> {item.nome_profissional}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {new Date(item.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100 shadow-sm">R$ {item.valor?.toFixed(2)}</p>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1">{item.tipo_pagamento || 'N/A'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-white text-center text-xs text-gray-400 font-medium">
               Mostrando {historyData.length} registro(s)
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
export default Clients;
