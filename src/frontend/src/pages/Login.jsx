import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    const sucesso = await login(email, senha);
    if (sucesso) navigate('/');
    else setErro('Acesso negado. Verifique suas credenciais.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>

      <div className="bg-white/80 backdrop-blur-lg p-10 rounded-[2.5rem] shadow-soft w-full max-w-md border border-white relative z-10 animate-slide-up">
        <div className="text-center mb-10">
          <div className="bg-gradient-to-tr from-primary-600 to-primary-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow text-white transform rotate-12 hover:rotate-0 transition-all duration-500">
            <Scissors size={32} />
          </div>
          <h1 className="text-3xl font-bold text-dark-900 tracking-tight">Bem-vindo</h1>
          <p className="text-dark-400 mt-2 font-medium">Acesse o painel administrativo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-1 ml-1 group-focus-within:text-primary-600 transition-colors">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-medium text-dark-900 placeholder-gray-300 shadow-sm"
              placeholder="admin@test.com"
              required
            />
          </div>
          <div className="group">
            <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-1 ml-1 group-focus-within:text-primary-600 transition-colors">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 outline-none transition-all font-medium text-dark-900 placeholder-gray-300 shadow-sm"
              placeholder="••••••"
              required
            />
          </div>
          {erro && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center font-bold animate-pulse border border-red-100">{erro}</div>}
          <button type="submit" className="w-full bg-dark-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2">Entrar</button>
        </form>
      </div>
    </div>
  );
};
export default Login;
