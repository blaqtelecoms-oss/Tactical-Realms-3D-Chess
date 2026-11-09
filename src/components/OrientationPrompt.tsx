import React from 'react';

interface OrientationPromptProps {
  onRotateClick: () => void;
  onDismiss: () => void;
}

export function OrientationPrompt({ onRotateClick, onDismiss }: OrientationPromptProps) {
  return (
    <div className="orientation-guard-overlay" role="dialog" aria-modal="true" aria-label="Rotate screen to landscape">
      <div className="orientation-guard-dialog">
        <div className="orientation-anim-box">
          <div className="orientation-phone-graphic">
            <div className="orientation-phone-screen"></div>
            <div className="orientation-phone-notch"></div>
          </div>
          <div className="orientation-rotate-arrow">↻</div>
        </div>

        <span className="orientation-kicker">✦ Mobile Optimization ✦</span>
        <h2 className="orientation-title">Rotate to Landscape</h2>
        <p className="orientation-desc">
          Tactical Realms: 3D Chess is crafted for wide battlefields and tactical command. Rotate your device for the best 3D perspective.
        </p>

        <div className="orientation-actions">
          <button
            type="button"
            className="orientation-btn-primary"
            onClick={onRotateClick}
            title="Attempt Fullscreen Landscape Orientation"
          >
            <span>⛶ Rotate &amp; Fullscreen</span>
          </button>
          <button
            type="button"
            className="orientation-btn-secondary"
            onClick={onDismiss}
            title="Continue playing in portrait view"
          >
            <span>Stay in Portrait</span>
          </button>
        </div>
      </div>
    </div>
  );
}
