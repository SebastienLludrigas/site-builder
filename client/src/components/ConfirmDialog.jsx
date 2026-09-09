import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel
}) {
  useEscapeKey(isOpen, onCancel);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
      >
        <div className="p-5 flex items-start gap-3.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            danger ? 'bg-red-500/15 text-red-400' : 'bg-indigo-500/15 text-indigo-400'
          }`}>
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <h2 id="confirm-dialog-title" className="text-sm font-bold text-white">{title}</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            autoFocus
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-md transition ${
              danger
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
