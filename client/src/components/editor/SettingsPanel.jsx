import React from 'react';
import { Settings, Globe, Mail, Eye, Tag } from 'lucide-react';

export default function SettingsPanel({ site, onUpdateSettings, onUpdateSlug, onUpdateTitle, onUpdatePublished }) {
  const s = site.settings || {};

  const EMOJI_FAVICONS = ['🌐', '🥐', '⚡', '📷', '🚀', '☕', '🌿', '💎', '🎨', '🔥', '✨', '🍕', '🍰'];

  return (
    <div className="p-4 space-y-6 text-xs text-slate-300">
      
      {/* 1. GENERAL IDENTITY */}
      <div className="space-y-3">
        <label className="font-bold text-slate-200 block text-xs flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          <span>Paramètres généraux</span>
        </label>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Titre officiel du site</label>
          <input
            type="text"
            value={site.title || ''}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="input-field font-semibold"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Identifiant d'accès local (Slug URL)</label>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <span className="text-slate-500 font-mono">/site/</span>
            <input
              type="text"
              value={site.slug || ''}
              onChange={(e) => onUpdateSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
              className="bg-transparent text-slate-100 font-mono outline-none w-full"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Accessible en direct sur : <span className="text-indigo-400 font-mono">{typeof window !== 'undefined' ? window.location.origin : ''}/site/{site.slug}</span>
          </p>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Description référencement / SEO</label>
          <textarea
            rows={3}
            value={site.description || ''}
            onChange={(e) => onUpdateSettings({ ...s, description: e.target.value })}
            placeholder="Courte description affichée dans l'onglet du navigateur..."
            className="input-field"
          />
        </div>
      </div>

      {/* 2. FAVICON */}
      <div className="pt-4 border-t border-slate-800">
        <label className="font-bold text-slate-200 block text-xs mb-2">Icône Favicon (Onglet navigateur)</label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_FAVICONS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => onUpdateSettings({ ...s, favicon: emoji })}
              className={`w-9 h-9 rounded-lg border text-lg flex items-center justify-center transition ${
                s.favicon === emoji
                  ? 'border-indigo-500 bg-indigo-600/20 shadow'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CONTACT NOTIFICATIONS */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <label className="font-bold text-slate-200 block text-xs flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-400" />
          <span>Boîte de réception & Alertes</span>
        </label>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">E-mail de contact du site</label>
          <input
            type="email"
            value={s.contactEmail || ''}
            onChange={(e) => onUpdateSettings({ ...s, contactEmail: e.target.value })}
            placeholder="contact@mon-domaine.fr"
            className="input-field"
          />
        </div>
      </div>

      {/* 4. VISIBILITY & BRANDING */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <label className="font-bold text-slate-200 block text-xs mb-2">Publication & Affichage</label>
        
        <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div>
            <div className="font-semibold text-slate-200">Statut Publié</div>
            <div className="text-[10px] text-slate-400">Rendre le site accessible sur /site/{site.slug}</div>
          </div>
          <input
            type="checkbox"
            checked={site.published !== false}
            onChange={(e) => onUpdatePublished(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div>
            <div className="font-semibold text-slate-200">Badge SiteCraft</div>
            <div className="text-[10px] text-slate-400">Afficher la pastille discrète en bas de page</div>
          </div>
          <input
            type="checkbox"
            checked={s.showBranding !== false}
            onChange={(e) => onUpdateSettings({ ...s, showBranding: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
          />
        </div>
      </div>

    </div>
  );
}
