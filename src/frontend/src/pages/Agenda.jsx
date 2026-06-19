import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, Plus, CheckCircle, XCircle, RefreshCw, AlertTriangle, ChevronRight, ChevronDown } from 'lucide-react';

const Agenda = () => {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [filterType, setFilterType] = useState('mes');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalReschedule, setModalReschedule] = useState(false); 
  const [modalFinalizar, setModalFinalizar] = useState(null);
  const [modalConfirm, setModalConfirm] = useState(null);
  
  const [novo, setNovo] = useState({ cliente_id: '', profissional_id: '', data: '', hora: '', tipo_servico: '' });
  const [reagendamento, setReagendamento] = useState({ id: null, data: '', hora: '', profissional_id: '' });
  const [financeiro, setFinanceiro] = useState({ valor: '', tipo_pagamento: 'Dinheiro' });

  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]); 
  const [horariosDisponiveisReag, setHorariosDisponiveisReag] = useState([]); 
  
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isTimePickerReagOpen, setIsTimePickerReagOpen] = useState(false);

  const gerarTodosHorarios = () => {
    const lista = [];
    for (let i = 8; i <= 20; i++) {
      lista.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return lista;
  };

  useEffect(() => { carregarDados(); }, []);
  
  useEffect(() => {
    if (filterType === 'dia') {
      const hoje = new Date().toISOString().split('T')[0];
      setFilteredAppointments(appointments.filter(a => a.raw_date.startsWith(hoje)));
    } else {
      setFilteredAppointments(appointments);
    }
  }, [filterType, appointments]);

  useEffect(() => {
    if (novo.data && novo.profissional_id) {
       const todos = gerarTodosHorarios();
       const ocupados = appointments.filter(a => 
          a.raw_date.startsWith(novo.data) && 
          a.profissional_id === parseInt(novo.profissional_id) && 
          a.status !== 'cancelado'
       ).map(a => a.hora);
       setHorariosDisponiveis(todos.filter(h => !ocupados.includes(h)));
    } else {
       setHorariosDisponiveis([]);
    }
  }, [novo.data, novo.profissional_id, appointments]);

  useEffect(() => {
    if (reagendamento.data && reagendamento.profissional_id) {
       const todos = gerarTodosHorarios();
       const ocupados = appointments.filter(a => 
          a.id !== reagendamento.id && 
          a.raw_date.startsWith(reagendamento.data) && 
          a.profissional_id === parseInt(reagendamento.profissional_id) && 
          a.status !== 'cancelado'
       ).map(a => a.hora);
       setHorariosDisponiveisReag(todos.filter(h => !ocupados.includes(h)));
    } else {
       setHorariosDisponiveisReag([]);
    }
  }, [reagendamento.data, reagendamento.profissional_id, appointments]);

  const carregarDados = async () => {
    try {
      const [resCli, resProf, resAgenda] = await Promise.all([
        api.get('/clients'), api.get('/users'), api.get('/appointments')
      ]);
      setClientes(resCli.data);
      setProfissionais(resProf.data);
      
      setAppointments(resAgenda.data.map(item => {
        const dataObj = new Date(item.data_hora);
        const horaManual = item.data_hora.split('T')[1].substring(0, 5);
        return {
          id: item.id,
          cliente: resCli.data.find(c => c.id === item.cliente_id)?.nome || 'ID '+item.cliente_id,
          profissional: resProf.data.find(p => p.id === item.profissional_id)?.nome || 'ID '+item.profissional_id,
          profissional_id: item.profissional_id,
          servico: item.tipo_servico,
          dia: dataObj.getDate(),
          mes: dataObj.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', ''),
          hora: horaManual,
          raw_date: item.data_hora,
          status: item.status
        };
      }));
    } catch (e) { addToast("Erro ao carregar dados", "error"); }
  };

  const abrirReagendamento = (agendamento) => {
      setReagendamento({
          id: agendamento.id,
          data: agendamento.raw_date.split('T')[0],
          hora: agendamento.hora,
          profissional_id: agendamento.profissional_id
      });
      setModalReschedule(true);
  };

  const checkFinalizar = (id) => {
    const agendamento = appointments.find(a => a.id === id);
    if (new Date(agendamento.raw_date) > new Date()) {
        addToast("Ainda não é possível finalizar este atendimento.", "error");
        return;
    }
    setModalFinalizar(id);
  }

  const handleAgendar = async (e) => { e.preventDefault(); try { await api.post('/appointments', { ...novo, cliente_id: +novo.cliente_id, profissional_id: +novo.profissional_id, data_hora: `${novo.data}T${novo.hora}`, duracao_minutos: 60, tipo_servico: novo.tipo_servico }); addToast("Agendado!", "success"); setModalOpen(false); setNovo({ cliente_id: '', profissional_id: '', data: '', hora: '', tipo_servico: '' }); setIsTimePickerOpen(false); carregarDados(); } catch (e) { addToast(e.response?.data?.detail || "Erro ao agendar", "error"); } };
  
  const handleReagendar = async (e) => { 
    e.preventDefault(); 
    try { 
        await api.post(`/appointments/${reagendamento.id}/reschedule`, { 
            nova_data_hora: `${reagendamento.data}T${reagendamento.hora}`, 
            novo_profissional_id: reagendamento.profissional_id ? +reagendamento.profissional_id : null 
        }); 
        addToast("Reagendado!", "success"); 
        setModalReschedule(false); 
        carregarDados(); 
    } catch (e) { addToast(e.response?.data?.detail || "Erro ao reagendar", "error"); } 
  };
  
  const handleFinalizar = async (e) => { e.preventDefault(); if (parseFloat(financeiro.valor) < 0) { addToast("Valor inválido", "error"); return; } try { await api.post(`/appointments/${modalFinalizar}/finalize`, { valor: +financeiro.valor, tipo_pagamento: financeiro.tipo_pagamento }); addToast("Finalizado!", "success"); setModalFinalizar(null); setFinanceiro({ valor: '', tipo_pagamento: 'Dinheiro' }); carregarDados(); } catch (e) { addToast(e.response?.data?.detail || "Erro", "error"); } };
  const confirmCancelar = async () => { if (!modalConfirm) return; try { await api.post(`/appointments/${modalConfirm}/cancel`); addToast("Cancelado.", "success"); carregarDados(); } catch(e) { addToast("Erro", "error"); } setModalConfirm(null); };

  return (
    <div className="animate-fade-in">
      <header className="flex justify-between items-end mb-10">
        <div><h1 className="text-3xl font-bold text-dark-900 tracking-tighter mb-2">Agenda</h1><p className="text-dark-400 font-medium text-sm">Gerencie seus horários</p></div>
        <div className="flex gap-4">
           <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex"><button onClick={()=>setFilterType('dia')} className={`px-6 py-2.5 rounded-xl text-sm font-bold ${filterType==='dia'?'bg-dark-900 text-white shadow-md':'text-gray-400 hover:text-dark-900'}`}>Hoje</button><button onClick={()=>setFilterType('mes')} className={`px-6 py-2.5 rounded-xl text-sm font-bold ${filterType==='mes'?'bg-dark-900 text-white shadow-md':'text-gray-400 hover:text-dark-900'}`}>Mês</button></div>
           <button onClick={()=>setModalOpen(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0"><Plus size={18} strokeWidth={3} /> Novo</button>
        </div>
      </header>

      <div className="grid gap-5">
        {filteredAppointments.length === 0 && <div className="py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-[3rem] bg-gray-50/30"><div className="bg-white p-6 rounded-full shadow-soft mb-4"><Calendar size={32} className="text-gray-300" /></div><p className="text-gray-400 font-medium">Agenda livre.</p></div>}
        {filteredAppointments.map(a => (
          <div key={a.id} className={`group bg-white p-6 rounded-[2rem] border border-transparent hover:border-primary-100 shadow-card hover:shadow-soft transition-all duration-300 flex justify-between items-center relative overflow-hidden ${a.status==='cancelado'?'opacity-50 grayscale':''}`}>
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${a.status==='finalizado'?'bg-teal-400':a.status==='cancelado'?'bg-gray-300':'bg-primary-400'}`}></div>
            <div className="flex gap-8 items-center pl-4 min-w-0 flex-1">
              <div className="text-center shrink-0"><div className="text-xs font-bold text-gray-400 uppercase mb-1">{a.mes}</div><div className="text-3xl font-black text-dark-900 leading-none">{a.dia}</div></div>
              <div className="h-10 w-px bg-gray-100 shrink-0"></div>
              <div className="min-w-0 flex-1 pr-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl font-bold text-dark-900 tracking-tight">{a.hora}</span>
                  {a.status !== 'agendado' && <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide ${a.status==='finalizado'?'bg-teal-50 text-teal-600':'bg-gray-100 text-gray-400'}`}>{a.status}</span>}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <span className="text-dark-700 truncate max-w-[150px]" title={a.cliente}>{a.cliente}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                    <span className="truncate max-w-[120px]" title={a.servico}>{a.servico}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                    <span className="text-primary-600 truncate max-w-[120px]" title={a.profissional}>{a.profissional}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8 pr-4 shrink-0">
               {a.status === 'agendado' && (<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 pr-2">
                 <button onClick={()=>checkFinalizar(a.id)} className="p-3 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-500 hover:text-white transition-colors shadow-sm"><CheckCircle size={20} /></button>
                 <button onClick={()=>abrirReagendamento(a)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-500 hover:text-white transition-colors shadow-sm"><RefreshCw size={20} /></button>
                 <button onClick={()=>setModalConfirm(a.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors shadow-sm"><XCircle size={20} /></button>
               </div>)}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (<div className="fixed inset-0 bg-dark-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4"><div className="bg-white p-10 rounded-[3rem] w-full max-w-lg shadow-2xl animate-slide-up overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-bold text-dark-900">Novo Agendamento</h2><button onClick={()=>setModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100"><XCircle size={20}/></button></div>
        <form onSubmit={handleAgendar} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Cliente</label>
               <select className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-50 transition-all outline-none font-medium text-gray-700 cursor-pointer appearance-none" value={novo.cliente_id} onChange={e=>setNovo({...novo, cliente_id:e.target.value})} required><option value="">Selecione...</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
               <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Profissional</label>
               <select className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-50 transition-all outline-none font-medium text-gray-700 cursor-pointer appearance-none" value={novo.profissional_id} onChange={e=>setNovo({...novo, profissional_id:e.target.value})} required><option value="">Selecione...</option>{profissionais.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></div>
            </div>
            <div className="bg-gray-50 p-3 rounded-[2rem] border border-gray-100">
               <div className="flex items-center gap-3 p-2">
                  <div className="flex-1 group"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Data</label><input type="date" className="w-full p-3 bg-white rounded-2xl border-none outline-none font-medium text-gray-700 shadow-sm" value={novo.data} onChange={e=>setNovo({...novo, data:e.target.value})} required /></div>
                  <div className="w-px h-12 bg-gray-200 mx-1"></div>
                  <div className="flex-1 relative"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Horário</label>
                      <button type="button" onClick={() => { if(novo.data && novo.profissional_id) setIsTimePickerOpen(!isTimePickerOpen); else addToast("Selecione data e profissional", "info"); }} disabled={!novo.data || !novo.profissional_id} className={`w-full p-3 bg-white rounded-2xl text-left font-medium text-sm shadow-sm flex justify-between items-center transition-all ${(!novo.data || !novo.profissional_id) ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-700 cursor-pointer hover:bg-gray-50'}`}>
                         {novo.hora || "--:--"} <ChevronDown size={16} className={`transition-transform ${isTimePickerOpen ? 'rotate-180' : ''}`}/>
                      </button>
                      {isTimePickerOpen && (<div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 max-h-48 overflow-y-auto custom-scrollbar animate-fade-in">
                          {horariosDisponiveis.length > 0 ? (<div className="grid grid-cols-2 gap-2">{horariosDisponiveis.map(h => (<button key={h} type="button" onClick={() => { setNovo({...novo, hora: h}); setIsTimePickerOpen(false); }} className={`py-2 rounded-xl text-xs font-bold transition-all ${novo.hora === h ? 'bg-dark-900 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>{h}</button>))}</div>) : (<p className="text-center text-xs text-gray-400 py-2">Sem horários</p>)}
                      </div>)}
                  </div>
               </div>
               {(!novo.data || !novo.profissional_id) && (<p className="text-[10px] text-center text-gray-400 pb-2 italic">Selecione profissional e data</p>)}
            </div>
            <input placeholder="Serviço (máx 30 caracteres)" maxLength="30" className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-50 transition-all outline-none font-medium" value={novo.tipo_servico} onChange={e=>setNovo({...novo, tipo_servico:e.target.value})} required /><button type="submit" className="w-full bg-dark-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl mt-4 flex items-center justify-center gap-2">Confirmar <ChevronRight size={18} /></button>
      </form></div></div>)}
      
      {modalReschedule && (<div className="fixed inset-0 bg-dark-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4"><div className="bg-white p-10 rounded-[3rem] w-full max-w-lg shadow-2xl animate-slide-up border-t-4 border-blue-500 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-dark-900">Reagendar</h2><button onClick={()=>setModalReschedule(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100"><XCircle size={20}/></button></div>
             <form onSubmit={handleReagendar} className="space-y-5">
                
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Profissional</label>
                <select className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-gray-700 cursor-pointer appearance-none" value={reagendamento.profissional_id} onChange={e=>setReagendamento({...reagendamento, profissional_id:e.target.value})} required><option value="">Selecione...</option>{profissionais.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></div>

                <div className="bg-gray-50 p-3 rounded-[2rem] border border-gray-100">
                   <div className="flex items-center gap-3 p-2">
                      <div className="flex-1 group">
                         <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Nova Data</label>
                         <input type="date" className="w-full p-3 bg-white rounded-2xl border-none outline-none font-medium text-gray-700 shadow-sm" value={reagendamento.data} onChange={e=>setReagendamento({...reagendamento, data:e.target.value})} required />
                      </div>
                      <div className="w-px h-12 bg-gray-200 mx-1"></div>
                      <div className="flex-1 relative">
                          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Novo Horário</label>
                          <button type="button" onClick={() => { if(reagendamento.data && reagendamento.profissional_id) setIsTimePickerReagOpen(!isTimePickerReagOpen); }} className={`w-full p-3 bg-white rounded-2xl text-left font-medium text-sm shadow-sm flex justify-between items-center transition-all text-gray-700 cursor-pointer hover:bg-gray-50`}>
                             {reagendamento.hora || "--:--"} <ChevronDown size={16} className={`transition-transform ${isTimePickerReagOpen ? 'rotate-180' : ''}`}/>
                          </button>
                          {isTimePickerReagOpen && (<div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 max-h-48 overflow-y-auto custom-scrollbar animate-fade-in">
                              {horariosDisponiveisReag.length > 0 ? (<div className="grid grid-cols-2 gap-2">{horariosDisponiveisReag.map(h => (<button key={h} type="button" onClick={() => { setReagendamento({...reagendamento, hora: h}); setIsTimePickerReagOpen(false); }} className={`py-2 rounded-xl text-xs font-bold transition-all ${reagendamento.hora === h ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>{h}</button>))}</div>) : (<p className="text-center text-xs text-gray-400 py-2">Sem horários</p>)}
                          </div>)}
                      </div>
                   </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg mt-4">Salvar Alterações</button>
             </form>
      </div></div>)}

      {modalFinalizar && (<div className="fixed inset-0 bg-dark-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4"><div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl animate-slide-up border-t-8 border-green-500">
          <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-dark-900">Finalizar</h2><button onClick={() => setModalFinalizar(null)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100"><XCircle size={20}/></button></div>
          <form onSubmit={handleFinalizar} className="space-y-6"><div><label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Valor Total</label><input type="number" step="0.01" min="0" className="w-full p-5 pl-14 rounded-2xl bg-gray-50 outline-none font-bold text-xl" value={financeiro.valor} onChange={e=> {const val=e.target.value; if(val==='' || parseFloat(val)>=0) setFinanceiro({...financeiro, valor:val});}} required /></div><div className="grid grid-cols-3 gap-3">{['Dinheiro','Cartão','PIX'].map(t=><button type="button" key={t} onClick={()=>setFinanceiro({...financeiro, tipo_pagamento:t})} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${financeiro.tipo_pagamento===t?'border-teal-500 text-teal-600 bg-teal-50 shadow-sm':'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{t}</button>)}</div><button type="submit" className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-teal-700 transition-all mt-2">Concluir</button></form>
      </div></div>)}

      {modalConfirm && (<div className="fixed inset-0 bg-dark-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"><div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-slide-up"><div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4 mx-auto"><AlertTriangle size={24} /></div><h3 className="text-xl font-bold text-center text-dark-900 mb-2">Cancelar Agendamento?</h3><p className="text-center text-gray-500 text-sm mb-6">Esta ação não pode ser desfeita.</p><div className="flex gap-3"><button onClick={() => setModalConfirm(null)} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Voltar</button><button onClick={confirmCancelar} className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30">Sim, Cancelar</button></div></div></div>)}
    </div>
  );
};
export default Agenda;
