import React from 'react';
import { REALMS, RealmOption } from './RealmSelector';
import { PlayIcon } from './HeaderIcons';

interface HomePageProps {
  hasSave: boolean;
  saveSummary?: {
    environment: string;
    turn: string;
    moves: number;
  } | null;
  onNewGame: () => void;
  onContinueGame: () => void;
  onQuickStartRealm: (realmId: 'rome' | 'cathedral' | 'cyberpunk') => void;
  onViewBoard?: () => void;
}

export function HomePage({
  hasSave,
  saveSummary,
  onNewGame,
  onContinueGame,
  onQuickStartRealm,
  onViewBoard
}: HomePageProps) {
  return (
    <div className="home-screen">
      {/* Top Bar */}
      <header className="home-header">
        <div className="home-brand-wrap">
          <span className="home-brand-title">Tactical Realms</span>
          <span className="home-brand-pill">3D Chess Edition</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Imperial Armory &amp; Sculpted Stone
          </div>
          {onViewBoard && (
            <button
              type="button"
              onClick={onViewBoard}
              className="hud-btn"
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
              title="Jump directly to the 3D chess battlefield"
            >
              View Board →
            </button>
          )}
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="home-main">
        <span className="home-kicker">
          ✦ &nbsp; IMPERIAL EDITION · 3D TACTICAL WARFARE &nbsp; ✦
        </span>

        <h1 className="home-headline">
          Tactical Realms: <span>3D Chess</span>
        </h1>

        <p className="home-desc">
          Lead Roman Legionaries with crested Galea helmets and Scutum shields, Gothic Cathedral knights, or Cyberpunk warriors across dynamic, sculpted 3D environments with stone shatter combat.
        </p>

        {/* Primary Action Buttons: New Game & Continue Game */}
        <div className="home-cta-row">
          <button
            type="button"
            onClick={onNewGame}
            className="home-btn-primary"
            title="Start a fresh match and choose your realm"
          >
            <PlayIcon className="w-5 h-5 text-slate-950" />
            <span>New Game</span>
          </button>

          <button
            type="button"
            onClick={onContinueGame}
            disabled={!hasSave}
            className="home-btn-secondary"
            title={hasSave ? 'Resume your saved match' : 'No active game in progress'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Continue Game</span>
            </div>
            {hasSave && saveSummary && (
              <span style={{ fontSize: '0.72rem', color: '#f5d76e', fontWeight: 'normal' }}>
                Resume {saveSummary.environment.toUpperCase()} match
              </span>
            )}
          </button>
        </div>

        {/* 3 Premium Feature Pillars */}
        <div className="home-pillars-grid">
          <div className="home-pillar-card">
            <div className="home-pillar-icon">🏛️</div>
            <div>
              <div className="home-pillar-title">Dynamic 3D Architecture</div>
              <div className="home-pillar-desc">
                Colosseum marble arches, Gothic cathedral ribbed vaults, and Cyberpunk neon sanctums render dynamically around the board.
              </div>
            </div>
          </div>
          <div className="home-pillar-card">
            <div className="home-pillar-icon">⚔️</div>
            <div>
              <div className="home-pillar-title">Synchronized Soldier Armory</div>
              <div className="home-pillar-desc">
                Crested Galea helmets, curved Scutum shields, and SPQR vexillums animate synchronously on rigged bone skeletons.
              </div>
            </div>
          </div>
          <div className="home-pillar-card">
            <div className="home-pillar-icon">💥</div>
            <div>
              <div className="home-pillar-title">Cinematic Melee &amp; Shatter</div>
              <div className="home-pillar-desc">
                Living stone statues lunge with swords and spears, detonating captured defenders into tumbling stone debris.
              </div>
            </div>
          </div>
        </div>

        {/* Realm Preview Showcase Grid */}
        <div className="home-realms-wrap">
          <div className="home-realms-bar">
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', fontWeight: 700, fontFamily: "'Cinzel', serif" }}>
              Select A Realm To Begin
            </span>
            <span style={{ color: '#94a3b8' }}>
              Instant 3D Environment &amp; Armory Outfit Switching
            </span>
          </div>

          <div className="home-realms-grid">
            {REALMS.map((realm: RealmOption) => (
              <div
                key={realm.id}
                onClick={() => onQuickStartRealm(realm.id)}
                className="home-realm-card"
              >
                <div className="home-realm-media">
                  <img
                    src={realm.image}
                    alt={realm.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="home-realm-badge">
                    {realm.name}
                  </div>
                  <div className="home-realm-play-tag">
                    Play Realm →
                  </div>
                </div>

                <div className="home-realm-body">
                  <h3 className="home-realm-name">
                    {realm.name}
                  </h3>
                  <p className="home-realm-desc">
                    {realm.description}
                  </p>
                  <div className="home-realm-outfit">
                    <strong>Piece Armory: </strong>
                    <span>{realm.soldierOutfit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          Tactical Realms: 3D Chess · Real-time WebGL Engine with Stone Shatter Physics
        </div>
        <div style={{ display: 'flex', gap: '12px', color: '#94a3b8' }}>
          <span>Single-Player AI</span>
          <span>·</span>
          <span>3 Themed Realms</span>
          <span>·</span>
          <span>Cinematic Combat</span>
        </div>
      </footer>
    </div>
  );
}
