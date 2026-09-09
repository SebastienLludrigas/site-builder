import React from 'react';
import { Layers, Plus, RotateCcw, MessageSquare, ExternalLink } from 'lucide-react';

export default function Navbar({ onNewSite, onOpenInbox, onResetDemos, totalSubmissions, unreadCount }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">SiteCraft</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
                Local Host
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Visual website builder & local hosting platform</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Inbox button */}
          <button
            onClick={onOpenInbox}
            className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
            title="View all form submissions received across your websites"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Inbox</span>
            {unreadCount > 0 ? (
              <span className="px-1.5 py-0.5 text-xs font-bold bg-cyan-500 text-slate-950 rounded-full animate-pulse">
                {unreadCount}
              </span>
            ) : totalSubmissions > 0 ? (
              <span className="px-1.5 py-0.5 text-xs font-semibold bg-slate-700 text-slate-300 rounded-full">
                {totalSubmissions}
              </span>
            ) : null}
          </button>

          {/* Reset demos */}
          <button
            onClick={onResetDemos}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            title="Restore the 4 official showcase demo websites"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demos</span>
          </button>

          {/* New site button */}
          <button
            onClick={onNewSite}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-lg shadow-md shadow-indigo-600/30 transition transform hover:-translate-y-0.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Website</span>
            <span className="sm:hidden">New Site</span>
          </button>
        </div>

      </div>
    </header>
  );
}
