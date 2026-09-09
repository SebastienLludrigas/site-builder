import React, { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Trash2, 
  Edit3, 
  Plus, 
  Image as ImageIcon,
  Sparkles,
  Check,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';

export default function Canvas({
  site,
  viewport,
  isPreviewMode,
  selectedSectionId,
  onSelectSection,
  onEditSection,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onInsertSectionAt,
  onPickImageForSection
}) {
  const [pricingPeriodYearly, setPricingPeriodYearly] = useState(false);
  const [openFaqIndexes, setOpenFaqIndexes] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);

  const theme = site.theme || {};
  const sections = site.sections || [];

  const primaryColor = theme.primaryColor || '#4f46e5';
  const secondaryColor = theme.secondaryColor || '#1e1b4b';
  const accentColor = theme.accentColor || '#06b6d4';
  const bgColor = theme.backgroundColor || '#ffffff';
  const textColor = theme.textColor || '#0f172a';
  const fontHeading = theme.fontHeading || 'Inter';
  const fontBody = theme.fontBody || 'Inter';

  let radiusClass = '12px';
  if (theme.borderRadius === 'rounded-none') radiusClass = '0px';
  if (theme.borderRadius === 'rounded-lg') radiusClass = '8px';
  if (theme.borderRadius === 'rounded-xl') radiusClass = '14px';
  if (theme.borderRadius === 'rounded-2xl') radiusClass = '22px';

  // Toggle FAQ item in preview
  const toggleFaq = (secId, itemIdx) => {
    setOpenFaqIndexes(prev => ({
      ...prev,
      [`${secId}-${itemIdx}`]: !prev[`${secId}-${itemIdx}`]
    }));
  };

  // Viewport container width
  let viewportWidth = '100%';
  if (viewport === 'tablet') viewportWidth = '768px';
  if (viewport === 'mobile') viewportWidth = '375px';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-950/60">
      
      {/* Viewport Frame */}
      <div
        className="transition-all duration-300 shadow-2xl overflow-hidden relative border border-slate-800"
        style={{
          width: viewportWidth,
          maxWidth: '100%',
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: `'${fontBody}', sans-serif`,
          borderRadius: viewport === 'desktop' ? '12px' : '28px',
          minHeight: '85vh',
          height: 'fit-content'
        }}
      >
        {/* Device frame header indicator on mobile/tablet */}
        {viewport !== 'desktop' && (
          <div className="h-6 bg-slate-900 flex items-center justify-center gap-1.5 border-b border-slate-800">
            <div className="w-12 h-1 bg-slate-700 rounded-full" />
          </div>
        )}

        {/* Global style injections for fonts & CSS variables */}
        <style>{`
          .site-font-heading { font-family: '${fontHeading}', sans-serif; }
          .site-font-body { font-family: '${fontBody}', sans-serif; }
          .site-btn-primary {
            background-color: ${primaryColor};
            color: #ffffff;
            border-radius: ${radiusClass};
          }
          .site-btn-primary:hover {
            filter: brightness(1.1);
          }
          .site-btn-secondary {
            background-color: rgba(125,125,125,0.12);
            color: ${textColor};
            border-radius: ${radiusClass};
          }
          .site-badge {
            background-color: rgba(125,125,125,0.1);
            color: ${primaryColor};
            border: 1px solid rgba(125,125,125,0.15);
            border-radius: 9999px;
          }
          .site-card {
            background: rgba(125,125,125,0.05);
            border: 1px solid rgba(125,125,125,0.12);
            border-radius: ${radiusClass};
          }
        `}</style>

        {/* Sections list */}
        {sections.length === 0 ? (
          <div className="py-24 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-2">Your website is empty</h3>
            <p className="text-sm opacity-70 mb-6 max-w-sm mx-auto">
              Click below to insert your first section (Hero header, Features, Gallery, etc.).
            </p>
            <button
              type="button"
              onClick={() => onInsertSectionAt(0)}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              + Add First Section
            </button>
          </div>
        ) : (
          sections.map((section, index) => {
            const isSelected = selectedSectionId === section.id;
            return (
              <div key={section.id} className="relative group">
                
                {/* Editor Overlay & Toolbar (Hidden in pure Preview Mode) */}
                {!isPreviewMode && (
                  <div
                    className={`absolute inset-0 z-20 pointer-events-none transition border-2 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/5'
                        : 'border-transparent group-hover:border-indigo-400/50'
                    }`}
                  >
                    {/* Floating controls toolbar on top right */}
                    <div className="absolute top-2 right-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-slate-900/90 text-white p-1 rounded-lg shadow-lg border border-slate-700 z-30">
                      <span className="text-[10px] font-bold px-2 py-0.5 text-indigo-400 border-r border-slate-700">
                        {section.type}
                      </span>

                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMoveSection(index, -1); }}
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMoveSection(index, 1); }}
                        disabled={index === sections.length - 1}
                        className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDuplicateSection(section.id); }}
                        className="p-1 hover:bg-slate-800 rounded"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit contents */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onEditSection(section); }}
                        className="p-1 hover:bg-indigo-600 rounded bg-indigo-600/60"
                        title="Edit Content"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDeleteSection(section.id); }}
                        className="p-1 hover:bg-red-600/80 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Section Content Renderer */}
                <div
                  onClick={() => {
                    if (!isPreviewMode) onSelectSection(section.id);
                  }}
                  className="cursor-default"
                >
                  {renderSectionComponent(section, {
                    theme,
                    primaryColor,
                    accentColor,
                    textColor,
                    radiusClass,
                    isDark: isColorDark(bgColor),
                    pricingPeriodYearly,
                    setPricingPeriodYearly,
                    openFaqIndexes,
                    toggleFaq,
                    setLightboxImage,
                    onEditSection,
                    onPickImageForSection,
                    isPreviewMode,
                    viewport,
                    isMobile: viewport === 'mobile',
                    isTablet: viewport === 'tablet',
                    isDesktop: viewport === 'desktop'
                  })}
                </div>

                {/* Quick Add Section button between sections */}
                {!isPreviewMode && (
                  <div className="relative h-2 group/add flex items-center justify-center z-30">
                    <button
                      type="button"
                      onClick={() => onInsertSectionAt(index + 1)}
                      className="opacity-0 group-hover/add:opacity-100 transition absolute -top-3 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg text-[11px] font-bold flex items-center gap-1 transform scale-90 hover:scale-100"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Section</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* SiteCraft Branding Badge */}
        {site.settings?.showBranding !== false && (
          <div className="py-6 text-center text-xs opacity-50 border-t border-black/10">
            <span>✨ Powered by <strong>SiteCraft</strong></span>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Preview"
            className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}

    </div>
  );
}

// -------------------------------------------------------------
// Specialized In-Canvas Section Component Renderers
// -------------------------------------------------------------

function isColorDark(hex) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return false;
  const c = hex.substring(1);
  const rgb = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
  if (isNaN(rgb)) return false;
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}

function renderSectionComponent(section, ctx) {
  const { type, data } = section;
  const d = data || {};
  const isMobile = ctx.isMobile;
  const isTablet = ctx.isTablet;
  const isSiteDark = ctx.isDark;

  switch (type) {
    case 'navbar':
      return (
        <header
          className="sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-6 py-3.5 flex items-center justify-between transition-colors"
          style={{
            backgroundColor: isSiteDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
            borderColor: isSiteDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="site-font-heading font-bold text-lg sm:text-xl tracking-tight truncate max-w-[200px]">
            {d.logoText || 'Site'}
          </div>
          {isMobile ? (
            <div className="flex items-center gap-2">
              {d.ctaButton?.show !== false && d.ctaButton?.text && (
                <button type="button" className="site-btn-primary px-3 py-1.5 text-[11px] font-semibold shadow">
                  {d.ctaButton.text}
                </button>
              )}
              <div className="p-1.5 rounded-lg bg-black/5 flex items-center justify-center opacity-80">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-5 text-xs sm:text-sm font-medium opacity-80">
                {(d.links || []).map((l, i) => (
                  <span key={i} className="hover:opacity-100 cursor-pointer">{l.label}</span>
                ))}
              </div>
              {d.ctaButton?.show !== false && d.ctaButton?.text && (
                <button type="button" className="site-btn-primary px-4 py-2 text-xs font-semibold shadow">
                  {d.ctaButton.text}
                </button>
              )}
            </>
          )}
        </header>
      );

    case 'hero': {
      const layout = d.layout || 'split';

      if (layout === 'centered') {
        return (
          <section className={`px-4 sm:px-6 text-center max-w-4xl mx-auto flex flex-col items-center ${isMobile ? 'py-12' : 'py-20'}`}>
            {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-4 inline-block">{d.badge}</span>}
            <h1 className={`site-font-heading font-extrabold tracking-tight mb-4 leading-tight ${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>
              {d.title}
            </h1>
            <p className={`opacity-80 mb-6 max-w-2xl leading-relaxed ${isMobile ? 'text-xs' : 'text-base md:text-lg'}`}>
              {d.subtitle}
            </p>
            <div className={`flex gap-3 justify-center ${isMobile ? 'flex-col w-full' : 'flex-wrap'}`}>
              {d.primaryBtn?.text && (
                <button type="button" className={`site-btn-primary px-6 py-2.5 font-semibold text-xs sm:text-sm shadow-md ${isMobile ? 'w-full' : ''}`}>
                  {d.primaryBtn.text}
                </button>
              )}
              {d.secondaryBtn?.text && (
                <button type="button" className={`site-btn-secondary px-6 py-2.5 font-semibold text-xs sm:text-sm ${isMobile ? 'w-full' : ''}`}>
                  {d.secondaryBtn.text}
                </button>
              )}
            </div>
            {d.image && (
              <div className={`mt-8 w-full rounded-2xl overflow-hidden shadow-2xl border border-black/10 ${isMobile ? 'h-56' : 'h-80 md:h-[450px]'}`}>
                <img src={d.image} alt={d.title} className="w-full h-full object-cover" />
              </div>
            )}
          </section>
        );
      }

      if (layout === 'full-bg') {
        return (
          <section
            className={`relative px-4 sm:px-6 text-center text-white flex flex-col items-center justify-center bg-cover bg-center ${isMobile ? 'py-16' : 'py-28'}`}
            style={{ backgroundImage: `url('${d.image}')` }}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
            <div className="relative z-10 max-w-3xl mx-auto w-full">
              {d.badge && <span className="px-3 py-1 text-xs font-semibold mb-4 inline-block bg-white/20 rounded-full border border-white/30">{d.badge}</span>}
              <h1 className={`site-font-heading font-extrabold tracking-tight mb-4 leading-tight text-white ${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>
                {d.title}
              </h1>
              <p className={`text-slate-200 mb-6 max-w-2xl leading-relaxed ${isMobile ? 'text-xs' : 'text-base md:text-lg'}`}>
                {d.subtitle}
              </p>
              <div className={`flex gap-3 justify-center ${isMobile ? 'flex-col w-full' : 'flex-wrap'}`}>
                {d.primaryBtn?.text && (
                  <button type="button" className={`site-btn-primary px-6 py-2.5 font-semibold text-xs sm:text-sm shadow-md ${isMobile ? 'w-full' : ''}`}>
                    {d.primaryBtn.text}
                  </button>
                )}
                {d.secondaryBtn?.text && (
                  <button type="button" className={`px-6 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-xs sm:text-sm text-white ${isMobile ? 'w-full' : ''}`}>
                    {d.secondaryBtn.text}
                  </button>
                )}
              </div>
            </div>
          </section>
        );
      }

      // Default 'split'
      return (
        <section className={`px-4 sm:px-6 max-w-6xl mx-auto ${isMobile ? 'py-10 flex flex-col gap-6' : 'py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center'}`}>
          <div>
            {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
            <h1 className={`site-font-heading font-extrabold tracking-tight mb-3 leading-tight ${isMobile ? 'text-2xl' : 'text-3xl md:text-5xl'}`}>
              {d.title}
            </h1>
            <p className={`opacity-80 mb-6 leading-relaxed ${isMobile ? 'text-xs' : 'text-base'}`}>
              {d.subtitle}
            </p>
            <div className={`flex gap-3 ${isMobile ? 'flex-col w-full' : 'flex-wrap'}`}>
              {d.primaryBtn?.text && (
                <button type="button" className={`site-btn-primary px-6 py-2.5 font-semibold text-xs sm:text-sm shadow-md ${isMobile ? 'w-full' : ''}`}>
                  {d.primaryBtn.text}
                </button>
              )}
              {d.secondaryBtn?.text && (
                <button type="button" className={`site-btn-secondary px-6 py-2.5 font-semibold text-xs sm:text-sm ${isMobile ? 'w-full' : ''}`}>
                  {d.secondaryBtn.text}
                </button>
              )}
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/10">
            <img src={d.image} alt={d.title} className={`w-full object-cover ${isMobile ? 'h-52' : 'h-72 md:h-96'}`} />
            {d.statsBadge?.count && (
              <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg">
                <div className="text-lg font-extrabold text-amber-400 leading-none">{d.statsBadge.count}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{d.statsBadge.label}</div>
              </div>
            )}
          </div>
        </section>
      );
    }

    case 'features': {
      const items = d.items || [];
      const cols = isMobile ? 'grid-cols-1' : (isTablet ? 'grid-cols-2' : (d.layout === '4-cols' ? 'grid-cols-4' : (d.layout === '2-cols' ? 'grid-cols-2' : 'grid-cols-3')));
      return (
        <section className={`px-4 sm:px-6 max-w-6xl mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
            <h2 className={`site-font-heading font-extrabold tracking-tight mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title}</h2>
            {d.subtitle && <p className="text-xs sm:text-sm opacity-80">{d.subtitle}</p>}
          </div>
          <div className={`grid ${cols} gap-4 sm:gap-6`}>
            {items.map((item, idx) => (
              <div key={idx} className="site-card p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center mb-3 text-indigo-500 font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base mb-1.5">{item.title}</h3>
                  <p className="text-xs opacity-80 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'about': {
      const isLeft = d.layout === 'image-left';
      return (
        <section className={`px-4 sm:px-6 max-w-6xl mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          <div className={isMobile ? 'flex flex-col gap-6' : 'grid grid-cols-2 gap-10 items-center'}>
            {isLeft && (
              <div className="rounded-2xl overflow-hidden shadow-xl border border-black/10">
                <img src={d.image} alt={d.title} className={`w-full object-cover ${isMobile ? 'h-56' : 'h-80'}`} />
              </div>
            )}
            <div>
              {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
              <h2 className={`site-font-heading font-extrabold tracking-tight mb-3 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title}</h2>
              <p className="text-xs sm:text-sm opacity-80 mb-5 leading-relaxed">{d.text}</p>
              <div className="space-y-2">
                {(d.bulletPoints || []).map((bp, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span className="opacity-90">{bp}</span>
                  </div>
                ))}
              </div>
            </div>
            {!isLeft && (
              <div className="rounded-2xl overflow-hidden shadow-xl border border-black/10">
                <img src={d.image} alt={d.title} className={`w-full object-cover ${isMobile ? 'h-56' : 'h-80'}`} />
              </div>
            )}
          </div>
        </section>
      );
    }

    case 'gallery': {
      const items = d.items || [];
      const cols = isMobile ? 'grid-cols-1' : (isTablet ? 'grid-cols-2' : 'grid-cols-3');
      return (
        <section className={`px-4 sm:px-6 max-w-6xl mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
            <h2 className={`site-font-heading font-extrabold tracking-tight mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title}</h2>
            {d.subtitle && <p className="text-xs sm:text-sm opacity-80">{d.subtitle}</p>}
          </div>
          <div className={`grid ${cols} gap-4 sm:gap-6`}>
            {items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => ctx.setLightboxImage(item.image)}
                className="site-card overflow-hidden cursor-pointer group"
              >
                <div className={`overflow-hidden ${isMobile ? 'h-48' : 'h-52'}`}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="p-3.5 sm:p-4">
                  {item.category && <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{item.category}</span>}
                  <h4 className="font-semibold text-xs sm:text-sm mt-0.5">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'menu': {
      return (
        <section className={`px-4 sm:px-6 max-w-5xl mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
            <h2 className={`site-font-heading font-extrabold tracking-tight mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title}</h2>
            {d.subtitle && <p className="text-xs sm:text-sm opacity-80">{d.subtitle}</p>}
          </div>
          <div className="space-y-8 sm:space-y-12">
            {(d.categories || []).map((cat, i) => (
              <div key={i}>
                <h3 className="site-font-heading text-lg sm:text-xl font-bold mb-4 sm:mb-6 pb-1.5 border-b-2 border-indigo-500 inline-block">
                  {cat.name}
                </h3>
                <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {(cat.items || []).map((item, j) => (
                    <div key={j} className="site-card p-3.5 sm:p-4 flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-xs sm:text-sm">{item.name}</h4>
                          {item.tag && <span className="site-badge text-[9px] px-1.5 py-0.5">{item.tag}</span>}
                        </div>
                        <p className="text-[11px] sm:text-xs opacity-70 mt-1">{item.description}</p>
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-indigo-600 whitespace-nowrap">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'pricing': {
      const plans = d.plans || [];
      const isYearly = ctx.pricingPeriodYearly;
      const cols = isMobile ? 'grid-cols-1 max-w-sm mx-auto' : (isTablet ? 'grid-cols-2' : 'grid-cols-3');
      return (
        <section className={`px-4 sm:px-6 max-w-6xl mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
            <h2 className={`site-font-heading font-extrabold tracking-tight mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title}</h2>
            {d.subtitle && <p className="text-xs sm:text-sm opacity-80">{d.subtitle}</p>}

            {d.hasPeriodToggle !== false && (
              <div className="inline-flex items-center bg-black/5 p-1 rounded-full mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => ctx.setPricingPeriodYearly(false)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition ${!isYearly ? 'bg-white shadow text-slate-900' : 'opacity-70'}`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => ctx.setPricingPeriodYearly(true)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${isYearly ? 'bg-white shadow text-slate-900' : 'opacity-70'}`}
                >
                  <span>Yearly</span>
                  <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{d.yearlyDiscountText || '-20%'}</span>
                </button>
              </div>
            )}
          </div>

          <div className={`grid ${cols} gap-5 sm:gap-6`}>
            {plans.map((p, i) => (
              <div key={i} className={`site-card p-5 sm:p-6 flex flex-col justify-between ${p.popular ? 'ring-2 ring-indigo-500 shadow-xl' : ''}`}>
                <div>
                  {p.popular && <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase mb-2 inline-block">Popular</span>}
                  <h3 className="font-bold text-lg sm:text-xl mb-1">{p.name}</h3>
                  <p className="text-xs opacity-75 min-h-[28px]">{p.description}</p>
                  <div className="my-4 sm:my-6">
                    <span className="site-font-heading text-3xl sm:text-4xl font-extrabold">
                      {isYearly ? (p.priceYearly || p.priceMonthly) : p.priceMonthly}
                    </span>
                    <span className="text-xs opacity-70"> / month</span>
                  </div>
                  <button type="button" className={`w-full py-2.5 text-xs font-semibold mb-5 ${p.popular ? 'site-btn-primary' : 'site-btn-secondary'}`}>
                    {p.buttonText || 'Choose Plan'}
                  </button>
                  <div className="space-y-2 border-t border-black/10 pt-3.5">
                    {(p.features || []).map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs opacity-90">
                        <span className="text-indigo-500 font-bold">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'testimonials': {
      const items = d.items || [];
      const cols = isMobile ? 'grid-cols-1' : (isTablet ? 'grid-cols-2' : 'grid-cols-3');
      return (
        <section className={`px-4 sm:px-6 max-w-6xl mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
            <h2 className={`site-font-heading font-extrabold tracking-tight mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title || 'Customer Reviews'}</h2>
            {d.subtitle && <p className="text-xs sm:text-sm opacity-80">{d.subtitle}</p>}
          </div>
          <div className={`grid ${cols} gap-4 sm:gap-6`}>
            {items.map((item, idx) => (
              <div key={idx} className="site-card p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="text-amber-500 text-base mb-3.5 tracking-wide">
                    {'★'.repeat(item.rating || 5)}
                  </div>
                  <p className="text-xs sm:text-sm italic opacity-90 leading-relaxed mb-5">
                    « {item.quote} »
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {item.avatar && (
                    <img src={item.avatar} alt={item.author || ''} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">{item.author}</h4>
                    <p className="text-[11px] opacity-70">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'faq': {
      const items = d.items || [];
      return (
        <section className={`px-4 sm:px-6 max-w-3xl mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
            <h2 className={`site-font-heading font-extrabold tracking-tight mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title}</h2>
            {d.subtitle && <p className="text-xs sm:text-sm opacity-80">{d.subtitle}</p>}
          </div>
          <div className="space-y-3">
            {items.map((item, idx) => {
              const isOpen = ctx.openFaqIndexes[`${section.id}-${idx}`];
              return (
                <div key={idx} className="site-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => ctx.toggleFaq(section.id, idx)}
                    className="w-full p-3.5 sm:p-4 text-left font-semibold text-xs sm:text-sm flex items-center justify-between gap-4"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={`w-4 h-4 transition transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 text-xs opacity-80 leading-relaxed border-t border-black/5 pt-2.5 sm:pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case 'countdown': {
      return (
        <section className={`px-4 sm:px-6 text-center max-w-3xl mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
          <h2 className={`site-font-heading font-extrabold mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title}</h2>
          {d.subtitle && <p className="text-xs sm:text-sm opacity-80 mb-6">{d.subtitle}</p>}

          <div className={`grid gap-2.5 sm:gap-3 mx-auto mb-6 ${isMobile ? 'grid-cols-2 max-w-xs' : 'grid-cols-4 max-w-md'}`}>
            {[
              { num: "36", label: "Days" },
              { num: "14", label: "Hours" },
              { num: "28", label: "Minutes" },
              { num: "45", label: "Seconds" }
            ].map((box, i) => (
              <div key={i} className="site-card p-3 sm:p-4 text-center">
                <div className={`site-font-heading font-extrabold text-indigo-500 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{box.num}</div>
                <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider opacity-60 mt-0.5">{box.label}</div>
              </div>
            ))}
          </div>

          {d.note && <p className="text-xs opacity-75 mb-5">{d.note}</p>}
          {d.ctaButton?.text && (
            <button type="button" className="site-btn-primary px-6 py-2.5 font-semibold text-xs shadow-md">
              {d.ctaButton.text}
            </button>
          )}
        </section>
      );
    }

    case 'stats': {
      return (
        <section className={`px-4 sm:px-6 max-w-5xl mx-auto border-y border-black/10 ${isMobile ? 'py-10' : 'py-16'}`}>
          {d.title && <h3 className="text-center text-xs sm:text-sm font-semibold opacity-70 mb-6 sm:mb-8">{d.title}</h3>}
          <div className={`grid gap-4 sm:gap-8 text-center ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {(d.items || []).map((it, i) => (
              <div key={i}>
                <div className={`site-font-heading font-extrabold text-indigo-500 mb-0.5 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>{it.number}</div>
                <div className="text-xs opacity-75">{it.label}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'contact': {
      return (
        <section className={`px-4 sm:px-6 max-w-5xl mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
            <h2 className={`site-font-heading font-extrabold tracking-tight mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title}</h2>
            {d.subtitle && <p className="text-xs sm:text-sm opacity-80">{d.subtitle}</p>}
          </div>

          <div className={`grid gap-6 sm:gap-8 items-start ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="site-card p-5 sm:p-6 space-y-3.5">
              <h3 className="font-bold text-base sm:text-lg mb-1">Contact Information</h3>
              {d.address && (
                <div className="flex items-start gap-2.5 text-xs">
                  <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="opacity-80 mt-0.5">{d.address}</div>
                  </div>
                </div>
              )}
              {d.phone && (
                <div className="flex items-start gap-2.5 text-xs">
                  <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="opacity-80 mt-0.5">{d.phone}</div>
                  </div>
                </div>
              )}
              {d.email && (
                <div className="flex items-start gap-2.5 text-xs">
                  <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="opacity-80 mt-0.5">{d.email}</div>
                  </div>
                </div>
              )}
              {d.openingHours && (
                <div className="flex items-start gap-2.5 text-xs">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Hours</div>
                    <div className="opacity-80 mt-0.5">{d.openingHours}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="site-card p-5 sm:p-6">
              <form onSubmit={(e) => { e.preventDefault(); alert('In the live published site, this form will submit directly to your local inbox!'); }} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Full Name *</label>
                  <input type="text" placeholder="Your name" className="w-full p-2.5 rounded-lg border border-black/15 bg-black/5 outline-none" required />
                </div>
                <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  <div>
                    <label className="font-semibold block mb-1">Email *</label>
                    <input type="email" placeholder="you@example.com" className="w-full p-2.5 rounded-lg border border-black/15 bg-black/5 outline-none" required />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Phone</label>
                    <input type="tel" placeholder="+1 (555) 000-0000" className="w-full p-2.5 rounded-lg border border-black/15 bg-black/5 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Message *</label>
                  <textarea rows={3} placeholder="Your inquiry or message..." className="w-full p-2.5 rounded-lg border border-black/15 bg-black/5 outline-none" required />
                </div>
                <button type="submit" className="site-btn-primary w-full py-2.5 font-bold shadow text-xs">
                  {d.submitButtonText || 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      );
    }

    case 'newsletter': {
      return (
        <section className={`px-4 sm:px-6 text-center max-w-xl mx-auto ${isMobile ? 'py-12' : 'py-16'}`}>
          {d.badge && <span className="site-badge px-3 py-1 text-xs font-semibold mb-3 inline-block">{d.badge}</span>}
          <h2 className={`site-font-heading font-extrabold mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>{d.title}</h2>
          <p className="text-xs opacity-80 mb-5">{d.subtitle}</p>
          <div className={`gap-2 max-w-md mx-auto ${isMobile ? 'flex flex-col' : 'flex'}`}>
            <input type="email" placeholder={d.placeholder || 'Your email'} className="flex-1 p-2.5 rounded-xl border border-black/15 bg-black/5 text-xs outline-none" />
            <button type="button" className={`site-btn-primary px-5 py-2.5 text-xs font-semibold whitespace-nowrap shadow ${isMobile ? 'w-full' : ''}`}>
              {d.buttonText || "Subscribe"}
            </button>
          </div>
          {d.disclaimer && <p className="text-[10px] opacity-60 mt-3">{d.disclaimer}</p>}
        </section>
      );
    }

    case 'ctaBanner': {
      return (
        <section className={`px-4 sm:px-6 text-center text-white ${isMobile ? 'py-12' : 'py-16'}`} style={{ backgroundColor: ctx.primaryColor }}>
          <h2 className={`site-font-heading font-extrabold mb-2.5 text-white ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{d.title}</h2>
          <p className="text-xs sm:text-sm opacity-90 mb-6 max-w-xl mx-auto">{d.subtitle}</p>
          <div className="flex gap-3 justify-center">
            {d.buttonText && (
              <button type="button" className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-lg">
                {d.buttonText}
              </button>
            )}
          </div>
        </section>
      );
    }

    case 'footer': {
      return (
        <footer className="py-10 px-4 sm:px-6 border-t border-black/10 text-xs">
          <div className={`max-w-6xl mx-auto flex gap-6 ${isMobile ? 'flex-col text-center items-center' : 'flex-col sm:flex-row justify-between items-center'}`}>
            <div>
              <div className="site-font-heading font-bold text-base mb-1">{d.logoText || 'Site'}</div>
              <p className="opacity-70 max-w-xs">{d.description}</p>
            </div>
            <div className="flex gap-4 opacity-80 font-medium flex-wrap justify-center">
              {(d.socialLinks || []).map((s, i) => (
                <span key={i} className="hover:opacity-100 cursor-pointer">{s.platform}</span>
              ))}
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-6 pt-5 border-t border-black/5 text-center opacity-60 text-[11px]">
            {d.copyright || 'All rights reserved.'}
          </div>
        </footer>
      );
    }

    default:
      return (
        <div className="p-8 border border-dashed border-slate-300 text-center text-xs opacity-60">
          Section type: {type}
        </div>
      );
  }
}
