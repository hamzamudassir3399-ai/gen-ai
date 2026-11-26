import React, { useState } from 'react';
import { GeneratedItem, SettingsState, Shot } from '../types';
import { Film, Plus, Trash2, Play, Sparkles, Download, Clapperboard, Video } from 'lucide-react';

interface CinemaStudioProps {
  onAddItem: (item: GeneratedItem) => void;
  settings: SettingsState;
}

export const CinemaStudio: React.FC<CinemaStudioProps> = ({ onAddItem }) => {
  const [projectTitle, setProjectTitle] = useState('Sci-Fi Cyberpunk Trailer Sequence');
  const [shots, setShots] = useState<Shot[]>([
    {
      id: 'shot_1',
      title: 'Establishing Shot',
      prompt: 'Wide angle panoramic view of a futuristic neon metropolis at dusk, flying vehicles streaking through glowing cloud layers.',
      duration: 5,
      cameraMove: 'pan-left',
      angle: 'drone',
    },
    {
      id: 'shot_2',
      title: 'Character Introduction',
      prompt: 'Medium close-up of a cybernetically enhanced investigator looking out rain-streaked penthouse window, cinematic lighting.',
      duration: 4,
      cameraMove: 'zoom-in',
      angle: 'medium',
    },
  ]);
  const [isPlayingReel, setIsPlayingReel] = useState(false);
  const [activeShotIndex, setActiveShotIndex] = useState(0);

  const addShot = () => {
    const newShot: Shot = {
      id: 'shot_' + Date.now(),
      title: `Shot ${shots.length + 1}`,
      prompt: 'Cinematic scene description...',
      duration: 5,
      cameraMove: 'static',
      angle: 'medium',
    };
    setShots([...shots, newShot]);
  };

  const removeShot = (id: string) => {
    setShots(shots.filter(s => s.id !== id));
  };

  const updateShot = (id: string, field: keyof Shot, value: any) => {
    setShots(shots.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleExportStoryboard = () => {
    const storyboardData = {
      projectTitle,
      totalDuration: shots.reduce((acc, s) => acc + s.duration, 0),
      shots,
    };
    const blob = new Blob([JSON.stringify(storyboardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/\s+/g, '-')}-storyboard.json`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clapperboard className="w-5 h-5 text-indigo-400" />
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="bg-transparent text-lg font-bold text-white focus:outline-none focus:border-b border-indigo-500 w-full md:w-96"
            />
          </div>
          <p className="text-xs text-slate-400">
            Multi-shot cinematic director workflow. Sequence shots, camera movements, and timing for cohesive AI video production.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlayingReel(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Play Storyboard Reel</span>
          </button>
          <button
            onClick={handleExportStoryboard}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Export Script / JSON</span>
          </button>
        </div>
      </div>

      {/* Shots List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Shot Sequences ({shots.length})
          </h3>
          <button
            onClick={addShot}
            className="px-3.5 py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shot</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shots.map((shot, index) => (
            <div
              key={shot.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-mono flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={shot.title}
                    onChange={(e) => updateShot(shot.id, 'title', e.target.value)}
                    className="bg-transparent text-sm font-bold text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => removeShot(shot.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Delete Shot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Shot Prompt
                </label>
                <textarea
                  rows={3}
                  value={shot.prompt}
                  onChange={(e) => updateShot(shot.id, 'prompt', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <select
                    value={shot.duration}
                    onChange={(e) => updateShot(shot.id, 'duration', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value={3}>3 Seconds</option>
                    <option value={5}>5 Seconds</option>
                    <option value={10}>10 Seconds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Camera Move
                  </label>
                  <select
                    value={shot.cameraMove}
                    onChange={(e) => updateShot(shot.id, 'cameraMove', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="pan-left">Pan Left</option>
                    <option value="pan-right">Pan Right</option>
                    <option value="zoom-in">Zoom In</option>
                    <option value="orbit">Orbit</option>
                    <option value="dolly">Dolly</option>
                    <option value="static">Static</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Angle
                  </label>
                  <select
                    value={shot.angle}
                    onChange={(e) => updateShot(shot.id, 'angle', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="wide">Wide</option>
                    <option value="medium">Medium</option>
                    <option value="close-up">Close-up</option>
                    <option value="drone">Drone</option>
                    <option value="macro">Macro</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storyboard Reel Modal Simulator */}
      {isPlayingReel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Storyboard Preview Reel</h3>
                <p className="text-xs text-slate-400">Playing {shots.length} sequenced shots ({shots.reduce((a, s) => a + s.duration, 0)}s total)</p>
              </div>
              <button
                onClick={() => setIsPlayingReel(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-rose-600 text-white rounded-lg text-xs transition-colors"
              >
                Close Reel
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl h-96 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-600/30 border border-indigo-500/40 rounded-full text-xs font-mono text-indigo-300">
                Shot {activeShotIndex + 1} of {shots.length}: {shots[activeShotIndex]?.title}
              </div>
              
              <div className="max-w-lg space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                  <Video className="w-8 h-8 animate-pulse" />
                </div>
                <h4 className="text-sm font-semibold text-white">{shots[activeShotIndex]?.prompt}</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Camera: {shots[activeShotIndex]?.cameraMove} | Angle: {shots[activeShotIndex]?.angle} | Duration: {shots[activeShotIndex]?.duration}s
                </p>
              </div>

              <div className="absolute bottom-4 inset-x-6 flex items-center justify-between">
                <button
                  onClick={() => setActiveShotIndex(prev => (prev > 0 ? prev - 1 : shots.length - 1))}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Previous Shot
                </button>
                <button
                  onClick={() => setActiveShotIndex(prev => (prev < shots.length - 1 ? prev + 1 : 0))}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs"
                >
                  Next Shot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
