import React, { useState } from 'react';
import { X, Sparkles, Globe, FileText, Check } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';

const TEMPLATES = [
  {
    id: "blank",
    title: "Blank Canvas",
    subtitle: "Start with a clean slate and customize 100% of sections",
    icon: "⚡",
    badge: "Custom",
    templateId: null
  },
  {
    id: "patisserie",
    title: "Artisan Bakery & Café",
    subtitle: "Craftsmanship, pastry menu, photo journal, and table reservations",
    icon: "🥐",
    badge: "Food & Hospitality",
    templateId: "site-patisserie-delice"
  },
  {
    id: "saas",
    title: "SaaS & AI Tech Platform",
    subtitle: "Modern dark mode, tiered pricing, metrics, and demo requests",
    icon: "⚡",
    badge: "Technology & B2B",
    templateId: "site-novapulse-ai"
  },
  {
    id: "portfolio",
    title: "Artist & Photographer Portfolio",
    subtitle: "Minimalist editorial layout, lightbox gallery, and commission requests",
    icon: "📷",
    badge: "Creative & Arts",
    templateId: "site-elena-vance-photo"
  },
  {
    id: "conference",
    title: "Tech Summit & Event",
    subtitle: "Live countdown ticker, keynote speakers, and ticketing passes",
    icon: "🚀",
    badge: "Events & Ticketing",
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

  useEscapeKey(isOpen, onClose);

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
      setError('Please provide a name for your website.');
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
        throw new Error(errData.error || 'Failed to create website');
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
              <h2 className="text-base font-bold text-white">Create a New Website</h2>
              <p className="text-xs text-slate-400">Your site will be immediately hosted and accessible locally on your machine.</p>
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
                Website Name *
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Skyline Studio, Artisan Bakery, AI Tech..."
                className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Local Address (URL Slug)
              </label>
              <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm focus-within:border-indigo-500">
                <span className="text-slate-500 text-xs mr-1">/site/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                  placeholder="my-site"
                  className="bg-transparent text-slate-100 outline-none w-full text-xs font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Short Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Artisanal bakery and organic tea room in Paris."
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Starting Template
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
              <span>Will be hosted at <span className="text-indigo-300 font-mono">{typeof window !== 'undefined' ? window.location.origin : ''}/site/{slug || '...'}</span></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/30 transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create & Open Editor'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
