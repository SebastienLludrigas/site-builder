import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, Trash2, CheckCircle2, MessageSquare, ExternalLink, Inbox } from 'lucide-react';

export default function SubmissionsModal({ isOpen, onClose, initialSiteId = null, sites = [] }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSiteFilter, setSelectedSiteFilter] = useState(initialSiteId || 'all');
  const [activeMessage, setActiveMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchSubmissions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialSiteId) {
      setSelectedSiteFilter(initialSiteId);
    }
  }, [initialSiteId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
      if (data && data.length > 0) {
        setActiveMessage(data[0]);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    try {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      const updated = submissions.filter(s => s.id !== id);
      setSubmissions(updated);
      if (activeMessage?.id === id) {
        setActiveMessage(updated[0] || null);
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
  };

  if (!isOpen) return null;

  const filteredSubmissions = selectedSiteFilter === 'all'
    ? submissions
    : submissions.filter(s => s.siteId === selectedSiteFilter || s.siteSlug === selectedSiteFilter);

  const getSiteName = (slugOrId) => {
    const site = sites.find(s => s.id === slugOrId || s.slug === slugOrId);
    return site ? site.title : slugOrId;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Boîte de Réception Locale</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">
                  {filteredSubmissions.length} message(s)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tous les formulaires soumis sur vos sites hébergés localement sont archivés ici.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Site Filter dropdown */}
            <select
              value={selectedSiteFilter}
              onChange={(e) => setSelectedSiteFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
            >
              <option value="all">Tous les sites ({submissions.length})</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.title}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split view (List on left, Detail on right) */}
        <div className="flex-1 flex overflow-hidden">
          {/* List panel */}
          <div className="w-2/5 border-r border-slate-800 overflow-y-auto bg-slate-950/20">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Chargement des messages...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Aucun message reçu pour le moment.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {filteredSubmissions.map(sub => {
                  const isSelected = activeMessage?.id === sub.id;
                  const dateStr = new Date(sub.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveMessage(sub)}
                      className={`w-full text-left p-4 transition flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600/15 border-l-4 border-indigo-500'
                          : 'hover:bg-slate-800/40 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-cyan-400 truncate max-w-[180px]">
                          {getSiteName(sub.siteId)}
                        </span>
                        <span className="text-[11px] text-slate-500">{dateStr}</span>
                      </div>
                      <div className="font-semibold text-sm text-slate-100 truncate">
                        {sub.data?.name || sub.data?.email || 'Visiteur anonyme'}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-2">
                        {sub.data?.message || sub.data?.service || 'Demande de contact'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="w-3/5 p-6 overflow-y-auto flex flex-col justify-between bg-slate-900">
            {activeMessage ? (
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Provenance : {getSiteName(activeMessage.siteId)}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">
                      {activeMessage.data?.name || 'Nom non renseigné'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Reçu le {new Date(activeMessage.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(activeMessage.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Supprimer ce message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Contact info cards */}
                <div className="grid grid-cols-2 gap-3">
                  {activeMessage.data?.email && (
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3">
                      <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <div className="text-[11px] text-slate-400">Email</div>
                        <a
                          href={`mailto:${activeMessage.data.email}`}
                          className="text-xs font-semibold text-slate-200 hover:text-indigo-400 truncate block"
                        >
                          {activeMessage.data.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {activeMessage.data?.phone && (
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3">
                      <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <div className="text-[11px] text-slate-400">Téléphone</div>
                        <a
                          href={`tel:${activeMessage.data.phone}`}
                          className="text-xs font-semibold text-slate-200 hover:text-emerald-400"
                        >
                          {activeMessage.data.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {activeMessage.data?.service && (
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3 col-span-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <div>
                        <div className="text-[11px] text-slate-400">Objet / Prestation demandée</div>
                        <div className="text-xs font-semibold text-slate-200">
                          {activeMessage.data.service}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message body */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Message transmis :
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {activeMessage.data?.message || '(Aucun message textuel supplémentaire)'}
                  </div>
                </div>

                {/* Quick reply bar */}
                {activeMessage.data?.email && (
                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <a
                      href={`mailto:${activeMessage.data.email}?subject=Suite à votre message sur ${encodeURIComponent(getSiteName(activeMessage.siteId))}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Répondre par email</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Sélectionnez un message à gauche pour afficher ses détails.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
