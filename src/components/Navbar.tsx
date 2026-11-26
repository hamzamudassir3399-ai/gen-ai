import React from 'react';
import { StudioTab } from '../types';
import { Sparkles, Image, Video, Mic, Film, Grid, Settings, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: StudioTab;
  setActiveTab: (tab: StudioTab) => void;
  openSettings: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openSettings, historyCount }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('image')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          AuraStudio
        </span>
        <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          v2.5 Open Source
        </span>
      </div>

      {/* Zone 2: 4-5 concise single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 text-sm font-medium">
        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'image'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Image Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'video'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('lipsync')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'lipsync'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Lip Sync</span>
        </button>

        <button
          onClick={() => setActiveTab('cinema')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'cinema'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Director Mode</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 relative ${
            activeTab === 'gallery'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Gallery</span>
          {historyCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] flex items-center justify-center font-bold">
              {historyCount}
            </span>
          )}
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={openSettings}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-all whitespace-nowrap shrink-0 shadow-sm"
          title="Studio Settings & Local Models"
        >
          <Settings className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Settings & Models</span>
        </button>
      </div>
    </header>
  );
};
