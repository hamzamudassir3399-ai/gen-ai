import React, { useState } from 'react';
import { GeneratedItem, SettingsState } from '../types';
import { Mic, Upload, Sparkles, RefreshCw, Download, User, Volume2, Play } from 'lucide-react';

interface LipSyncStudioProps {
  onAddItem: (item: GeneratedItem) => void;
  settings: SettingsState;
}

export const LipSyncStudio: React.FC<LipSyncStudioProps> = ({ onAddItem, settings }) => {
  const [portrait, setPortrait] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string>('');
  const [model, setModel] = useState('musetalk-v1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedItem | null>(null);

  const samplePortraits = [
    { name: 'Professional Woman', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { name: 'Executive Man', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Cyberpunk Avatar', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  ];

  const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPortrait(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAudioFile(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portrait) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-lipsync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portraitUrl: portrait, audioName: audioName || 'Voiceover.mp3', model }),
      });
      const data = await res.json();
      if (data.success) {
        const newItem: GeneratedItem = {
          id: 'sync_' + Date.now(),
          type: 'lipsync',
          title: `Talking Portrait (${audioName || 'Sample Audio'})`,
          prompt: `Lip-sync portrait with audio track`,
          model,
          url: data.url,
          thumbnailUrl: portrait,
          createdAt: Date.now(),
          parameters: {},
          isFavorite: false,
          tags: ['Lip Sync', 'Talking Head'],
        };
        setCurrentResult(newItem);
        onAddItem(newItem);
      }
    } catch (err) {
      console.error('Lip sync error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Control Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-indigo-400" />
              <span>Lip Sync & Talking Portrait</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
              Audio-Driven AI
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Lip Sync Engine
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="musetalk-v1">MuseTalk Real-Time Lip Sync</option>
                <option value="wav2lip-hq">Wav2Lip HD Studio</option>
                <option value="live-portrait-v2">LivePortrait Facial Animator</option>
              </select>
            </div>

            {/* Portrait Selection / Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Source Portrait
              </label>
              {portrait ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 h-36 flex items-center justify-center bg-slate-950">
                  <img src={portrait} alt="Portrait" className="h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPortrait(null)}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white px-2 py-1 rounded-lg hover:bg-rose-600 transition-colors text-xs"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-colors bg-slate-950">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-400 font-medium">Upload portrait photo</span>
                    <input type="file" accept="image/*" onChange={handlePortraitUpload} className="hidden" />
                  </label>
                  <div className="flex gap-2">
                    {samplePortraits.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPortrait(p.url)}
                        className="flex-1 text-left p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex items-center gap-2"
                      >
                        <img src={p.url} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-[10px] text-slate-300 font-medium truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Voiceover / Audio Track (.mp3, .wav)
              </label>
              <label className="flex items-center justify-between border border-slate-800 bg-slate-950 rounded-xl p-3 cursor-pointer hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center gap-2.5 truncate">
                  <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs text-slate-300 truncate">
                    {audioName || 'Choose voiceover audio file...'}
                  </span>
                </div>
                <span className="text-[10px] bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-medium shrink-0">
                  Browse
                </span>
                <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating || !portrait}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Lip Sync...</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Generate Talking Portrait</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Preview Panel */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Talking Portrait Player
            </span>
            {currentResult && (
              <a
                href={currentResult.url}
                target="_blank"
                rel="noreferrer"
                download="aurastudio-lipsync.mp4"
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-500 transition-colors shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Result</span>
              </a>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden relative">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
                  <Mic className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Animating Facial Landmarks</h3>
                  <p className="text-xs text-slate-400 mt-1">Syncing phonemes and expression weights with audio...</p>
                </div>
              </div>
            ) : currentResult ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video
                  src={currentResult.url}
                  controls
                  autoPlay
                  loop
                  className="max-h-[550px] w-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center p-8 max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300">Ready to synchronize portrait</h3>
                <p className="text-xs text-slate-500">
                  Select or upload a portrait image and audio voiceover to animate realistic mouth movements and expressions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
