import React, { useState } from 'react';
import { GeneratedItem, MediaType } from '../types';
import { Grid, Heart, Download, Trash2, Search, Image as ImageIcon, Video, Mic, Film } from 'lucide-react';

interface GalleryViewProps {
  items: GeneratedItem[];
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ items, onToggleFavorite, onDeleteItem }) => {
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);

  const filteredItems = items.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-400" />
            <span>Creative Gallery & History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Browse, favorite, export, and inspect metadata for all your generated media assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'image', 'video', 'lipsync'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of items */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Grid className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300">No media assets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Generate images, videos, or lip-syncs in the studio tabs to build your creative library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg group hover:border-indigo-500/50 transition-all flex flex-col justify-between"
            >
              <div
                className="relative h-60 bg-slate-950 cursor-pointer overflow-hidden"
                onClick={() => setSelectedItem(item)}
              >
                {item.type === 'video' || item.type === 'lipsync' ? (
                  <video src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                )}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                      item.isFavorite ? 'bg-rose-600 text-white' : 'bg-slate-950/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-white' : ''}`} />
                  </button>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md text-[10px] font-mono text-indigo-300 uppercase">
                  {item.type}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-200 font-medium line-clamp-2">{item.prompt}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Model: {item.model}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white capitalize">{selectedItem.type} Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl overflow-hidden max-h-[400px] flex items-center justify-center border border-slate-800">
              {selectedItem.type === 'video' || selectedItem.type === 'lipsync' ? (
                <video src={selectedItem.url} controls autoPlay loop className="max-h-[400px] w-full object-contain" />
              ) : (
                <img src={selectedItem.url} alt={selectedItem.prompt} className="max-h-[400px] w-full object-contain" referrerPolicy="no-referrer" />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Prompt</label>
                <p className="text-xs text-slate-200 mt-1 bg-slate-950 p-3 rounded-xl border border-slate-800">{selectedItem.prompt}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                <div><span className="text-slate-500">Model:</span> {selectedItem.model}</div>
                <div><span className="text-slate-500">Created:</span> {new Date(selectedItem.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
