import React, { useState } from 'react';

export interface RealmOption {
  id: 'rome' | 'cathedral' | 'cyberpunk';
  name: string;
  tagline: string;
  description: string;
  soldierOutfit: string;
  image: string;
  accentColor: string;
  features: string[];
}

export const REALMS: RealmOption[] = [
  {
    id: 'rome',
    name: 'Imperial Rome',
    tagline: 'Colosseum Forum & Legionary Armory',
    description: 'Travertine forum peristyle with Corinthian marble columns, crimson SPQR vexillum banners, and Mediterranean sunlight.',
    soldierOutfit: 'Galea helmets with centurion plumes, curved Scutum shields, gladius swords, pilum javelins, and Caesar Imperator crown.',
    image: '/src/assets/images/theme_rome_colosseum_1794234759818.jpg',
    accentColor: '#c99738',
    features: ['Travertine Colonnade', 'Centurion Helmets & Plumes', 'Curved Scutum Shields', 'Emperor Caesar & Empress']
  },
  {
    id: 'cathedral',
    name: 'Gothic Cathedral',
    tagline: 'Sacred Vaults & Ashlar Statues',
    description: 'Towering ribbed stone vaults, stained glass rose windows casting mystic colored beams, and twin stone fire braziers.',
    soldierOutfit: 'Original sculpted Gothic stone statues with medieval battle armor, greatswords, and stone shatter physics.',
    image: '/src/assets/images/theme_gothic_cathedral_1794234761031.jpg',
    accentColor: '#90beff',
    features: ['Ribbed Gothic Vaults', 'Rose Window Lighting', 'Gargoyle Stone Statues', 'Chiaroscuro Firelight']
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Sanctum',
    tagline: 'Neon Obsidian & Synth Conduits',
    description: 'Dark reflective obsidian grid with glowing neon cyan and magenta conduit rings in an atmospheric sci-fi citadel.',
    soldierOutfit: 'Cybernetic alloy plating with energetic light conduits, glowing visor arrays, and synthetic obsidian blades.',
    image: '/src/assets/images/theme_cyberpunk_sanctum_1794234760757.jpg',
    accentColor: '#00f0ff',
    features: ['Hexagonal Conduit Rings', 'Neon Cyan & Magenta Rays', 'Obsidian Mirror Tiles', 'Synth Alloy Armory']
  }
];

interface RealmSelectorProps {
  currentRealm: 'rome' | 'cathedral' | 'cyberpunk';
  onSelectRealm: (realmId: 'rome' | 'cathedral' | 'cyberpunk') => void;
  onBack: () => void;
  isNewGame?: boolean;
}

export function RealmSelector({
  currentRealm,
  onSelectRealm,
  onBack,
  isNewGame = false
}: RealmSelectorProps) {
  const [selectedId, setSelectedId] = useState<'rome' | 'cathedral' | 'cyberpunk'>(currentRealm);

  const handleConfirm = () => {
    onSelectRealm(selectedId);
  };

  return (
    <div className="realm-select-overlay">
      <div className="realm-select-dialog">
        {/* Header */}
        <div className="realm-select-header">
          <div>
            <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)' }}>
              Step 2 · Armory &amp; Sanctum Selection
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-bright)', marginTop: '4px' }}>
              Choose Your Chess Realm
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '2px' }}>
              Select an environment to transform the 3D architecture, lighting, and soldier piece outfits.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="hud-btn"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            ← Back to Home
          </button>
        </div>

        {/* 3 Realm Cards */}
        <div className="home-realms-grid">
          {REALMS.map((realm) => {
            const isSelected = selectedId === realm.id;
            return (
              <div
                key={realm.id}
                onClick={() => setSelectedId(realm.id)}
                className={`home-realm-card ${isSelected ? 'active' : ''}`}
                style={{
                  border: isSelected ? '2px solid var(--gold)' : undefined,
                  boxShadow: isSelected ? '0 0 20px rgba(212,175,55,0.4)' : undefined
                }}
              >
                {/* Image Preview Container */}
                <div className="home-realm-media">
                  <img
                    src={realm.image}
                    alt={realm.name}
                    referrerPolicy="no-referrer"
                  />
                  {isSelected && (
                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--gold)', color: '#000', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      Selected
                    </div>
                  )}

                  <div className="home-realm-badge">
                    {realm.name}
                  </div>
                </div>

                {/* Card Details */}
                <div className="home-realm-body">
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}>
                    {realm.tagline}
                  </div>
                  <h3 className="home-realm-name" style={{ fontSize: '1.15rem' }}>
                    {realm.name}
                  </h3>
                  <p className="home-realm-desc">
                    {realm.description}
                  </p>
                  
                  <div className="home-realm-outfit">
                    <strong>Piece Armory: </strong>
                    <span>{realm.soldierOutfit}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                    {realm.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="realm-select-footer">
          <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
            Selected Realm:{' '}
            <strong style={{ color: 'var(--gold-bright)' }}>
              {REALMS.find((r) => r.id === selectedId)?.name}
            </strong>
            {selectedId === 'rome' && (
              <span style={{ color: '#cbd5e1', marginLeft: '6px' }}>
                · Roman soldier outfits with helmets &amp; shields equipped
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onBack}
              className="hud-btn"
              style={{ padding: '10px 18px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="home-btn-primary"
              style={{ minWidth: '180px', padding: '10px 22px', fontSize: '0.92rem' }}
            >
              {isNewGame ? 'Start Battle in Realm' : 'Enter Selected Realm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
