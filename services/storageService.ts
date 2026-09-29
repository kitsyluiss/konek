import { SavedKonek, SiteData, BlockType, BlockData, UserProfile } from '../types';
import { AVATAR_PLACEHOLDER } from '../constants';

const STORAGE_KEY = 'konek_koneks';
const ACTIVE_BENTO_KEY = 'konek_active_konek';
const ASSETS_KEY = 'konek_assets';
const INITIALIZED_KEY = 'konek_initialized';
export const GRID_VERSION = 2;

// Asset type for uploaded images
export interface Asset {
  id: string;
  name: string;
  type: string; // 'image/png', 'image/jpeg', etc.
  data: string; // base64 data URL
  createdAt: number;
}

// Konek JSON format (for export/import)
export interface KonekJSON {
  id: string;
  name: string;
  version: string;
  profile: UserProfile;
  blocks: BlockData[];
  gridVersion?: number;
  exportedAt?: number;
}

// Generate unique ID
const generateId = (): string => {
  return `konek_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============ BENTO STORAGE ============

// Get all saved koneks
export const getAllKoneks = (): SavedKonek[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to get koneks from localStorage:', e);
    return [];
  }
};

// Get a specific konek by ID
export const getKonek = (id: string): SavedKonek | null => {
  const koneks = getAllKoneks();
  return koneks.find((b) => b.id === id) || null;
};

// Save a konek (create or update)
export const saveKonek = (konek: SavedKonek): void => {
  try {
    const koneks = getAllKoneks();
    const existingIndex = koneks.findIndex((b) => b.id === konek.id);

    const updatedKonek = {
      ...konek,
      updatedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      koneks[existingIndex] = updatedKonek;
    } else {
      koneks.push(updatedKonek);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(koneks));
  } catch (e) {
    console.error('Failed to save konek to localStorage:', e);
  }
};

// Create a new konek from JSON template
export const createKonekFromJSON = async (
  templatePath: string = '/koneks/default.json'
): Promise<SavedKonek> => {
  try {
    const response = await fetch(templatePath);
    if (!response.ok) throw new Error('Failed to load template');

    const template: KonekJSON = await response.json();
    const now = Date.now();

    const newKonek: SavedKonek = {
      id: generateId(),
      name: template.name || 'My Konek',
      createdAt: now,
      updatedAt: now,
      data: {
        gridVersion: template.gridVersion ?? GRID_VERSION,
        profile: {
          ...template.profile,
          avatarUrl: template.profile.avatarUrl || AVATAR_PLACEHOLDER,
        },
        blocks: template.blocks.map((b) => ({
          ...b,
          id: generateId(), // Generate new IDs to avoid conflicts
        })),
      },
    };

    saveKonek(newKonek);
    setActiveKonekId(newKonek.id);

    return newKonek;
  } catch (e) {
    console.error('Failed to create konek from JSON:', e);
    // Fallback to default
    return createKonek('My Konek');
  }
};

// Create a new konek with default data
export const createKonek = (name: string): SavedKonek => {
  const now = Date.now();
  const newKonek: SavedKonek = {
    id: generateId(),
    name: name || `Konek ${getAllKoneks().length + 1}`,
    createdAt: now,
    updatedAt: now,
    data: {
      gridVersion: GRID_VERSION,
      profile: {
        name: name || 'My Konek',
        bio: 'Digital creator & developer.\nBuilding awesome things.',
        avatarUrl: AVATAR_PLACEHOLDER,
        theme: 'light' as const,
        primaryColor: 'blue',
        showBranding: true,
        analytics: { enabled: false, supabaseUrl: '' },
        socialAccounts: [],
      },
      blocks: [
        {
          id: generateId(),
          type: BlockType.LINK,
          title: 'My Website',
          subtext: 'Visit my site',
          content: 'https://example.com',
          colSpan: 3,
          rowSpan: 3,
          gridColumn: 1,
          gridRow: 1,
          color: 'bg-gray-900',
          textColor: 'text-white',
        },
      ],
    },
  };

  saveKonek(newKonek);
  setActiveKonekId(newKonek.id);

  return newKonek;
};

// Delete a konek
export const deleteKonek = (id: string): void => {
  try {
    const koneks = getAllKoneks().filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(koneks));

    if (getActiveKonekId() === id) {
      localStorage.removeItem(ACTIVE_BENTO_KEY);
    }
  } catch (e) {
    console.error('Failed to delete konek from localStorage:', e);
  }
};

// Get the currently active konek ID
export const getActiveKonekId = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_BENTO_KEY);
  } catch {
    return null;
  }
};

// Set the active konek ID
export const setActiveKonekId = (id: string): void => {
  try {
    localStorage.setItem(ACTIVE_BENTO_KEY, id);
  } catch (e) {
    console.error('Failed to set active konek ID:', e);
  }
};

// Check if app has been initialized before
export const isInitialized = (): boolean => {
  try {
    return localStorage.getItem(INITIALIZED_KEY) === 'true';
  } catch {
    return false;
  }
};

// Mark app as initialized
export const setInitialized = (): void => {
  try {
    localStorage.setItem(INITIALIZED_KEY, 'true');
  } catch {
    // ignore
  }
};

// Get the active konek, or create from template if none exists
export const getOrCreateActiveKonek = (): SavedKonek => {
  const activeId = getActiveKonekId();

  if (activeId) {
    const konek = getKonek(activeId);
    if (konek) return konek;
  }

  // Check if there are any koneks
  const koneks = getAllKoneks();
  if (koneks.length > 0) {
    setActiveKonekId(koneks[0].id);
    return koneks[0];
  }

  // Create a new default konek (sync version for backward compatibility)
  return createKonek('My First Konek');
};

// Initialize app - call this on first load to load from template
export const initializeApp = async (): Promise<SavedKonek> => {
  const activeId = getActiveKonekId();

  if (activeId) {
    const konek = getKonek(activeId);
    if (konek) return konek;
  }

  const koneks = getAllKoneks();
  if (koneks.length > 0) {
    setActiveKonekId(koneks[0].id);
    return koneks[0];
  }

  // First time: load from default template
  return createKonekFromJSON('/koneks/default.json');
};

// Update just the data of a konek (for auto-save)
export const updateKonekData = (id: string, data: SiteData): void => {
  const konek = getKonek(id);
  if (konek) {
    saveKonek({
      ...konek,
      data,
      updatedAt: Date.now(),
    });
  }
};

// Rename a konek
export const renameKonek = (id: string, newName: string): void => {
  const konek = getKonek(id);
  if (konek) {
    saveKonek({
      ...konek,
      name: newName,
      updatedAt: Date.now(),
    });
  }
};

// ============ EXPORT / IMPORT ============

// Export a konek to JSON
export const exportKonekToJSON = (konek: SavedKonek): KonekJSON => {
  return {
    id: konek.id,
    name: konek.name,
    version: '1.0',
    profile: konek.data.profile,
    blocks: konek.data.blocks,
    gridVersion: konek.data.gridVersion ?? GRID_VERSION,
    exportedAt: Date.now(),
  };
};

// Download a konek as JSON file
export const downloadKonekJSON = (konek: SavedKonek): void => {
  const json = exportKonekToJSON(konek);
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${konek.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Import a konek from JSON
export const importKonekFromJSON = (json: KonekJSON): SavedKonek => {
  const now = Date.now();

  const newKonek: SavedKonek = {
    id: generateId(), // Always generate new ID to avoid conflicts
    name: json.name || 'Imported Konek',
    createdAt: now,
    updatedAt: now,
    data: {
      gridVersion: json.gridVersion ?? GRID_VERSION,
      profile: {
        // Spread all profile fields so nothing is lost on import/preview
        ...(json.profile || {}),
        // Ensure required fields have fallbacks
        name: json.profile?.name || 'My Konek',
        bio: json.profile?.bio || '',
        avatarUrl: json.profile?.avatarUrl || AVATAR_PLACEHOLDER,
        theme: json.profile?.theme || 'light',
        primaryColor: json.profile?.primaryColor || 'blue',
        showBranding: json.profile?.showBranding ?? true,
        analytics: json.profile?.analytics || { enabled: false, supabaseUrl: '' },
        socialAccounts: json.profile?.socialAccounts || [],
      },
      blocks: (json.blocks || []).map((b) => ({
        ...b,
        id: generateId(), // Generate new IDs
      })),
    },
  };

  saveKonek(newKonek);
  setActiveKonekId(newKonek.id);

  return newKonek;
};

// Load konek from file input
export const loadKonekFromFile = (file: File): Promise<SavedKonek> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as KonekJSON;
        const konek = importKonekFromJSON(json);
        resolve(konek);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// ============ ASSETS STORAGE ============

// Get all assets
export const getAssets = (): Asset[] => {
  try {
    const stored = localStorage.getItem(ASSETS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

// Save assets
export const saveAssets = (assets: Asset[]): void => {
  try {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  } catch (e) {
    console.error('Failed to save assets:', e);
  }
};

// Add an asset (image uploaded by user)
export const addAsset = (name: string, type: string, data: string): Asset => {
  const asset: Asset = {
    id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    data,
    createdAt: Date.now(),
  };

  const assets = getAssets();
  assets.push(asset);
  saveAssets(assets);

  return asset;
};

// Remove an asset
export const removeAsset = (id: string): void => {
  const assets = getAssets().filter((a) => a.id !== id);
  saveAssets(assets);
};

// Export assets to JSON
export const exportAssetsJSON = (): { version: string; lastUpdated: number; assets: Asset[] } => {
  return {
    version: '1.0',
    lastUpdated: Date.now(),
    assets: getAssets(),
  };
};

// Download assets as JSON
export const downloadAssetsJSON = (): void => {
  const json = exportAssetsJSON();
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'assets.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Clear all data (reset)
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_BENTO_KEY);
    localStorage.removeItem(ASSETS_KEY);
    localStorage.removeItem(INITIALIZED_KEY);
  } catch {
    // ignore
  }
};
