import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ExternalLink, 
  Edit3, 
  Copy, 
  Trash2, 
  Download, 
  MessageSquare, 
  Globe, 
  Clock, 
  Layers, 
  Search, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Inbox
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CreateSiteModal from '../components/CreateSiteModal';
import SubmissionsModal from '../components/SubmissionsModal';

export default function Dashboard({ onOpenEditor }) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'published' | 'draft'
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [inboxInitialSiteId, setInboxInitialSiteId] = useState(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sites');
      const data = await res.json();
      setSites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching sites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (siteId) => {
    try {
      const res = await fetch(`/api/sites/${siteId}/duplicate`, { method: 'POST' });
      if (res.ok) {
        fetchSites();
      }
    } catch (err) {
      console.error('Error duplicating site:', err);
    }
  };

  const handleDelete = async (siteId, siteTitle) => {
    if (!window.confirm(`Are you sure you want to delete the website "${siteTitle}"?`)) return;
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: 'DELETE' });
      if (res.ok) {
        setSites(prev => prev.filter(s => s.id !== siteId));
      }
    } catch (err) {
      console.error('Error deleting site:', err);
    }
  };

  const handleResetDemos = async () => {
    if (!window.confirm("Do you want to restore the 4 official showcase demo websites (Atelier Pastry, NovaPulse AI, Elena Vance Photo, Tech Summit)?")) return;
    try {
      const res = await fetch('/api/sites/reset-demos', { method: 'POST' });
      if (res.ok) {
        fetchSites();
      }
    } catch (err) {
      console.error('Error resetting demos:', err);
    }
  };

  const handleSiteCreated = (newSite) => {
    setSites(prev => [newSite, ...prev]);
    onOpenEditor(newSite.id);
  };

  const openSiteInbox = (siteId) => {
    setInboxInitialSiteId(siteId);
    setIsInboxModalOpen(true);
  };

  // Filtered sites
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (site.description && site.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterTab === 'published') return site.published !== false;
    if (filterTab === 'draft') return site.published === false;
    return true;
  });

  const totalSubmissions = sites.reduce((sum, s) => sum + (s.submissionsCount || 0), 0);
  const totalUnread = sites.reduce((sum, s) => sum + (s.unreadSubmissionsCount || 0), 0);
  const publishedCount = sites.filter(s => s.published !== false).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onNewSite={() => setIsCreateModalOpen(true)}
        onOpenInbox={() => { setInboxInitialSiteId(null); setIsInboxModalOpen(true); }}
        onResetDemos={handleResetDemos}
        totalSubmissions={totalSubmissions}
        unreadCount={totalUnread}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome & Stats Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Local Website Builder & Hosting
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Your Locally Hosted Websites
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Create, customize, and visit your websites live with zero cloud deployment. Every site has its dedicated local URL and connected inbox.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex gap-4 sm:gap-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="text-center px-2">
                <div className="text-2xl font-extrabold text-indigo-400">{sites.length}</div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Websites</div>
              </div>
              <div className="w-px bg-slate-800" />
              <div className="text-center px-2">
                <div className="text-2xl font-extrabold text-emerald-400">{publishedCount}</div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Live & Online</div>
              </div>
              <div className="w-px bg-slate-800" />
              <div className="text-center px-2">
                <div className="text-2xl font-extrabold text-cyan-400">{totalSubmissions}</div>
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Messages Received</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                filterTab === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({sites.length})
            </button>
            <button
              onClick={() => setFilterTab('published')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                filterTab === 'published' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setFilterTab('draft')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                filterTab === 'draft' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Drafts ({sites.length - publishedCount})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search websites..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Sites Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            Loading your websites...
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-200 mb-1">No websites found</h3>
            <p className="text-xs text-slate-400 mb-5">
              {searchQuery ? "No websites match your search query." : "Start by creating your first website now!"}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow hover:bg-indigo-500 transition"
            >
              <Plus className="w-4 h-4" /> Create Website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map(site => {
              const updatedDate = new Date(site.updatedAt || site.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <div
                  key={site.id}
                  className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl overflow-hidden flex flex-col justify-between transition duration-200 shadow-md hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div>
                    {/* Thumbnail banner */}
                    <div className="relative h-44 bg-slate-950 overflow-hidden border-b border-slate-800">
                      {site.heroImage ? (
                        <img
                          src={site.heroImage}
                          alt={site.title}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center font-bold text-3xl opacity-40"
                          style={{ backgroundColor: site.theme?.primaryColor || '#4f46e5' }}
                        >
                          🌐
                        </div>
                      )}

                      {/* Status badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow backdrop-blur-md flex items-center gap-1.5 ${
                          site.published !== false
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-slate-800/90 text-slate-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${site.published !== false ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                          <span>{site.published !== false ? 'Hosted & Live' : 'Draft'}</span>
                        </span>
                      </div>

                      {/* Unread submissions badge */}
                      {site.unreadSubmissionsCount > 0 && (
                        <button
                          onClick={() => openSiteInbox(site.id)}
                          className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500 text-slate-950 shadow-lg flex items-center gap-1 hover:scale-105 transition animate-bounce"
                          title="New message received!"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{site.unreadSubmissionsCount} new</span>
                        </button>
                      )}
                    </div>

                    {/* Body Info */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        <span>/site/{site.slug}</span>
                      </div>

                      <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition leading-snug line-clamp-1">
                        {site.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {site.description || "Custom website built with SiteCraft."}
                      </p>

                      {/* Meta badges */}
                      <div className="flex items-center gap-4 mt-4 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-slate-500" />
                          {site.sectionsCount || 0} sections
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {updatedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-5 py-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                    
                    {/* Primary actions */}
                    <div className="flex items-center gap-2">
                      {/* View live site */}
                      <a
                        href={`/site/${site.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                        title="Open live website in a new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Visit</span>
                      </a>

                      {/* Edit site */}
                      <button
                        onClick={() => onOpenEditor(site.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-600/30 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Secondary menu buttons */}
                    <div className="flex items-center gap-1">
                      {/* Messages button */}
                      <button
                        onClick={() => openSiteInbox(site.id)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
                        title={`View inbox messages (${site.submissionsCount || 0})`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {/* Duplicate button */}
                      <button
                        onClick={() => handleDuplicate(site.id)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                        title="Duplicate website"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Export ZIP */}
                      <a
                        href={`/api/sites/${site.id}/export`}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
                        title="Download standalone HTML ZIP archive"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(site.id, site.title)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                        title="Delete website"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Modals */}
      <CreateSiteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSiteCreated={handleSiteCreated}
      />

      <SubmissionsModal
        isOpen={isInboxModalOpen}
        onClose={() => { setIsInboxModalOpen(false); fetchSites(); }}
        initialSiteId={inboxInitialSiteId}
        sites={sites}
      />
    </div>
  );
}
