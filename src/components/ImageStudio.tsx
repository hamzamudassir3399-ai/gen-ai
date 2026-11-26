import React, { useState } from 'react';
import { GeneratedItem, SettingsState } from '../types';
import { Sparkles, Wand2, Upload, Download, RefreshCw, Sliders, Image as ImageIcon, Check, Copy } from 'lucide-react';

interface ImageStudioProps {
  onAddItem: (item: GeneratedItem) => void;
  settings: SettingsState;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({ onAddItem, settings }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted anatomy, watermarks');
  const [model, setModel] = useState('gemini-nano-banana-2.1');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState(42);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedItem | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  const aspectRatios = [
    { label: '16:9 Cinematic', value: '16:9' },
    { label: '1:1 Square', value: '1:1' },
    { label: '4:3 Standard', value: '4:3' },
    { label: '9:16 Story/Mobile', value: '9:16' },
  ];

  const models = [
    { id: 'gemini-nano-banana-2.1', name: 'Gemini Nano Banana 2.1 (Cloud 4K)', provider: 'gemini' },
    { id: 'gemini-3.1-flash-lite-image', name: 'Gemini Flash Image Pro', provider: 'gemini' },
    { id: 'muapi-flux-schnell', name: 'Muapi Flux Schnell (Hosted API)', provider: 'muapi' },
    { id: 'sdxl-local-server', name: 'SDXL / Flux (Local Server URL)', provider: 'local' },
  ];

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: 'cinematic digital art' }),
      });
      const data = await res.json();
      if (data.enhanced) {
        setPrompt(data.enhanced);
      }
    } catch (err) {
      console.error('Enhancement error:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          model,
          aspectRatio,
          guidanceScale,
          seed,
          referenceImage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const newItem: GeneratedItem = {
          id: 'img_' + Date.now(),
          type: 'image',
          title: prompt.slice(0, 36) + (prompt.length > 36 ? '...' : ''),
          prompt,
          negativePrompt,
          model,
          url: data.url,
          createdAt: Date.now(),
          parameters: { aspectRatio, guidanceScale, seed },
          isFavorite: false,
          tags: ['AI Image', model.split('-')[0]],
        };
        setCurrentResult(newItem);
        onAddItem(newItem);
      }
    } catch (err) {
      console.error('Generation error:', err);
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
              <ImageIcon className="w-5 h-5 text-indigo-400" />
              <span>Image Generation Studio</span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {settings.useLocalModels ? 'Local Model Connected' : 'Cloud API Ready'}
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                AI Generation Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Prompt & Vision
                </label>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                  <span>{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Cinematic portrait of a cyberpunk explorer in neon rain, volumetric lighting, 8k resolution, highly detailed..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.value}
                    type="button"
                    onClick={() => setAspectRatio(ar.value)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-left ${
                      aspectRatio === ar.value
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reference Image Upload (Image-to-Image) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Reference Image (Optional Image-to-Image)
              </label>
              {referenceImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 group">
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
                  <span className="text-xs text-slate-400 font-medium">Click to upload reference image</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Advanced Settings Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 pt-4 border-t border-slate-800">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Negative Prompt</label>
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Guidance Scale ({guidanceScale})</label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={guidanceScale}
                        onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Seed</label>
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
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
                  <span>Synthesizing Masterpiece...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Canvas / Preview Panel */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Live Preview Canvas
            </span>
            {currentResult && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentResult.prompt);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Prompt' : 'Copy Prompt'}</span>
                </button>
                <a
                  href={currentResult.url}
                  target="_blank"
                  rel="noreferrer"
                  download="aurastudio-image.jpg"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-indigo-500 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </a>
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden relative group">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Synthesizing Neural Canvas</h3>
                  <p className="text-xs text-slate-400 mt-1">Applying diffusion weights and guiding lighting parameters...</p>
                </div>
              </div>
            ) : currentResult ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={currentResult.url}
                  alt={currentResult.prompt}
                  className="max-h-[600px] w-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-slate-200 font-medium line-clamp-2">{currentResult.prompt}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                    <span>Model: {currentResult.model}</span>
                    <span>·</span>
                    <span>Ratio: {currentResult.parameters.aspectRatio}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center p-8 max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300">Your canvas is ready</h3>
                <p className="text-xs text-slate-500">
                  Type a prompt on the left, choose your model parameters, and click Generate Image to create stunning AI visuals.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
