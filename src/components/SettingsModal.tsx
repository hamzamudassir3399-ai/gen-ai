import React, { useState } from 'react';
import { SettingsState } from '../types';
import { Settings, X, Check, RefreshCw, Key, Server, Monitor, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onUpdateSettings: (newSettings: SettingsState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState<SettingsState>(settings);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });

  if (!isOpen) return null;

  const handleTestConnection = async (type: 'muapi' | 'local' | 'gemini') => {
    setTestStatus({ loading: true });
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          url: formData.localServerUrl,
          apiKey: formData.muapiKey,
        }),
      });
      const data = await res.json();
      setTestStatus({ loading: false, success: data.success, message: data.message });
    } catch (err: any) {
      setTestStatus({ loading: false, success: false, message: err.message || 'Connection failed' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <span>Studio Settings & Local Models</span>
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Muapi Hosted API Key */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Muapi Hosted API Key</span>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="muapi_live_..."
                value={formData.muapiKey}
                onChange={(e) => setFormData({ ...formData, muapiKey: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleTestConnection('muapi')}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 rounded-xl text-xs font-medium transition-colors"
              >
                Test Key
              </button>
            </div>
          </div>

          {/* Local Model Server Setup (Automatic1111 / ComfyUI) */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>Local Model Server (Desktop App Mode)</span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.useLocalModels}
                  onChange={(e) => setFormData({ ...formData, useLocalModels: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {formData.useLocalModels && (
              <div className="space-y-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Server Type</label>
                    <select
                      value={formData.localModelType}
                      onChange={(e: any) => setFormData({ ...formData, localModelType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option value="automatic1111">Automatic1111 WebUI</option>
                      <option value="comfyui">ComfyUI Server</option>
                      <option value="ollama">Ollama Local LLM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Local API URL</label>
                    <input
                      type="text"
                      value={formData.localServerUrl}
                      onChange={(e) => setFormData({ ...formData, localServerUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => handleTestConnection('local')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testStatus.loading ? 'animate-spin' : ''}`} />
                    <span>Test Local Connection</span>
                  </button>
                  <span className="text-[10px] text-slate-400">Requires CORS enabled on local server</span>
                </div>
              </div>
            )}
          </div>

          {/* Test Status Feedback */}
          {testStatus.message && (
            <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              testStatus.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}>
              {testStatus.success ? <Check className="w-4 h-4 shrink-0" /> : <ShieldCheck className="w-4 h-4 shrink-0" />}
              <span>{testStatus.message}</span>
            </div>
          )}

          {/* Desktop App Instructions */}
          <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
              <Monitor className="w-4 h-4" />
              <span>Running AuraStudio as a Desktop App</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AuraStudio is fully open-source and can be packaged as a native desktop application via Tauri or Electron. Run <code className="text-indigo-300 font-mono">npm run build</code> to compile static assets and server bundles.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
