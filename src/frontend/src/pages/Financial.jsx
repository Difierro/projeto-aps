import { useState, useContext } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { DollarSign, Calendar, TrendingUp, Filter, ArrowRight, Lock, PieChart, Activity, CreditCard } from 'lucide-react';

const Financial = () => {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const [dates, setDates] = useState({ start: '', end: '' });
  const [report, setReport] = useState(null);
  
  if (!user?.isGerente) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 text-center max-w-lg relative overflow-hidden">
           <div className="bg-primary-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-500 border-4 border-primary-50"><Lock size={32} /></div>
           <h2 className="text-2xl font-bold text-gray-800 mb-3">Acesso Restrito</h2>
           <p className="text-gray-400 font-medium text-lg">Painel exclusivo para a gerência.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => date.toISOString().split('T')[0];
  const setPeriodo = (tipo) => {
    const hoje = new Date(); let inicio = new Date(), fim = new Date();
    if (tipo === 'semana') { inicio.setDate(hoje.getDate() - hoje.getDay()); fim.setDate(inicio.getDate() + 6); }
    else if (tipo === 'mes') { inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1); fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0); }
    else if (tipo === 'ano') { inicio = new Date(hoje.getFullYear(), 0, 1); fim = new Date(hoje.getFullYear(), 11, 31); }
    setDates({ start: formatDate(inicio), end: formatDate(fim) });
  };
  const gerarRelatorio = async (e) => { e.preventDefault(); try { const res = await api.get(`/reports/financial?start=${dates.start}&end=${dates.end}`); setReport(res.data); } catch (e) { addToast("Erro ao gerar relatório", "error"); } };

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)]">
      <header className="mb-8 flex justify-between items-end"><div><h1 className="text-3xl font-bold text-dark-900 tracking-tight mb-2">Financeiro</h1><p className="text-dark-500 text-sm font-medium">Gerencie suas finanças</p></div></header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
        
        {/* COLUNA ESQUERDA (7 cols): Filtros */}
        <div className="xl:col-span-7 h-full flex flex-col justify-center">
           <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-primary-500/5 border border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-40"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-dark-900 rounded-2xl text-white shadow-lg"><Filter size={20} /></div><h3 className="text-xl font-bold text-dark-900">Relatório Financeiro</h3></div>
                <div className="flex p-1.5 bg-gray-50 rounded-2xl mb-8 w-fit border border-gray-100">{['dia', 'semana', 'mes', 'ano'].map((p) => (<button key={p} onClick={() => setPeriodo(p)} className="px-6 py-2.5 rounded-xl text-xs font-bold capitalize text-gray-500 hover:bg-white hover:shadow-sm hover:text-primary-600 transition-all">{p === 'mes' ? 'Mês' : p === 'ano' ? 'Ano' : p}</button>))}</div>
                <form onSubmit={gerarRelatorio} className="space-y-6 max-w-md">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Início</label><input type="date" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-400 outline-none font-bold text-sm text-gray-700 transition-all" value={dates.start} onChange={e => setDates({...dates, start: e.target.value})} required /></div>
                     <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Fim</label><input type="date" className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-400 outline-none font-bold text-sm text-gray-700 transition-all" value={dates.end} onChange={e => setDates({...dates, end: e.target.value})} required /></div>
                   </div>
                   <button type="submit" className="w-full bg-dark-900 text-white h-14 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-sm group">Gerar Análise <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                </form>
              </div>
           </div>
        </div>

        {/* COLUNA DIREITA (5 cols): Métricas na Lateral */}
        <div className="xl:col-span-5 space-y-5 flex flex-col justify-center">
           {report ? (
             <>
                <div className="bg-gradient-to-br from-primary-600 to-rose-700 p-8 rounded-[3rem] text-white shadow-2xl shadow-primary-500/30 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                   <div className="absolute right-0 top-0 p-6 opacity-10 transform group-hover:scale-110 transition-transform"><DollarSign size={90}/></div>
                   <div className="relative z-10">
                     <p className="text-[10px] font-bold text-white/70 uppercase mb-3 tracking-widest">Faturamento Total</p>
                     <h2 className="text-5xl font-bold tracking-tighter">R$ {report.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                     <div className="mt-6 flex items-center gap-2 text-[10px] font-medium text-white/80 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10"><Calendar size={12}/> {dates.start} - {dates.end}</div>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary-100 transition-colors group">
                   <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1 group-hover:text-primary-400 transition-colors">Volume</p><h2 className="text-3xl font-bold text-dark-900">{report.detalhes?.length || 0} <span className="text-sm font-medium text-gray-400">atendimentos</span></h2></div>
                   <div className="p-4 bg-primary-50 text-primary-500 rounded-2xl"><Activity size={24}/></div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary-100 transition-colors group">
                   <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1 group-hover:text-primary-400 transition-colors">Ticket Médio</p><h2 className="text-3xl font-bold text-dark-900">R$ {report.total && report.detalhes?.length ? (report.total / report.detalhes.length).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : '0,00'}</h2></div>
                   <div className="p-4 bg-primary-50 text-primary-500 rounded-2xl"><PieChart size={24}/></div>
                </div>
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/30 p-8"><div className="bg-white p-6 rounded-full shadow-sm mb-4 text-gray-300"><TrendingUp size={40} /></div><h3 className="text-lg font-bold text-gray-500">Sem Dados</h3><p className="text-gray-400 text-xs max-w-[150px] mt-1">Gere um relatório para ver as métricas.</p></div>
           )}
        </div>
      </div>
    </div>
  );
};
export default Financial;
