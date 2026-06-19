import { createContext, useState, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-toast backdrop-blur-md border border-white/40 text-sm font-semibold transition-all duration-500 animate-slide-left ${
              toast.type === 'success' ? 'bg-white/95 text-teal-700 border-teal-100' : 
              toast.type === 'error' ? 'bg-white/95 text-red-600 border-red-100' : 'bg-white/95 text-blue-600 border-blue-100'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={18} className="text-teal-500" />}
            {toast.type === 'error' && <AlertCircle size={18} className="text-red-500" />}
            {toast.type === 'info' && <Info size={18} className="text-blue-500" />}
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={14}/></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
