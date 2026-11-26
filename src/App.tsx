import React, { useState, useEffect } from 'react';
import { StudioTab, GeneratedItem, SettingsState } from './types';
import { Navbar } from './components/Navbar';
import { ImageStudio } from './components/ImageStudio';
import { VideoStudio } from './components/VideoStudio';
import { LipSyncStudio } from './components/LipSyncStudio';
import { CinemaStudio } from './components/CinemaStudio';
import { GalleryView } from './components/GalleryView';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<StudioTab>('image');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('aurastudio_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      muapiKey: '',
      useLocalModels: false,
      localServerUrl: 'http://127.0.0.1:7860',
      localModelType: 'automatic1111',
      defaultImageModel: 'gemini-nano-banana-2.1',
      defaultVideoModel: 'gemini-omni-1.2-flash',
      theme: 'dark',
      autoEnhancePrompts: true,
    };
  });

  const [items, setItems] = useState<GeneratedItem[]>(() => {
    const saved = localStorage.getItem('aurastudio_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'sample_1',
        type: 'image',
        title: 'Cyberpunk Explorer in Neon Rain',
        prompt: 'Cinematic portrait of a cyberpunk explorer in neon rain, volumetric lighting, 8k resolution, highly detailed',
        model: 'gemini-nano-banana-2.1',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        createdAt: Date.now() - 3600000,
        parameters: { aspectRatio: '16:9' },
        isFavorite: true,
        tags: ['AI Image', 'Cyberpunk'],
      },
      {
        id: 'sample_2',
        type: 'video',
        title: 'Tokyo Alleyway Cinematic Drone Shot',
        prompt: 'Drone shot gliding smoothly over a neon-lit futuristic Tokyo alleyway at night',
        model: 'gemini-omni-1.2-flash',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-vehicles-41529-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
        createdAt: Date.now() - 7200000,
        parameters: { duration: '5s' },
        isFavorite: false,
        tags: ['AI Video', '5s'],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('aurastudio_history', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('aurastudio_settings', JSON.stringify(settings));
  }, [settings]);

  const handleAddItem = (newItem: GeneratedItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleToggleFavorite = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSettings={() => setIsSettingsOpen(true)}
        historyCount={items.length}
      />

      <main className="flex-1">
        {activeTab === 'image' && <ImageStudio onAddItem={handleAddItem} settings={settings} />}
        {activeTab === 'video' && <VideoStudio onAddItem={handleAddItem} settings={settings} />}
        {activeTab === 'lipsync' && <LipSyncStudio onAddItem={handleAddItem} settings={settings} />}
        {activeTab === 'cinema' && <CinemaStudio onAddItem={handleAddItem} settings={settings} />}
        {activeTab === 'gallery' && (
          <GalleryView
            items={items}
            onToggleFavorite={handleToggleFavorite}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}
