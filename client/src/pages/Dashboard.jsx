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
  Inbox,
  Eye,
  Link2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CreateSiteModal from '../components/CreateSiteModal';
import SubmissionsModal from '../components/SubmissionsModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';

export default function Dashboard({ onOpenEditor }) {
  const { showToast } = useToast();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'published' | 'draft'
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'name' | 'views'

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [inboxInitialSiteId, setInboxInitialSiteId] = useState(null);
  const [confirmState, setConfirmState] = useState(null); // { title, message, danger, onConfirm }

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
      if (!res.ok) throw new Error('The server could not duplicate this website.');
      await fetchSites();
      showToast('Website duplicated.', 'success');
    } catch (err) {
      console.error('Error duplicating site:', err);
      showToast(err.message || 'Could not duplicate this website.', 'error');
    }
  };

  const handleDelete = (siteId, siteTitle) => {
    setConfirmState({
      title: 'Delete website',
      message: `"${siteTitle}" and all of its pages, submissions, and uploaded media will be permanently removed. This can't be undone.`,
      confirmLabel: 'Delete website',
      danger: true,
      onConfirm: async () => {
        setConfirmState(null);
        try {
          const res = await fetch(`/api/sites/${siteId}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('The server could not delete this website.');
          setSites(prev => prev.filter(s => s.id !== siteId));
          showToast(`"${siteTitle}" was deleted.`, 'success');
        } catch (err) {
          console.error('Error deleting site:', err);
          showToast(err.message || 'Could not delete this website.', 'error');
        }
      }
    });
  };

  const handleResetDemos = () => {
    setConfirmState({
      title: 'Restore showcase demos',
      message: 'This resets Atelier Pastry, NovaPulse AI, Elena Vance Photo, and Tech Summit back to their original content, discarding any edits made to them.',
      confirmLabel: 'Restore demos',
      danger: false,
      onConfirm: async () => {
        setConfirmState(null);
        try {
          const res = await fetch('/api/sites/reset-demos', { method: 'POST' });
          if (!res.ok) throw new Error('The server could not restore the demo websites.');
          await fetchSites();
          showToast('Showcase demos restored.', 'success');
        } catch (err) {
          console.error('Error resetting demos:', err);
          showToast(err.message || 'Could not restore the demo websites.', 'error');
        }
      }
    });
  };

  const handleCopyLink = async (slug) => {
    const url = `${window.location.origin}/site/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard.', 'success');
    } catch (err) {
      console.error('Error copying link:', err);
      showToast('Could not copy the link. Copy it manually from the address bar instead.', 'error');
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

  // Filtered & sorted sites
  const filteredSites = sites
    .filter(site => {
      const matchesSearch = site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            site.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (site.description && site.description.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;
      if (filterTab === 'published') return site.published !== false;
      if (filterTab === 'draft') return site.published === false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });

  const totalSubmissions = sites.reduce((sum, s) => sum + (s.submissionsCount || 0), 0);
  const totalUnread = sites.reduce((sum, s) => sum + (s.unreadSubmissionsCount || 0), 0);
  const totalViews = sites.reduce((sum, s) => sum + (s.views || 0), 0);
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
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Your Locally Hosted Websites
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Create, customize, and visit your websites live with zero cloud deployment. Every site has its dedicated local URL and connected inbox.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 divide-x divide-slate-800 bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-slate-800/80 w-full md:w-auto">
              <div className="text-center px-2 sm:px-4">
                <div className="text-xl sm:text-2xl font-extrabold text-indigo-400">{sites.length}</div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Websites</div>
              </div>
              <div className="text-center px-2 sm:px-4">
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">{publishedCount}</div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Live & Online</div>
              </div>
              <div className="text-center px-2 sm:px-4">
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400">{totalViews}</div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Total Views</div>
              </div>
              <div className="text-center px-2 sm:px-4">
                <div className="text-xl sm:text-2xl font-extrabold text-cyan-400">{totalSubmissions}</div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Messages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto whitespace-nowrap">
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

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort websites by"
              className="bg-slate-900 border border-slate-800 text-slate-300 pl-3 pr-2 py-2 rounded-xl text-xs outline-none focus:border-indigo-500 transition"
            >
              <option value="updated">Last updated</option>
              <option value="name">Name A–Z</option>
              <option value="views">Most views</option>
            </select>

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
        </div>

        {/* Sites Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading your websites" role="status">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-7 bg-slate-950 border-b border-slate-800" />
                <div className="h-44 bg-slate-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 bg-slate-800 rounded" />
                  <div className="h-3 w-full bg-slate-800 rounded" />
                  <div className="h-3 w-2/3 bg-slate-800 rounded" />
                </div>
                <div className="px-5 py-3.5 border-t border-slate-800 h-14 bg-slate-950/40" />
              </div>
            ))}
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
                    {/* Mini browser chrome, framing the thumbnail as a live hosted page */}
                    <div className="h-7 bg-slate-950 border-b border-slate-800 flex items-center gap-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                      </div>
                      <div className="flex-1 flex items-center gap-1 bg-slate-900 rounded-md px-2 py-0.5 min-w-0">
                        <Globe className="w-2.5 h-2.5 text-slate-600 flex-shrink-0" />
                        <span className="text-[10px] font-mono text-slate-500 truncate">/site/{site.slug}</span>
                      </div>
                    </div>

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
                        <span className="flex items-center gap-1" title="Total page views">
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          {site.views || 0} views
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

                      {/* Copy live link */}
                      <button
                        onClick={() => handleCopyLink(site.slug)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                        title="Copy live website link"
                      >
                        <Link2 className="w-4 h-4" />
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

      <ConfirmDialog
        isOpen={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        danger={confirmState?.danger}
        onConfirm={confirmState?.onConfirm}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  );
}
