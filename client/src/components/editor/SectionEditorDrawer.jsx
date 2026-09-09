import React, { useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, ChevronDown, ChevronUp, Save, Check } from 'lucide-react';
import ImagePickerModal from './ImagePickerModal';

export default function SectionEditorDrawer({ isOpen, onClose, section, onUpdateSection }) {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState(null); // callback or path

  if (!isOpen || !section) return null;

  const data = section.data || {};

  const updateData = (fields) => {
    onUpdateSection({
      ...section,
      data: {
        ...data,
        ...fields
      }
    });
  };

  const handlePickImage = (targetSetter) => {
    setImagePickerTarget(() => targetSetter);
    setImagePickerOpen(true);
  };

  const handleImageSelected = (url) => {
    if (imagePickerTarget) {
      imagePickerTarget(url);
    }
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-fade-in">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Bloc : {section.type}
            </span>
            <h3 className="text-sm font-bold text-white">Personnaliser le contenu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-5 text-xs">
          
          {/* Section: NAVBAR */}
          {section.type === 'navbar' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nom / Logo affiché</label>
                <input
                  type="text"
                  value={data.logoText || ''}
                  onChange={(e) => updateData({ logoText: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Liens du menu</label>
                  <button
                    type="button"
                    onClick={() => updateData({ links: [...(data.links || []), { label: 'Nouveau lien', href: '#section' }] })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Ajouter un lien
                  </button>
                </div>
                <div className="space-y-2">
                  {(data.links || []).map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const newLinks = [...data.links];
                          newLinks[idx].label = e.target.value;
                          updateData({ links: newLinks });
                        }}
                        placeholder="Titre"
                        className="input-field flex-1 text-xs py-1"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => {
                          const newLinks = [...data.links];
                          newLinks[idx].href = e.target.value;
                          updateData({ links: newLinks });
                        }}
                        placeholder="#ancre"
                        className="input-field w-24 text-xs py-1 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newLinks = data.links.filter((_, i) => i !== idx);
                          updateData({ links: newLinks });
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="font-semibold text-slate-300 mb-1.5 block">Bouton d'action principal</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.ctaButton?.text || ''}
                    onChange={(e) => updateData({ ctaButton: { ...data.ctaButton, text: e.target.value } })}
                    placeholder="Texte du bouton"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={data.ctaButton?.href || '#contact'}
                    onChange={(e) => updateData({ ctaButton: { ...data.ctaButton, href: e.target.value } })}
                    placeholder="#contact"
                    className="input-field font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* Section: HERO */}
          {section.type === 'hero' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Disposition (Layout)</label>
                <select
                  value={data.layout || 'split'}
                  onChange={(e) => updateData({ layout: e.target.value })}
                  className="input-field"
                >
                  <option value="split">Split (Texte à gauche, image à droite)</option>
                  <option value="centered">Centré (Grand titre avec image en dessous)</option>
                  <option value="full-bg">Plein écran avec image en fond sombre</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Badge d'accroche (optionnel)</label>
                <input
                  type="text"
                  value={data.badge || ''}
                  onChange={(e) => updateData({ badge: e.target.value })}
                  placeholder="Ex: ✨ Nouveauté 2026"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre principal *</label>
                <textarea
                  rows={2}
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Sous-titre explicatif</label>
                <textarea
                  rows={3}
                  value={data.subtitle || ''}
                  onChange={(e) => updateData({ subtitle: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Image control */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Image Hero</label>
                {data.image && (
                  <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-700 mb-2">
                    <img src={data.image} alt="Hero" className="w-full h-full object-cover" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handlePickImage((url) => updateData({ image: url }))}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Changer l'image</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <label className="font-semibold text-slate-300 block">Bouton Principal</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.primaryBtn?.text || ''}
                    onChange={(e) => updateData({ primaryBtn: { ...data.primaryBtn, text: e.target.value } })}
                    placeholder="Texte bouton"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={data.primaryBtn?.href || '#'}
                    onChange={(e) => updateData({ primaryBtn: { ...data.primaryBtn, href: e.target.value } })}
                    placeholder="Lien / Ancre"
                    className="input-field font-mono"
                  />
                </div>

                <label className="font-semibold text-slate-300 block">Bouton Secondaire</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.secondaryBtn?.text || ''}
                    onChange={(e) => updateData({ secondaryBtn: { ...data.secondaryBtn, text: e.target.value } })}
                    placeholder="Texte bouton"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={data.secondaryBtn?.href || '#'}
                    onChange={(e) => updateData({ secondaryBtn: { ...data.secondaryBtn, href: e.target.value } })}
                    placeholder="Lien / Ancre"
                    className="input-field font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* Section: FEATURES */}
          {section.type === 'features' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.badge || ''}
                  onChange={(e) => updateData({ badge: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de la section</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Sous-titre</label>
                <textarea
                  rows={2}
                  value={data.subtitle || ''}
                  onChange={(e) => updateData({ subtitle: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Liste des cartes ({data.items?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      items: [...(data.items || []), { icon: 'Sparkles', title: 'Nouvel atout', description: 'Description du bénéfice...' }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Ajouter
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-400 text-[11px]">Carte #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = data.items.filter((_, i) => i !== idx);
                            updateData({ items: newItems });
                          }}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].title = e.target.value;
                          updateData({ items: newItems });
                        }}
                        placeholder="Titre de la carte"
                        className="input-field font-semibold"
                      />
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].description = e.target.value;
                          updateData({ items: newItems });
                        }}
                        placeholder="Description..."
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section: ABOUT */}
          {section.type === 'about' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Position de l'image</label>
                <select
                  value={data.layout || 'image-right'}
                  onChange={(e) => updateData({ layout: e.target.value })}
                  className="input-field"
                >
                  <option value="image-right">Image à droite</option>
                  <option value="image-left">Image à gauche</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.badge || ''}
                  onChange={(e) => updateData({ badge: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Texte de présentation</label>
                <textarea
                  rows={4}
                  value={data.text || ''}
                  onChange={(e) => updateData({ text: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Image</label>
                {data.image && (
                  <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-700 mb-2">
                    <img src={data.image} alt="About" className="w-full h-full object-cover" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handlePickImage((url) => updateData({ image: url }))}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Changer l'image</span>
                </button>
              </div>

              {/* Bullet points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Points clés</label>
                  <button
                    type="button"
                    onClick={() => updateData({ bulletPoints: [...(data.bulletPoints || []), 'Nouveau point clé'] })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Ajouter
                  </button>
                </div>
                <div className="space-y-2">
                  {(data.bulletPoints || []).map((bp, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => {
                          const newBps = [...data.bulletPoints];
                          newBps[idx] = e.target.value;
                          updateData({ bulletPoints: newBps });
                        }}
                        className="input-field flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newBps = data.bulletPoints.filter((_, i) => i !== idx);
                          updateData({ bulletPoints: newBps });
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section: GALLERY */}
          {section.type === 'gallery' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de la galerie</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Photos ({data.items?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      items: [...(data.items || []), {
                        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
                        title: "Nouvelle photo",
                        category: "Général"
                      }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Ajouter une photo
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex gap-3 items-center">
                      <div
                        onClick={() => handlePickImage((url) => {
                          const newItems = [...data.items];
                          newItems[idx].image = url;
                          updateData({ items: newItems });
                        })}
                        className="w-16 h-12 rounded-lg overflow-hidden border border-slate-700 cursor-pointer flex-shrink-0 relative group"
                        title="Changer cette image"
                      >
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                          <ImageIcon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...data.items];
                            newItems[idx].title = e.target.value;
                            updateData({ items: newItems });
                          }}
                          placeholder="Légende"
                          className="input-field py-1"
                        />
                        <input
                          type="text"
                          value={item.category || ''}
                          onChange={(e) => {
                            const newItems = [...data.items];
                            newItems[idx].category = e.target.value;
                            updateData({ items: newItems });
                          }}
                          placeholder="Catégorie"
                          className="input-field py-0.5 text-[11px]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newItems = data.items.filter((_, i) => i !== idx);
                          updateData({ items: newItems });
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section: MENU / CATALOG */}
          {section.type === 'menu' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de la carte</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Catégories de menu</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      categories: [...(data.categories || []), {
                        name: "Nouvelle Catégorie",
                        items: [{ name: "Article", description: "Détails de l'article", price: "10,00 €" }]
                      }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Ajouter catégorie
                  </button>
                </div>

                <div className="space-y-4">
                  {(data.categories || []).map((cat, catIdx) => (
                    <div key={catIdx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => {
                            const newCats = [...data.categories];
                            newCats[catIdx].name = e.target.value;
                            updateData({ categories: newCats });
                          }}
                          className="input-field font-bold text-indigo-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newCats = data.categories.filter((_, i) => i !== catIdx);
                            updateData({ categories: newCats });
                          }}
                          className="text-slate-500 hover:text-red-400 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Items in category */}
                      <div className="space-y-2 pl-2 border-l border-slate-800">
                        {(cat.items || []).map((item, itIdx) => (
                          <div key={itIdx} className="flex gap-2 items-center bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newCats = [...data.categories];
                                newCats[catIdx].items[itIdx].name = e.target.value;
                                updateData({ categories: newCats });
                              }}
                              placeholder="Nom"
                              className="input-field py-1 flex-1"
                            />
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) => {
                                const newCats = [...data.categories];
                                newCats[catIdx].items[itIdx].price = e.target.value;
                                updateData({ categories: newCats });
                              }}
                              placeholder="Prix"
                              className="input-field py-1 w-20 text-center font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newCats = [...data.categories];
                                newCats[catIdx].items = newCats[catIdx].items.filter((_, i) => i !== itIdx);
                                updateData({ categories: newCats });
                              }}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newCats = [...data.categories];
                            newCats[catIdx].items.push({ name: "Nouveau plat", description: "", price: "5,00 €" });
                            updateData({ categories: newCats });
                          }}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-1"
                        >
                          <Plus className="w-3 h-3" /> Ajouter un plat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section: PRICING */}
          {section.type === 'pricing' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de la section tarifs</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-300">Activer bascule Mensuel / Annuel</span>
                <input
                  type="checkbox"
                  checked={data.hasPeriodToggle !== false}
                  onChange={(e) => updateData({ hasPeriodToggle: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-2 block">Plans tarifaires</label>
                <div className="space-y-3">
                  {(data.plans || []).map((plan, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) => {
                            const newPlans = [...data.plans];
                            newPlans[idx].name = e.target.value;
                            updateData({ plans: newPlans });
                          }}
                          className="input-field font-bold text-slate-100 flex-1 mr-2"
                        />
                        <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={plan.popular}
                            onChange={(e) => {
                              const newPlans = [...data.plans];
                              newPlans[idx].popular = e.target.checked;
                              updateData({ plans: newPlans });
                            }}
                          />
                          <span>Populaire</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400">Prix Mensuel</label>
                          <input
                            type="text"
                            value={plan.priceMonthly}
                            onChange={(e) => {
                              const newPlans = [...data.plans];
                              newPlans[idx].priceMonthly = e.target.value;
                              updateData({ plans: newPlans });
                            }}
                            className="input-field py-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400">Prix Annuel</label>
                          <input
                            type="text"
                            value={plan.priceYearly || plan.priceMonthly}
                            onChange={(e) => {
                              const newPlans = [...data.plans];
                              newPlans[idx].priceYearly = e.target.value;
                              updateData({ plans: newPlans });
                            }}
                            className="input-field py-1"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        value={plan.description || ''}
                        onChange={(e) => {
                          const newPlans = [...data.plans];
                          newPlans[idx].description = e.target.value;
                          updateData({ plans: newPlans });
                        }}
                        placeholder="Description..."
                        className="input-field text-xs py-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section: FAQ */}
          {section.type === 'faq' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de la FAQ</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Questions ({data.items?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      items: [...(data.items || []), { question: 'Nouvelle question ?', answer: 'Réponse détaillée...' }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Ajouter question
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-400 text-[11px]">Q#{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = data.items.filter((_, i) => i !== idx);
                            updateData({ items: newItems });
                          }}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].question = e.target.value;
                          updateData({ items: newItems });
                        }}
                        placeholder="Question ?"
                        className="input-field font-semibold"
                      />
                      <textarea
                        rows={3}
                        value={item.answer}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].answer = e.target.value;
                          updateData({ items: newItems });
                        }}
                        placeholder="Réponse..."
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section: COUNTDOWN */}
          {section.type === 'countdown' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Date & Heure Cible (ISO)</label>
                <input
                  type="datetime-local"
                  value={(data.targetDate || '').substring(0, 16)}
                  onChange={(e) => updateData({ targetDate: new Date(e.target.value).toISOString() })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Texte / Note sous le compteur</label>
                <input
                  type="text"
                  value={data.note || ''}
                  onChange={(e) => updateData({ note: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Texte du bouton</label>
                <input
                  type="text"
                  value={data.ctaButton?.text || ''}
                  onChange={(e) => updateData({ ctaButton: { ...data.ctaButton, text: e.target.value } })}
                  className="input-field"
                />
              </div>
            </>
          )}

          {/* Section: CONTACT */}
          {section.type === 'contact' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de contact</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Adresse postale</label>
                <input
                  type="text"
                  value={data.address || ''}
                  onChange={(e) => updateData({ address: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={data.phone || ''}
                    onChange={(e) => updateData({ phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={data.email || ''}
                    onChange={(e) => updateData({ email: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Horaires d'ouverture</label>
                <input
                  type="text"
                  value={data.openingHours || ''}
                  onChange={(e) => updateData({ openingHours: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Texte du bouton d'envoi</label>
                <input
                  type="text"
                  value={data.submitButtonText || 'Envoyer mon message'}
                  onChange={(e) => updateData({ submitButtonText: e.target.value })}
                  className="input-field"
                />
              </div>
            </>
          )}

          {/* Section: TESTIMONIALS */}
          {section.type === 'testimonials' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Titre de la section avis</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Avis ({data.items?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      items: [...(data.items || []), {
                        author: "Nouveau client",
                        role: "Client",
                        rating: 5,
                        quote: "Service remarquable, je recommande vivement !"
                      }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Ajouter un avis
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={item.author}
                          onChange={(e) => {
                            const newItems = [...data.items];
                            newItems[idx].author = e.target.value;
                            updateData({ items: newItems });
                          }}
                          placeholder="Nom de l'auteur"
                          className="input-field font-semibold flex-1 mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = data.items.filter((_, i) => i !== idx);
                            updateData({ items: newItems });
                          }}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.role || ''}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].role = e.target.value;
                          updateData({ items: newItems });
                        }}
                        placeholder="Rôle / Titre..."
                        className="input-field text-xs py-1"
                      />

                      <textarea
                        rows={2}
                        value={item.quote}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].quote = e.target.value;
                          updateData({ items: newItems });
                        }}
                        placeholder="Citation de l'avis..."
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section: FOOTER */}
          {section.type === 'footer' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nom / Logo dans le pied de page</label>
                <input
                  type="text"
                  value={data.logoText || ''}
                  onChange={(e) => updateData({ logoText: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description courte</label>
                <textarea
                  rows={2}
                  value={data.description || ''}
                  onChange={(e) => updateData({ description: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mention de copyright</label>
                <input
                  type="text"
                  value={data.copyright || ''}
                  onChange={(e) => updateData({ copyright: e.target.value })}
                  className="input-field font-mono text-[11px]"
                />
              </div>
            </>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Terminer la modification</span>
          </button>
        </div>
      </div>

      {/* Image Picker Modal instance */}
      <ImagePickerModal
        isOpen={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelectImage={handleImageSelected}
      />
    </>
  );
}
