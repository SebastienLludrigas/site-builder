import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Undo, 
  Redo, 
  Save, 
  ExternalLink, 
  Plus, 
  Layers, 
  Palette, 
  Settings, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Trash2, 
  Edit3, 
  Check, 
  Download,
  Sparkles,
  X
} from 'lucide-react';

import Canvas from '../components/editor/Canvas';
import AddSectionModal from '../components/editor/AddSectionModal';
import SectionEditorDrawer from '../components/editor/SectionEditorDrawer';
import ThemePanel from '../components/editor/ThemePanel';
import SettingsPanel from '../components/editor/SettingsPanel';

export default function Editor({ siteId, onBackToDashboard }) {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // History stack for Undo / Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Editor states
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('sections'); // 'sections' | 'theme' | 'settings'
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load site on mount
  useEffect(() => {
    fetchSite();
  }, [siteId]);

  const fetchSite = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}`);
      if (!res.ok) throw new Error('Failed to load website');
      const data = await res.json();
      setSite(data);
      setHistory([JSON.parse(JSON.stringify(data))]);
      setHistoryIndex(0);
      if (data.sections && data.sections.length > 0) {
        setSelectedSectionId(data.sections[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Push new state to history stack
  const updateSiteState = (newSite, recordHistory = true) => {
    setSite(newSite);
    setHasUnsavedChanges(true);

    if (recordHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newSite)));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setSite(JSON.parse(JSON.stringify(prev)));
      setHasUnsavedChanges(true);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setSite(JSON.parse(JSON.stringify(next)));
      setHasUnsavedChanges(true);
    }
  };

  // Auto-save debounced or manual save
  const handleSave = async () => {
    if (!site) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/sites/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site)
      });
      if (res.ok) {
        const updated = await res.json();
        setSite(updated);
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Error saving site:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Section manipulation helpers
  const handleAddSection = (newSection, atIndex = null) => {
    const currentSections = [...(site.sections || [])];
    if (atIndex !== null && atIndex >= 0) {
      currentSections.splice(atIndex, 0, newSection);
    } else {
      currentSections.push(newSection);
    }
    const updated = { ...site, sections: currentSections };
    updateSiteState(updated);
    setSelectedSectionId(newSection.id);
  };

  const handleUpdateSection = (updatedSection) => {
    const currentSections = (site.sections || []).map(s => s.id === updatedSection.id ? updatedSection : s);
    const updated = { ...site, sections: currentSections };
    updateSiteState(updated);
    setEditingSection(updatedSection);
  };

  const handleMoveSection = (index, direction) => {
    const currentSections = [...(site.sections || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentSections.length) return;

    const [moved] = currentSections.splice(index, 1);
    currentSections.splice(targetIndex, 0, moved);

    const updated = { ...site, sections: currentSections };
    updateSiteState(updated);
  };

  const handleDuplicateSection = (sectionId) => {
    const currentSections = [...(site.sections || [])];
    const index = currentSections.findIndex(s => s.id === sectionId);
    if (index === -1) return;

    const original = currentSections[index];
    const duplicate = {
      ...JSON.parse(JSON.stringify(original)),
      id: `${original.type}-${Date.now()}`
    };

    currentSections.splice(index + 1, 0, duplicate);
    const updated = { ...site, sections: currentSections };
    updateSiteState(updated);
    setSelectedSectionId(duplicate.id);
  };

  const handleDeleteSection = (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    const currentSections = (site.sections || []).filter(s => s.id !== sectionId);
    const updated = { ...site, sections: currentSections };
    updateSiteState(updated);
    if (editingSection?.id === sectionId) {
      setEditingSection(null);
    }
  };

  // Settings & Theme updates
  const handleUpdateTheme = (newTheme) => {
    updateSiteState({ ...site, theme: newTheme });
  };

  const handleUpdateSettings = (newSettings) => {
    updateSiteState({ ...site, settings: newSettings });
  };

  const handleUpdateTitle = (newTitle) => {
    updateSiteState({ ...site, title: newTitle });
  };

  const handleUpdateSlug = (newSlug) => {
    updateSiteState({ ...site, slug: newSlug });
  };

  const handleUpdatePublished = (published) => {
    updateSiteState({ ...site, published });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400 font-semibold">Opening editor...</span>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md text-center">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'Website not found'}</p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const renderSidebarContent = () => (
    <>
      {/* Sidebar Tabs Switcher */}
      <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40">
        <button
          onClick={() => setActiveSidebarTab('sections')}
          className={`py-3 text-xs font-bold flex flex-col items-center gap-1 transition border-b-2 ${
            activeSidebarTab === 'sections'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sections</span>
        </button>

        <button
          onClick={() => setActiveSidebarTab('theme')}
          className={`py-3 text-xs font-bold flex flex-col items-center gap-1 transition border-b-2 ${
            activeSidebarTab === 'theme'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Theme</span>
        </button>

        <button
          onClick={() => setActiveSidebarTab('settings')}
          className={`py-3 text-xs font-bold flex flex-col items-center gap-1 transition border-b-2 ${
            activeSidebarTab === 'settings'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Tab: SECTIONS */}
      {activeSidebarTab === 'sections' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                Page Structure ({site.sections?.length || 0})
              </span>
            </div>

            {/* Sections list */}
            <div className="space-y-2">
              {(site.sections || []).map((sec, idx) => {
                const isSelected = selectedSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[10px] font-mono text-slate-500 w-4 text-center">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-bold capitalize">{sec.type}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {sec.data?.title || sec.data?.logoText || sec.type}
                        </div>
                      </div>
                    </div>

                    {/* Quick item actions */}
                    <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setEditingSection(sec); 
                          setMobileSidebarOpen(false);
                        }}
                        className="p-1 hover:text-indigo-400 rounded"
                        title="Edit Content"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, -1); }}
                        disabled={idx === 0}
                        className="p-1 hover:text-indigo-400 rounded disabled:opacity-20"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 1); }}
                        disabled={idx === (site.sections?.length || 0) - 1}
                        className="p-1 hover:text-indigo-400 rounded disabled:opacity-20"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeleteSection(sec.id); }}
                        className="p-1 hover:text-red-400 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add section button */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => { 
                setInsertAtIndex(null); 
                setIsAddSectionOpen(true); 
                setMobileSidebarOpen(false);
              }}
              className="w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Section</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab: THEME */}
      {activeSidebarTab === 'theme' && (
        <div className="flex-1 overflow-y-auto">
          <ThemePanel theme={site.theme} onUpdateTheme={handleUpdateTheme} />
        </div>
      )}

      {/* Tab: SETTINGS */}
      {activeSidebarTab === 'settings' && (
        <div className="flex-1 overflow-y-auto">
          <SettingsPanel
            site={site}
            onUpdateSettings={handleUpdateSettings}
            onUpdateSlug={handleUpdateSlug}
            onUpdateTitle={handleUpdateTitle}
            onUpdatePublished={handleUpdatePublished}
          />
        </div>
      )}
    </>
  );

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      
      {/* 1. TOP APP BAR */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between z-30 flex-shrink-0 gap-2">
        
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-1.5 sm:gap-3 overflow-hidden">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition flex items-center gap-1 text-xs font-semibold flex-shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden xs:block" />

          {/* Editable Title */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            <input
              type="text"
              value={site.title}
              onChange={(e) => handleUpdateTitle(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-white hover:bg-slate-800/60 px-1.5 py-1 rounded-lg border border-transparent hover:border-slate-700 outline-none focus:border-indigo-500 w-24 xs:w-36 sm:w-48 md:w-56 transition truncate"
            />
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
              (/site/{site.slug})
            </span>
          </div>
        </div>

        {/* Center: Viewport Switcher & Preview Mode Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Viewports */}
          <div className="flex bg-slate-950/80 p-0.5 sm:p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1 sm:p-1.5 rounded-lg transition ${viewport === 'desktop' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1 sm:p-1.5 rounded-lg transition ${viewport === 'tablet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1 sm:p-1.5 rounded-lg transition ${viewport === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Preview Toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isPreviewMode
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isPreviewMode ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isPreviewMode ? 'Preview' : 'Edit'}</span>
          </button>
        </div>

        {/* Right: Panels Toggle on Mobile, History, Live link & Save */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Mobile Panels Toggle Button */}
          {!isPreviewMode && (
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className={`p-1.5 rounded-lg border transition lg:hidden flex items-center gap-1 text-xs font-semibold ${
                mobileSidebarOpen 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle customize panels"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Panels</span>
            </button>
          )}

          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 transition"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30 transition"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Live site link */}
          <a
            href={`/site/${site.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition"
            title="Open live hosted website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Preview</span>
          </a>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg shadow-md transition ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            {isSaving ? (
              <span>...</span>
            ) : hasUnsavedChanges ? (
              <>
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save Changes</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Saved</span>
              </>
            )}
          </button>
        </div>

      </header>

      {/* 2. MAIN BODY (Sidebar + Canvas) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Desktop Left Control Sidebar */}
        {!isPreviewMode && (
          <aside className="hidden lg:flex w-80 bg-slate-900 border-r border-slate-800 flex-col flex-shrink-0 z-20">
            {renderSidebarContent()}
          </aside>
        )}

        {/* Mobile Slide-over Sidebar Drawer */}
        {!isPreviewMode && mobileSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-full sm:max-w-sm bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl animate-fade-in lg:hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Editor Panels</span>
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderSidebarContent()}
            </aside>
          </>
        )}

        {/* Center Live Canvas Stage */}
        <Canvas
          site={site}
          viewport={viewport}
          isPreviewMode={isPreviewMode}
          selectedSectionId={selectedSectionId}
          onSelectSection={(id) => setSelectedSectionId(id)}
          onEditSection={(sec) => setEditingSection(sec)}
          onMoveSection={handleMoveSection}
          onDuplicateSection={handleDuplicateSection}
          onDeleteSection={handleDeleteSection}
          onInsertSectionAt={(idx) => { setInsertAtIndex(idx); setIsAddSectionOpen(true); }}
          onPickImageForSection={(sec) => setEditingSection(sec)}
        />

      </div>

      {/* Modals & Drawers */}
      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onAddSection={handleAddSection}
        insertIndex={insertAtIndex}
      />

      <SectionEditorDrawer
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        section={editingSection}
        onUpdateSection={handleUpdateSection}
      />

    </div>
  );
}
