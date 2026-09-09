import React, { useState } from 'react';
import { X, Sparkles, Globe, FileText, Check } from 'lucide-react';

const TEMPLATES = [
  {
    id: "blank",
    title: "Page Vierge",
    subtitle: "Commencez avec une structure minimale et personnalisez à 100%",
    icon: "⚡",
    badge: "Personnalisé",
    templateId: null
  },
  {
    id: "patisserie",
    title: "Boulangerie & Salon de Thé",
    subtitle: "Artisanat, carte de viennoiseries, galerie photos et réservations",
    icon: "🥐",
    badge: "Commerce & Gastronomie",
    templateId: "site-patisserie-delice"
  },
  {
    id: "saas",
    title: "Startup SaaS & Tech IA",
    subtitle: "Dark mode moderne, grille tarifaire, métriques et démo",
    icon: "⚡",
    badge: "Technologie & B2B",
    templateId: "site-novapulse-ai"
  },
  {
    id: "portfolio",
    title: "Portfolio Photographe & Art",
    subtitle: "Design minimaliste épuré, séries photos lightbox et prestations",
    icon: "📷",
    badge: "Créatif & Portfolios",
    templateId: "site-elena-vance-photo"
  },
  {
    id: "conference",
    title: "Conférence & Grand Événement",
    subtitle: "Compte à rebours interactif, intervenants, billetterie",
    icon: "🚀",
    badge: "Événements & Billetterie",
    templateId: "site-sommet-tech-2026"
  }
];

export default function CreateSiteModal({ isOpen, onClose, onSiteCreated }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    // Auto-generate clean slug
    const generated = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Veuillez donner un nom à votre site.');
      return;
    }

    setLoading(true);
    setError(null);

    const chosen = TEMPLATES.find(t => t.id === selectedTemplate);

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          templateId: chosen?.templateId || null
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erreur lors de la création du site');
      }

      const newSite = await res.json();
      onSiteCreated(newSite);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Créer un nouveau site</h2>
              <p className="text-xs text-slate-400">Votre site sera instantanément hébergé localement sur votre machine.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nom du site *
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Ex: Mon Restaurant Paris, Portfolio Sophie..."
                className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Adresse locale (Slug URL)
              </label>
              <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm focus-within:border-indigo-500">
                <span className="text-slate-500 text-xs mr-1">/site/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                  placeholder="mon-site"
                  className="bg-transparent text-slate-100 outline-none w-full text-xs font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Courte description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Pâtisserie artisanale et salon de thé bio au cœur du Marais."
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Modèle de départ
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMPLATES.map(t => {
                const isSelected = selectedTemplate === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-600/10'
                        : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{t.icon}</span>
                        <span className="font-semibold text-sm text-slate-100">{t.title}</span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                      {t.subtitle}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 bg-slate-800 rounded self-start">
                      {t.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sera accessible sur <span className="text-indigo-300 font-mono">{typeof window !== 'undefined' ? window.location.origin : ''}/site/{slug || '...'}</span></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/30 transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer et Ouvrir l\'Éditeur'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
