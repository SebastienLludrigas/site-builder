import React, { useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, ChevronDown, ChevronUp, Save, Check } from 'lucide-react';
import ImagePickerModal from './ImagePickerModal';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export default function SectionEditorDrawer({ isOpen, onClose, section, onUpdateSection }) {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState(null); // callback or path

  // Only listen for Escape here while the nested image picker isn't the one on top.
  useEscapeKey(isOpen && !imagePickerOpen, onClose);

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
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-40 w-full sm:max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-fade-in">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Block: {section.type}
            </span>
            <h3 className="text-sm font-bold text-white">Customize Section Content</h3>
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
                <label className="block font-semibold text-slate-300 mb-1">Brand / Logo Displayed</label>
                <input
                  type="text"
                  value={data.logoText || ''}
                  onChange={(e) => updateData({ logoText: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Navigation Links</label>
                  <button
                    type="button"
                    onClick={() => updateData({ links: [...(data.links || []), { label: 'New Link', href: '#section' }] })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add link
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
                        placeholder="Label"
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
                        placeholder="#anchor"
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
                <label className="font-semibold text-slate-300 mb-1.5 block">Main Action Button</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.ctaButton?.text || ''}
                    onChange={(e) => updateData({ ctaButton: { ...data.ctaButton, text: e.target.value } })}
                    placeholder="Button text"
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
                <label className="block font-semibold text-slate-300 mb-1">Layout Style</label>
                <select
                  value={data.layout || 'split'}
                  onChange={(e) => updateData({ layout: e.target.value })}
                  className="input-field"
                >
                  <option value="split">Split (Text left, media right)</option>
                  <option value="centered">Centered (Hero title with media below)</option>
                  <option value="full-bg">Full-width background with dark overlay</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Eyebrow Badge (optional)</label>
                <input
                  type="text"
                  value={data.badge || ''}
                  onChange={(e) => updateData({ badge: e.target.value })}
                  placeholder="e.g. ✨ New 2026 Release"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Primary Heading *</label>
                <textarea
                  rows={2}
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Supporting Subtitle</label>
                <textarea
                  rows={3}
                  value={data.subtitle || ''}
                  onChange={(e) => updateData({ subtitle: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Image control */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Hero Media Image</label>
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
                  <span>Change Image</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <label className="font-semibold text-slate-300 block">Primary CTA Button</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.primaryBtn?.text || ''}
                    onChange={(e) => updateData({ primaryBtn: { ...data.primaryBtn, text: e.target.value } })}
                    placeholder="Button text"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={data.primaryBtn?.href || '#'}
                    onChange={(e) => updateData({ primaryBtn: { ...data.primaryBtn, href: e.target.value } })}
                    placeholder="URL / #anchor"
                    className="input-field font-mono"
                  />
                </div>

                <label className="font-semibold text-slate-300 block">Secondary CTA Button</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.secondaryBtn?.text || ''}
                    onChange={(e) => updateData({ secondaryBtn: { ...data.secondaryBtn, text: e.target.value } })}
                    placeholder="Button text"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={data.secondaryBtn?.href || '#'}
                    onChange={(e) => updateData({ secondaryBtn: { ...data.secondaryBtn, href: e.target.value } })}
                    placeholder="URL / #anchor"
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
                <label className="block font-semibold text-slate-300 mb-1">Section Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={data.subtitle || ''}
                  onChange={(e) => updateData({ subtitle: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Feature Cards ({data.items?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      items: [...(data.items || []), { icon: 'Sparkles', title: 'New Feature', description: 'Feature highlight details...' }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Card
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-400 text-[11px]">Card #{idx + 1}</span>
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
                        placeholder="Card title"
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
                        placeholder="Description text..."
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
                <label className="block font-semibold text-slate-300 mb-1">Media Position</label>
                <select
                  value={data.layout || 'image-right'}
                  onChange={(e) => updateData({ layout: e.target.value })}
                  className="input-field"
                >
                  <option value="image-right">Image on Right</option>
                  <option value="image-left">Image on Left</option>
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
                <label className="block font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Body Narrative / Story</label>
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
                  <span>Change Image</span>
                </button>
              </div>

              {/* Bullet points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Key Highlights</label>
                  <button
                    type="button"
                    onClick={() => updateData({ bulletPoints: [...(data.bulletPoints || []), 'New key highlight'] })}
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
                <label className="block font-semibold text-slate-300 mb-1">Gallery Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Images ({data.items?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      items: [...(data.items || []), {
                        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
                        title: "New Showcase Photo",
                        category: "General"
                      }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Image
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
                        title="Change this image"
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
                          placeholder="Title / Caption"
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
                          placeholder="Category"
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
                <label className="block font-semibold text-slate-300 mb-1">Menu / Catalog Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Catalog Categories</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      categories: [...(data.categories || []), {
                        name: "New Category",
                        items: [{ name: "Specialty Item", description: "Item description and ingredients", price: "$10.00" }]
                      }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Category
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
                              placeholder="Item Name"
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
                              placeholder="Price"
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
                            newCats[catIdx].items.push({ name: "New Item", description: "", price: "$5.00" });
                            updateData({ categories: newCats });
                          }}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-1"
                        >
                          <Plus className="w-3 h-3" /> Add Item
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
                <label className="block font-semibold text-slate-300 mb-1">Pricing Section Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-300">Enable Monthly / Yearly Toggle</span>
                <input
                  type="checkbox"
                  checked={data.hasPeriodToggle !== false}
                  onChange={(e) => updateData({ hasPeriodToggle: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 mb-2 block">Pricing Tier Cards</label>
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
                          <span>Popular</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400">Monthly Price</label>
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
                          <label className="text-[10px] text-slate-400">Yearly Price</label>
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
                        placeholder="Description text..."
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
                <label className="block font-semibold text-slate-300 mb-1">FAQ Section Title</label>
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
                      items: [...(data.items || []), { question: 'New Question?', answer: 'Detailed answer goes here...' }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Question
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
                        placeholder="Question prompt?"
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
                        placeholder="Answer details..."
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
                <label className="block font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Date & Time (ISO)</label>
                <input
                  type="datetime-local"
                  value={(data.targetDate || '').substring(0, 16)}
                  onChange={(e) => updateData({ targetDate: new Date(e.target.value).toISOString() })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notice / Note Under Ticker</label>
                <input
                  type="text"
                  value={data.note || ''}
                  onChange={(e) => updateData({ note: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Button Label</label>
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
                <label className="block font-semibold text-slate-300 mb-1">Contact Section Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={data.address || ''}
                  onChange={(e) => updateData({ address: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={data.phone || ''}
                    onChange={(e) => updateData({ phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={data.email || ''}
                    onChange={(e) => updateData({ email: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={data.openingHours || ''}
                  onChange={(e) => updateData({ openingHours: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Form Submit Button Text</label>
                <input
                  type="text"
                  value={data.submitButtonText || 'Send Message'}
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
                <label className="block font-semibold text-slate-300 mb-1">Testimonials Section Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Reviews ({data.items?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      items: [...(data.items || []), {
                        author: "New Client",
                        role: "Verified Customer",
                        rating: 5,
                        quote: "Outstanding service and exceptional quality. Highly recommended!"
                      }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Review
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
                          placeholder="Author Name"
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
                        placeholder="Role / Company..."
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
                        placeholder="Review quote..."
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section: STATS */}
          {section.type === 'stats' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Section Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-300">Stats ({data.items?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => updateData({
                      items: [...(data.items || []), { number: '100%', label: 'New Metric' }]
                    })}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Stat
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center gap-2">
                      <input
                        type="text"
                        value={item.number}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].number = e.target.value;
                          updateData({ items: newItems });
                        }}
                        placeholder="98%"
                        className="input-field font-semibold w-20"
                      />
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx].label = e.target.value;
                          updateData({ items: newItems });
                        }}
                        placeholder="Metric label"
                        className="input-field flex-1"
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
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section: NEWSLETTER */}
          {section.type === 'newsletter' && (
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
                <label className="block font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={data.subtitle || ''}
                  onChange={(e) => updateData({ subtitle: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Field Placeholder</label>
                <input
                  type="text"
                  value={data.placeholder || ''}
                  onChange={(e) => updateData({ placeholder: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subscribe Button Label</label>
                <input
                  type="text"
                  value={data.buttonText || ''}
                  onChange={(e) => updateData({ buttonText: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Privacy Disclaimer</label>
                <input
                  type="text"
                  value={data.disclaimer || ''}
                  onChange={(e) => updateData({ disclaimer: e.target.value })}
                  className="input-field"
                />
              </div>
            </>
          )}

          {/* Section: CTA BANNER */}
          {section.type === 'ctaBanner' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateData({ title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={data.subtitle || ''}
                  onChange={(e) => updateData({ subtitle: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Primary Button Label</label>
                  <input
                    type="text"
                    value={data.buttonText || ''}
                    onChange={(e) => updateData({ buttonText: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={data.buttonHref || ''}
                    onChange={(e) => updateData({ buttonHref: e.target.value })}
                    placeholder="#contact"
                    className="input-field font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Secondary Button Label</label>
                  <input
                    type="text"
                    value={data.secondaryButtonText || ''}
                    onChange={(e) => updateData({ secondaryButtonText: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Secondary Button Link</label>
                  <input
                    type="text"
                    value={data.secondaryButtonHref || ''}
                    onChange={(e) => updateData({ secondaryButtonHref: e.target.value })}
                    placeholder="#features"
                    className="input-field font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* Section: FOOTER */}
          {section.type === 'footer' && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Footer Brand Name / Logo</label>
                <input
                  type="text"
                  value={data.logoText || ''}
                  onChange={(e) => updateData({ logoText: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Brief Summary</label>
                <textarea
                  rows={2}
                  value={data.description || ''}
                  onChange={(e) => updateData({ description: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Copyright Notice</label>
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
            <span>Done Editing</span>
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
