import React from 'react';
import { Palette, Type, Square, Sparkles, Check } from 'lucide-react';
import { THEME_PALETTES, TYPOGRAPHY_PRESETS } from '../../data/defaultTemplates';

export default function ThemePanel({ theme = {}, onUpdateTheme }) {
  const currentPalette = theme.palette || 'amber';

  const applyPalette = (pal) => {
    onUpdateTheme({
      ...theme,
      palette: pal.id,
      primaryColor: pal.primaryColor,
      secondaryColor: pal.secondaryColor,
      accentColor: pal.accentColor,
      backgroundColor: pal.backgroundColor,
      textColor: pal.textColor
    });
  };

  const applyTypography = (typePreset) => {
    onUpdateTheme({
      ...theme,
      fontHeading: typePreset.heading,
      fontBody: typePreset.body
    });
  };

  const applyRadius = (rClass) => {
    onUpdateTheme({
      ...theme,
      borderRadius: rClass
    });
  };

  return (
    <div className="p-4 space-y-6 text-xs text-slate-300">
      
      {/* 1. PALETTES PRESETS */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-slate-200 font-bold">
          <Palette className="w-4 h-4 text-indigo-400" />
          <span>Palettes de couleurs harmonieuses</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {THEME_PALETTES.map(pal => {
            const isSelected = theme.primaryColor === pal.primaryColor && theme.backgroundColor === pal.backgroundColor;
            return (
              <button
                key={pal.id}
                type="button"
                onClick={() => applyPalette(pal)}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600/10 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-200 truncate">{pal.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-5 h-5 rounded-full border border-black/20" style={{ backgroundColor: pal.primaryColor }} title="Primaire" />
                  <div className="w-5 h-5 rounded-full border border-black/20" style={{ backgroundColor: pal.accentColor }} title="Accent" />
                  <div className="w-5 h-5 rounded-full border border-black/20" style={{ backgroundColor: pal.backgroundColor }} title="Fond" />
                  <div className="w-5 h-5 rounded-full border border-black/20" style={{ backgroundColor: pal.textColor }} title="Texte" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CUSTOM COLOR PICKERS */}
      <div className="pt-4 border-t border-slate-800">
        <label className="font-bold text-slate-200 block mb-3">Couleurs personnalisées</label>
        <div className="space-y-2.5">
          
          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <span>Couleur Principale (Boutons, badges)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.primaryColor || '#4f46e5'}
                onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-400 w-16">{theme.primaryColor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <span>Couleur d'Accent (Éléments vifs)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.accentColor || '#06b6d4'}
                onChange={(e) => onUpdateTheme({ ...theme, accentColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-400 w-16">{theme.accentColor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <span>Arrière-plan du site</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.backgroundColor || '#ffffff'}
                onChange={(e) => onUpdateTheme({ ...theme, backgroundColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-400 w-16">{theme.backgroundColor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <span>Couleur du Texte principal</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.textColor || '#0f172a'}
                onChange={(e) => onUpdateTheme({ ...theme, textColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-400 w-16">{theme.textColor}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. TYPOGRAPHY */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-3 text-slate-200 font-bold">
          <Type className="w-4 h-4 text-indigo-400" />
          <span>Typographie & Polices</span>
        </div>

        <div className="space-y-2">
          {TYPOGRAPHY_PRESETS.map(tp => {
            const isSelected = (theme.fontHeading === tp.heading);
            return (
              <button
                key={tp.id}
                type="button"
                onClick={() => applyTypography(tp)}
                className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600/10 text-white font-semibold'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{tp.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5" style={{ fontFamily: tp.heading }}>
                    Titre d'exemple — The quick brown fox
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. BORDER RADIUS */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-3 text-slate-200 font-bold">
          <Square className="w-4 h-4 text-indigo-400" />
          <span>Arrondi des boutons & cartes</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Droit", class: "rounded-none", radius: "0px" },
            { label: "Discret", class: "rounded-lg", radius: "8px" },
            { label: "Moderne", class: "rounded-xl", radius: "14px" },
            { label: "Généreux", class: "rounded-2xl", radius: "22px" }
          ].map(r => {
            const isSelected = theme.borderRadius === r.class;
            return (
              <button
                key={r.class}
                type="button"
                onClick={() => applyRadius(r.class)}
                className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600/20 text-white font-bold'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-6 h-6 border-2 border-slate-400"
                  style={{ borderRadius: r.radius }}
                />
                <span className="text-[10px]">{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
