import React, { useState } from 'react';
import { GeneratedItem, SettingsState } from '../types';
import { Video, Sparkles, Upload, Download, RefreshCw, Film, Play, Sliders } from 'lucide-react';

interface VideoStudioProps {
  onAddItem: (item: GeneratedItem) => void;
  settings: SettingsState;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({ onAddItem, settings }) => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gemini-omni-1.2-flash');
  const [duration, setDuration] = useState('5s');
  const [motionStrength, setMotionStrength] = useState(6.0);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedItem | null>(null);

  const videoModels = [
    { id: 'gemini-omni-1.2-flash', name: 'Gemini Omni Video 1.2 Flash (Cloud)', provider: 'gemini' },
    { id: 'runway-gen3-muapi', name: 'Runway Gen-3 Alpha (Muapi Hosted)', provider: 'muapi' },
    { id: 'luma-dream-machine', name: 'Luma Dream Machine (Local/Custom API)', provider: 'local' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, duration, motionStrength, aspectRatio, referenceImage }),
      });
      const data = await res.json();
      if (data.success) {
        const newItem: GeneratedItem = {
          id: 'vid_' + Date.now(),
          type: 'video',
          title: prompt.slice(0, 36) + (prompt.length > 36 ? '...' : ''),
          prompt,
          model,
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          createdAt: Date.now(),
          parameters: { duration, motionStrength, aspectRatio },
          isFavorite: false,
          tags: ['AI Video', duration],
        };
        setCurrentResult(newItem);
        onAddItem(newItem);
      }
    } catch (err) {
      console.error('Video generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Control Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-400" />
              <span>Video Generation Studio</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
              Cinematic AI
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Video Generation Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {videoModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Motion Prompt & Scene Description
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Drone shot gliding smoothly over a neon-lit futuristic Tokyo alleyway at night, soft rain reflecting holographic billboards..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            {/* Reference Image for Image-to-Video */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Starting Frame / Reference Image (Image-to-Video)
              </label>
              {referenceImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-800">
                  <img src={referenceImage} alt="Reference" className="w-full h-28 object-cover" />
                  <button
                    type="button"
                    onClick={() => setReferenceImage(null)}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-lg hover:bg-rose-600 transition-colors text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-colors bg-slate-950">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-400 font-medium">Upload initial frame for motion</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Duration & Motion Strength */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="5s">5 Seconds</option>
                  <option value="10s">10 Seconds</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Motion Strength ({motionStrength})
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={motionStrength}
                  onChange={(e) => setMotionStrength(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 mt-3"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Rendering Video Sequence...</span>
                </>
              ) : (
                <>
                  <Film className="w-5 h-5" />
                  <span>Generate Video</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Video Player Preview Panel */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cinematic Video Player
            </span>
            {currentResult && (
              <a
                href={currentResult.url}
                target="_blank"
                rel="noreferrer"
                download="aurastudio-video.mp4"
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-500 transition-colors shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP4</span>
              </a>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden relative">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
                  <Video className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Rendering Spatio-Temporal Video</h3>
                  <p className="text-xs text-slate-400 mt-1">Generating frames at 24fps with consistent optical flow...</p>
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
                  <Play className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300">No video generated yet</h3>
                <p className="text-xs text-slate-500">
                  Describe a motion sequence, choose duration and motion strength, and render your cinematic clip.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
