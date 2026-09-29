import React, { useState, useRef, useEffect } from 'react';
import { SavedKonek } from '../types';
import { getAllKoneks, createKonek, deleteKonek } from '../services/storageService';
import { ChevronDown, Plus, FolderOpen, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileDropdownProps {
  activeKonekId: string;
  activeKonekName: string;
  onKonekChange: (konek: SavedKonek) => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  activeKonekId,
  activeKonekName,
  onKonekChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [koneks, setKoneks] = useState<SavedKonek[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load koneks when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setKoneks(getAllKoneks());
    }
  }, [isOpen]);

  // Focus input when creating
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setNewName('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateKonek = () => {
    if (newName.trim()) {
      const newKonek = createKonek(newName.trim());
      onKonekChange(newKonek);
      setIsCreating(false);
      setNewName('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateKonek();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewName('');
    }
  };

  const handleDeleteKonek = (e: React.MouseEvent, konekId: string) => {
    e.stopPropagation();

    const konekToDelete = koneks.find((b) => b.id === konekId);
    if (!konekToDelete) return;

    const confirmDelete = window.confirm(`Delete "${konekToDelete.name}"? This cannot be undone.`);
    if (!confirmDelete) return;

    deleteKonek(konekId);
    const updatedKoneks = getAllKoneks();
    setKoneks(updatedKoneks);

    // If we deleted the active konek, switch to another one
    if (konekId === activeKonekId && updatedKoneks.length > 0) {
      onKonekChange(updatedKoneks[0]);
    } else if (updatedKoneks.length === 0) {
      // If no koneks left, create a new one
      const newKonek = createKonek('My Konek');
      onKonekChange(newKonek);
      setIsOpen(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        aria-label="Open konek projects menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FolderOpen size={16} className="text-gray-500" />
        <span className="max-w-[120px] truncate">{activeKonekName}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="Konek projects menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                My Koneks
              </h3>
            </div>

            {/* Koneks List */}
            <div className="max-h-[240px] overflow-y-auto">
              {koneks.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">No koneks yet</div>
              ) : (
                koneks.map((konek) => (
                  <div
                    key={konek.id}
                    className={`group w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      konek.id === activeKonekId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      aria-label={`Switch to ${konek.name} project`}
                      aria-current={konek.id === activeKonekId ? 'true' : undefined}
                      onClick={() => {
                        onKonekChange(konek);
                        setIsOpen(false);
                      }}
                      className="flex-1 flex items-center gap-3 text-left min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                          konek.id === activeKonekId
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {konek.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            konek.id === activeKonekId ? 'text-blue-600' : 'text-gray-900'
                          }`}
                        >
                          {konek.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Updated {formatDate(konek.updatedAt)}
                        </p>
                      </div>
                      {konek.id === activeKonekId && (
                        <Check size={16} className="text-blue-500 shrink-0" />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${konek.name} project`}
                      onClick={(e) => handleDeleteKonek(e, konek.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Delete konek"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Create New */}
            <div className="border-t border-gray-100">
              {isCreating ? (
                <div className="p-3">
                  <input
                    ref={inputRef}
                    type="text"
                    aria-label="New konek project name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Konek name..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      aria-label="Create new konek project"
                      onClick={handleCreateKonek}
                      disabled={!newName.trim()}
                      className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      aria-label="Cancel creating new konek"
                      onClick={() => {
                        setIsCreating(false);
                        setNewName('');
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  aria-label="Create new konek project"
                  onClick={() => setIsCreating(true)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                    <Plus size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">New Konek</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
