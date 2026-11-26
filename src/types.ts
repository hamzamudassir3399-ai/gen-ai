export type StudioTab = 'image' | 'video' | 'lipsync' | 'cinema' | 'gallery' | 'settings';

export type MediaType = 'image' | 'video' | 'lipsync' | 'storyboard';

export interface GeneratedItem {
  id: string;
  type: MediaType;
  title: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: number;
  parameters: {
    aspectRatio?: string;
    resolution?: string;
    duration?: string;
    motionStrength?: number;
    guidanceScale?: number;
    seed?: number;
  };
  isFavorite: boolean;
  tags: string[];
}

export interface ModelOption {
  id: string;
  name: string;
  provider: 'gemini' | 'muapi' | 'local' | 'custom';
  type: MediaType;
  description: string;
  badge?: string;
}

export interface SettingsState {
  muapiKey: string;
  useLocalModels: boolean;
  localServerUrl: string; // e.g., http://127.0.0.1:7860 for Automatic1111 or ComfyUI
  localModelType: 'automatic1111' | 'comfyui' | 'ollama';
  defaultImageModel: string;
  defaultVideoModel: string;
  theme: 'dark' | 'light';
  autoEnhancePrompts: boolean;
}

export interface Shot {
  id: string;
  title: string;
  prompt: string;
  duration: number; // seconds
  cameraMove: 'pan-left' | 'pan-right' | 'zoom-in' | 'orbit' | 'static' | 'dolly';
  angle: 'wide' | 'medium' | 'close-up' | 'drone' | 'macro';
}
