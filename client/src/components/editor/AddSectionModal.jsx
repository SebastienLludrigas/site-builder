import React, { useState } from 'react';
import { X, Plus, Sparkles, LayoutTemplate, Image as ImageIcon, UtensilsCrossed, BadgeCheck, Star, HelpCircle, Timer, Mail, BarChart3, Send, Flame, PanelBottom, FileText } from 'lucide-react';
import { AVAILABLE_SECTIONS } from '../../data/defaultTemplates';

const ICONS_MAP = {
  LayoutTemplate,
  Sparkles,
  FileText,
  Image: ImageIcon,
  UtensilsCrossed,
  BadgeCheck,
  Star,
  Timer,
  HelpCircle,
  Mail,
  BarChart3,
  Send,
  Flame,
  PanelBottom
};

export default function AddSectionModal({ isOpen, onClose, onAddSection, insertIndex = null }) {
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  if (!isOpen) return null;

  const categories = ['Tous', 'Accroche', 'Contenu', 'Médias', 'Commerce', 'Interactivité', 'Social', 'Structure'];

  const filteredSections = selectedCategory === 'Tous'
    ? AVAILABLE_SECTIONS
    : AVAILABLE_SECTIONS.filter(s => s.category === selectedCategory);

  const handleSelect = (sec) => {
    const newSection = {
      id: `${sec.type}-${Date.now()}`,
      type: sec.type,
      data: JSON.parse(JSON.stringify(sec.defaultData))
    };
    onAddSection(newSection, insertIndex);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[82vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ajouter un bloc / section</h3>
              <p className="text-xs text-slate-400">Choisissez parmi nos composants riches et pré-configurés.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto px-6 py-3 border-b border-slate-800 bg-slate-950/20">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sections Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSections.map(sec => {
            const IconComp = ICONS_MAP[sec.icon] || Sparkles;
            return (
              <div
                key={sec.type}
                onClick={() => handleSelect(sec)}
                className="group p-4 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500 rounded-xl cursor-pointer transition flex flex-col justify-between shadow-sm hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 bg-slate-800 rounded">
                      {sec.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition mb-1">
                    {sec.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Insérer cette section</span>
                  <Plus className="w-4 h-4 transition transform group-hover:rotate-90" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
