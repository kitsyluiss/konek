import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { AvatarStyle, SavedKonek } from '../types';
import {
  getKonek,
  getOrCreateActiveKonek,
  setActiveKonekId,
  getAllKoneks,
  importKonekFromJSON,
} from '../services/storageService';
import Block from './Block';
import { buildSocialUrl, formatFollowerCount, getSocialPlatformOption } from '../socialPlatforms';
import { getMobileLayout, MOBILE_GRID_CONFIG } from '../utils/mobileLayout';

const PreviewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [konek, setKonek] = useState<SavedKonek | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  // Lock orientation to portrait on supported devices (mobile browsers)
  useEffect(() => {
    // Try native Screen Orientation API lock first (works on Android Chrome/PWA)
    const tryLock = async () => {
      try {
        if (screen.orientation && 'lock' in screen.orientation) {
          await screen.orientation.lock('portrait');
        }
      } catch {
        // Silently fail on desktop or unsupported browsers
      }
    };
    tryLock();

    // CSS fallback: detect landscape and show a "please rotate" overlay
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      // If we have a slug, try to find it
      if (slug) {
        // 1. Check local storage koneks for matching slug
        const localKoneks = getAllKoneks();
        const matchedKonek = localKoneks.find((b) => b.data.profile.slug === slug || b.id === slug);

        if (matchedKonek) {
          setKonek(matchedKonek);
          return;
        }

        // 2. Try fetching from public /koneks/ folder
        try {
          const res = await fetch(`/koneks/${slug}.json`);
          if (res.ok) {
            const json = await res.json();
            const imported = importKonekFromJSON(json);
            setKonek(imported);
            return;
          }
        } catch (e) {
          console.error('Failed to fetch remote konek:', e);
        }

        setError('Profile not found.');
        return;
      }

      // Fallback for normal preview
      const requestedId = params.get('id')?.trim();
      const requested = requestedId ? getKonek(requestedId) : null;
      const resolved = requested || getOrCreateActiveKonek();
      if (requested) setActiveKonekId(requested.id);
      setKonek(resolved);
    };

    init();
  }, []);

  // Avatar style helpers
  const getAvatarStyle = (style?: AvatarStyle): React.CSSProperties => {
    const s = style || {
      shape: 'rounded',
      shadow: true,
      border: true,
      borderColor: '#ffffff',
      borderWidth: 4,
    };
    const radius = s.shape === 'circle' ? '9999px' : s.shape === 'square' ? '0' : '1.5rem';
    const shadow = s.shadow !== false ? '0 25px 50px -12px rgba(0,0,0,0.15)' : 'none';
    const border =
      s.border !== false ? `${s.borderWidth || 4}px solid ${s.borderColor || '#ffffff'}` : 'none';
    return { borderRadius: radius, boxShadow: shadow, border };
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-700">
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-lg">{error}</p>
        <a href="/" className="mt-6 text-blue-500 hover:underline">
          Go to Home
        </a>
      </div>
    );
  }

  if (!konek) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  const profile = konek.data.profile;
  const blocks = konek.data.blocks;

  // Portrait-only: show a rotation prompt if user is in landscape
  if (isLandscape) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Animated rotate phone icon */}
        <div
          style={{
            fontSize: '4rem',
            animation: 'rotate-hint 1.8s ease-in-out infinite',
          }}
        >
          📱
        </div>
        <style>{`
          @keyframes rotate-hint {
            0%   { transform: rotate(0deg); }
            30%  { transform: rotate(90deg); }
            70%  { transform: rotate(90deg); }
            100% { transform: rotate(0deg); }
          }
        `}</style>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, textAlign: 'center', margin: 0 }}>
          Please rotate your device
        </p>
        <p style={{ fontSize: '0.85rem', opacity: 0.5, textAlign: 'center', margin: 0 }}>
          This profile is best viewed in portrait mode
        </p>
      </div>
    );
  }

  // Sort blocks for mobile (by row, then column)
  const sortedBlocks = [...blocks].sort((a, b) => {
    const aRow = a.gridRow ?? 999;
    const bRow = b.gridRow ?? 999;
    const aCol = a.gridColumn ?? 999;
    const bCol = b.gridColumn ?? 999;
    if (aRow !== bRow) return aRow - bRow;
    return aCol - bCol;
  });

  // Render social icons
  const renderSocialIcons = () => {
    if (!profile.showSocialInHeader || !profile.socialAccounts?.length) return null;
    return (
      <div className="flex flex-wrap gap-3 mt-4">
        {profile.socialAccounts.map((account) => {
          const option = getSocialPlatformOption(account.platform);
          if (!option) return null;
          const BrandIcon = option.brandIcon;
          const FallbackIcon = option.icon;
          const url = buildSocialUrl(account.platform, account.handle);
          const showCount = profile.showFollowerCount && account.followerCount;
          return (
            <a
              key={account.platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${showCount ? 'px-3 py-2' : 'w-10 h-10'} bg-white rounded-full shadow-md flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg transition-all`}
              title={option.label}
            >
              <span style={{ color: option.brandColor }}>
                {BrandIcon ? <BrandIcon size={20} /> : <FallbackIcon size={20} />}
              </span>
              {showCount && (
                <span className="text-sm font-semibold text-gray-700">
                  {formatFollowerCount(account.followerCount)}
                </span>
              )}
            </a>
          );
        })}
      </div>
    );
  };

  // Background style
  const bgStyle: React.CSSProperties = profile.backgroundImage
    ? {
        backgroundImage: `url('${profile.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }
    : { backgroundColor: profile.backgroundColor || '#f8fafc' };

  const avatarStyle = getAvatarStyle(profile.avatarStyle);

  return (
    <div className="min-h-screen font-sans relative" style={bgStyle}>
      {/* Background blur overlay */}
      {profile.backgroundImage && profile.backgroundBlur && profile.backgroundBlur > 0 && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${profile.backgroundBlur}px)`,
            WebkitBackdropFilter: `blur(${profile.backgroundBlur}px)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Desktop Layout - Matches Builder */}
        <div className="hidden lg:flex">
          {/* Fixed Sidebar */}
          <div className="fixed left-0 top-0 w-[420px] h-screen flex flex-col justify-center items-start px-12 z-10">
            <div className="flex flex-col items-start text-left">
              <div className="relative group mb-8">
                <div className="w-40 h-40 overflow-hidden bg-gray-100" style={avatarStyle}>
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3 w-full max-w-xs">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                  {profile.name}
                </h1>
                <p className="text-base text-gray-500 font-medium leading-relaxed whitespace-pre-wrap">
                  {profile.bio || '—'}
                </p>
                {renderSocialIcons()}
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="ml-[420px] flex-1 p-12 pt-24">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(9, 1fr)', gridAutoRows: '64px' }}
            >
              {blocks.map((block, index) => (
                <Block
                  key={block.id}
                  block={{ ...block, zIndex: index + 1 }}
                  isSelected={false}
                  isDragTarget={false}
                  isDragging={false}
                  enableResize={false}
                  isResizing={false}
                  onResizeStart={undefined}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onDragStart={() => {}}
                  onDragEnter={() => {}}
                  onDragEnd={() => {}}
                  onDrop={() => {}}
                  enableTiltEffect={true}
                  previewMode={true}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Matches Builder mobile preview */}
        <div className="lg:hidden">
          {/* Centered Profile */}
          <div className="p-4 pt-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-4 overflow-hidden bg-gray-100" style={avatarStyle}>
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 leading-none mb-2">
              {profile.name}
            </h1>
            <p className="text-sm text-gray-500 font-medium whitespace-pre-wrap max-w-xs leading-relaxed">
              {profile.bio}
            </p>
            {profile.showSocialInHeader && profile.socialAccounts?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {profile.socialAccounts.map((account) => {
                  const option = getSocialPlatformOption(account.platform);
                  if (!option) return null;
                  const BrandIcon = option.brandIcon;
                  const FallbackIcon = option.icon;
                  const url = buildSocialUrl(account.platform, account.handle);
                  const showCount = profile.showFollowerCount && account.followerCount;
                  return (
                    <a
                      key={account.platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${showCount ? 'px-3 py-2' : 'w-10 h-10'} bg-white rounded-full shadow-md flex items-center justify-center gap-2 font-semibold text-gray-900 transition-transform hover:-translate-y-0.5`}
                      title={option.label}
                    >
                      <span style={{ color: option.brandColor }}>
                        {BrandIcon ? <BrandIcon size={20} /> : <FallbackIcon size={20} />}
                      </span>
                      {showCount && (
                        <span className="text-sm font-semibold text-gray-900">
                          {formatFollowerCount(account.followerCount)}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Grid - 2 columns adaptive */}
          <div className="p-4">
            <div
              className="grid pb-8"
              style={{
                gridTemplateColumns: `repeat(${MOBILE_GRID_CONFIG.columns}, 1fr)`,
                gridAutoRows: `${MOBILE_GRID_CONFIG.rowHeight}px`,
                gap: `${MOBILE_GRID_CONFIG.gap}px`,
              }}
            >
              {sortedBlocks.map((block) => {
                const mobileLayout = getMobileLayout(block);
                return (
                  <div
                    key={block.id}
                    style={{
                      gridColumn: `span ${mobileLayout.colSpan}`,
                      gridRow: `span ${mobileLayout.rowSpan}`,
                    }}
                  >
                    <Block
                      block={{ ...block, gridColumn: undefined, gridRow: undefined }}
                      isSelected={false}
                      isDragTarget={false}
                      isDragging={false}
                      enableResize={false}
                      isResizing={false}
                      onResizeStart={undefined}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onDragStart={() => {}}
                      onDragEnter={() => {}}
                      onDragEnd={() => {}}
                      onDrop={() => {}}
                      enableTiltEffect={true}
                      previewMode={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        {profile.showBranding !== false && (
          <footer className="w-full py-10 text-center">
            <p className="text-sm text-gray-400 font-medium">
              Made with <span className="text-red-400">♥</span> using{' '}
              <a
                href="https://github.com/yoanbernabeu/konek"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-violet-500 transition-colors"
              >
                Konek
              </a>
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
