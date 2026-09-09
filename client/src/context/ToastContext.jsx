import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

const STYLES = {
  success: 'border-emerald-500/30 text-emerald-300',
  error: 'border-red-500/30 text-red-300',
  info: 'border-indigo-500/30 text-indigo-300'
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++nextId.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }
    return id;
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 items-end pointer-events-none">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-2.5 max-w-sm w-full sm:w-80 bg-slate-900 border ${STYLES[toast.type] || STYLES.info} rounded-xl shadow-2xl px-4 py-3 animate-toast-in`}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-slate-200 flex-1 leading-relaxed">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-500 hover:text-slate-300 transition flex-shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
