import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check, Loader2 } from 'lucide-react';
import { CURATED_IMAGES } from '../../data/curatedImages';

export default function ImagePickerModal({ isOpen, onClose, onSelectImage, currentImage = '' }) {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'upload' | 'url'
  const [selectedCategory, setSelectedCategory] = useState(CURATED_IMAGES[0]?.category || '');
  const [customUrl, setCustomUrl] = useState(currentImage || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  if (!isOpen) return null;

  const currentCategoryImages = CURATED_IMAGES.find(c => c.category === selectedCategory)?.images || [];

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Erreur lors du téléchargement du fichier.');
      }

      const data = await res.json();
      onSelectImage(data.url);
      onClose();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelectImage(customUrl.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl h-[78vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Choisir une image</h3>
              <p className="text-xs text-slate-400">Sélectionnez une photo gratuite, téléversez un fichier ou collez une URL.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/20">
          <button
            onClick={() => setActiveTab('library')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'library'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Bibliothèque photos gratuites</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'upload'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Téléverser depuis l'ordinateur</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'url'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Adresse URL externe</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* TAB 1: Library */}
          {activeTab === 'library' && (
            <div className="flex flex-col gap-4">
              {/* Categories pills */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {CURATED_IMAGES.map(cat => (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      selectedCategory === cat.category
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {currentCategoryImages.map((img, i) => {
                  const isSelected = currentImage === img.url;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        onSelectImage(img.url);
                        onClose();
                      }}
                      className="group relative rounded-xl overflow-hidden aspect-video border border-slate-700/60 cursor-pointer shadow-md transition transform hover:scale-[1.02] hover:border-indigo-500"
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover transition duration-300 group-hover:brightness-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-2.5 flex items-end">
                        <span className="text-[11px] font-medium text-white truncate">{img.title}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Upload */}
          {activeTab === 'upload' && (
            <div className="h-full flex flex-col items-center justify-center">
              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition w-full max-w-md bg-slate-950/40 hover:bg-slate-800/30">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    <span className="text-sm font-semibold text-slate-300">Téléversement en cours...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-200">Cliquez pour choisir un fichier image</span>
                    <span className="text-xs text-slate-400 mt-1">JPG, PNG, WebP, GIF jusqu'à 10 Mo</span>
                    <span className="mt-4 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition">
                      Parcourir les fichiers
                    </span>
                  </div>
                )}
              </label>

              {uploadError && (
                <p className="text-xs text-red-400 mt-3 font-medium">{uploadError}</p>
              )}
            </div>
          )}

          {/* TAB 3: Custom URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleCustomUrlSubmit} className="max-w-md mx-auto pt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Lien de l'image (URL directe)
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {customUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-700 aspect-video max-h-48 bg-slate-950">
                  <img
                    src={customUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow"
                >
                  Appliquer cette image
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
