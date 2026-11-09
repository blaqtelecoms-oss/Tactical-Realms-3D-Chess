import { useEffect, useRef, useState } from 'react';
import { initWizardChess } from './wizardChessEngine.js';
import { HomePage } from './components/HomePage';
import { RealmSelector } from './components/RealmSelector';
import { PauseModal } from './components/PauseModal';
import { OrientationPrompt } from './components/OrientationPrompt';
import {
  PlayerCamIcon,
  OverheadCamIcon,
  SideCamIcon,
  ArenaCamIcon,
  SideToggleIcon,
  AIMoveIcon,
  PauseIcon,
  ExitIcon,
  HideUIIcon,
  HomeIcon
} from './components/HeaderIcons';

type ViewMode = 'home' | 'realm_select' | 'playing';
type RealmType = 'rome' | 'cathedral' | 'cyberpunk';

export default function App() {
  const initializedRef = useRef(false);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [isPaused, setIsPaused] = useState(false);
  const [currentRealm, setCurrentRealm] = useState<RealmType>('rome');
  const [isNewGameFlow, setIsNewGameFlow] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [saveSummary, setSaveSummary] = useState<{
    environment: string;
    turn: string;
    moves: number;
  } | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [showOrientationPrompt, setShowOrientationPrompt] = useState(false);

  // Check saved game in localStorage
  const refreshSaveStatus = () => {
    try {
      const raw = localStorage.getItem('wizard_chess_save_v1');
      if (raw) {
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.pieces) && data.pieces.length > 0) {
          setHasSave(true);
          setSaveSummary({
            environment: data.environment || 'rome',
            turn: data.currentTurn === 'b' ? 'Black' : 'White',
            moves: data.moveCount || 0
          });
          if (data.environment) {
            setCurrentRealm(data.environment);
          }
          return;
        }
      }
    } catch (e) {}
    setHasSave(false);
    setSaveSummary(null);
  };

  // Orientation detection & auto-lock helper
  const tryLockLandscape = async () => {
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => {});
      }
      const orientation = screen.orientation as unknown as { lock?: (type: string) => Promise<void> } | undefined;
      if (orientation?.lock) {
        await orientation.lock('landscape').catch(() => {});
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initWizardChess();
      refreshSaveStatus();
    }

    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768 || window.innerHeight <= 600;
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isMobile && isPortrait) {
        setShowOrientationPrompt(true);
      } else {
        setShowOrientationPrompt(false);
      }
    };

    checkOrientation();
    tryLockLandscape();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewMode === 'playing') {
          handleTogglePause();
        } else if (viewMode === 'realm_select') {
          setViewMode('home');
        }
        setMobileSheetOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [viewMode, isPaused]);

  const handleRestoreUI = () => {
    const win = window as unknown as { wizardChess?: { toggleUI?: (force?: boolean) => void } };
    if (win.wizardChess?.toggleUI) {
      win.wizardChess.toggleUI(false);
    } else {
      document.body.classList.remove('cinematic-ui-hidden');
      const btnHide = document.getElementById('btn-hide-ui');
      if (btnHide) btnHide.setAttribute('title', 'Hide UI [H]');
    }
  };

  const handleNewGameClick = () => {
    setIsNewGameFlow(true);
    setViewMode('realm_select');
  };

  const handleContinueGameClick = () => {
    const win = window as unknown as {
      wizardChess?: {
        loadSavedGameState?: () => boolean;
        getGameEnvironment?: () => RealmType;
      };
    };
    if (win.wizardChess?.loadSavedGameState) {
      const ok = win.wizardChess.loadSavedGameState();
      if (ok) {
        if (win.wizardChess.getGameEnvironment) {
          setCurrentRealm(win.wizardChess.getGameEnvironment());
        }
        setViewMode('playing');
        return;
      }
    }
    // Fallback if no valid save: start new match in selected realm
    handleNewGameClick();
  };

  const handleSelectRealm = (realmId: RealmType) => {
    setCurrentRealm(realmId);
    const win = window as unknown as {
      wizardChess?: {
        setGameEnvironment?: (id: string) => void;
        resetChessBoard?: (orientCam?: boolean) => void;
      };
    };
    if (win.wizardChess?.setGameEnvironment) {
      win.wizardChess.setGameEnvironment(realmId);
    }
    if (isNewGameFlow && win.wizardChess?.resetChessBoard) {
      win.wizardChess.resetChessBoard(true);
    }
    setIsPaused(false);
    setViewMode('playing');
    refreshSaveStatus();
  };

  const handleTogglePause = () => {
    const win = window as unknown as {
      wizardChess?: {
        pauseGame?: () => void;
        resumeGame?: () => void;
      };
    };
    if (!isPaused) {
      if (win.wizardChess?.pauseGame) win.wizardChess.pauseGame();
      setIsPaused(true);
    } else {
      if (win.wizardChess?.resumeGame) win.wizardChess.resumeGame();
      setIsPaused(false);
    }
  };

  const handleRestartMatch = () => {
    const win = window as unknown as {
      wizardChess?: {
        resetChessBoard?: (orientCam?: boolean) => void;
        resumeGame?: () => void;
      };
    };
    if (win.wizardChess?.resetChessBoard) {
      win.wizardChess.resetChessBoard(true);
    }
    if (win.wizardChess?.resumeGame) {
      win.wizardChess.resumeGame();
    }
    setIsPaused(false);
    refreshSaveStatus();
  };

  const handleExitToHome = () => {
    const win = window as unknown as {
      wizardChess?: {
        saveGameState?: () => void;
        pauseGame?: () => void;
      };
    };
    if (win.wizardChess?.saveGameState) {
      win.wizardChess.saveGameState();
    }
    if (win.wizardChess?.pauseGame) {
      win.wizardChess.pauseGame();
    }
    setIsPaused(false);
    setViewMode('home');
    refreshSaveStatus();
  };

  const getRealmDisplayName = (id: RealmType) => {
    switch (id) {
      case 'rome':
        return 'Imperial Rome';
      case 'cyberpunk':
        return 'Cyberpunk Sanctum';
      case 'cathedral':
      default:
        return 'Gothic Cathedral';
    }
  };

  return (
    <>
      <div id="loading-overlay">
        <div className="loader-title">Tactical Realms: 3D Chess</div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" id="loader-bar"></div>
        </div>
        <div id="loader-text">Summoning Realm Architecture &amp; Sculpted Pieces...</div>
      </div>

      <div id="canvas-container"></div>

      {/* Mobile Orientation Rotation Prompt */}
      {showOrientationPrompt && (
        <OrientationPrompt
          onRotateClick={async () => {
            await tryLockLandscape();
            setShowOrientationPrompt(false);
          }}
          onDismiss={() => {
            setShowOrientationPrompt(false);
          }}
        />
      )}

      {/* Home Page View */}
      {viewMode === 'home' && (
        <HomePage
          hasSave={hasSave}
          saveSummary={saveSummary}
          onNewGame={handleNewGameClick}
          onContinueGame={handleContinueGameClick}
          onQuickStartRealm={(realmId) => {
            setIsNewGameFlow(true);
            handleSelectRealm(realmId);
          }}
          onViewBoard={() => setViewMode('playing')}
        />
      )}

      {/* Realm Selection View */}
      {viewMode === 'realm_select' && (
        <RealmSelector
          currentRealm={currentRealm}
          onSelectRealm={handleSelectRealm}
          onBack={() => setViewMode('home')}
          isNewGame={isNewGameFlow}
        />
      )}

      {/* Pause Modal View */}
      {viewMode === 'playing' && isPaused && (
        <div className="pause-modal-overlay">
          <div className="pause-modal-dialog">
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)' }}>
                Active Session
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-bright)', marginTop: '4px' }}>
                Game Paused
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                Your match state is auto-saved. Take your time or adjust the realm.
              </p>
            </div>

            <div className="pause-stats-box">
              <div className="pause-stats-row">
                <span style={{ color: '#94a3b8' }}>Environment:</span>
                <strong style={{ color: 'var(--gold-bright)' }}>{getRealmDisplayName(currentRealm)}</strong>
              </div>
              <div className="pause-stats-row">
                <span style={{ color: '#94a3b8' }}>Current Turn:</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{document.getElementById('turn-text')?.textContent || 'White to Move'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={handleTogglePause}
                className="pause-btn-resume"
              >
                Resume Match
              </button>

              <button
                type="button"
                id="btn-reset"
                onClick={handleRestartMatch}
                className="pause-btn-secondary"
                title="Restart Match on the Altar"
              >
                Restart Match
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPaused(false);
                  setIsNewGameFlow(false);
                  setViewMode('realm_select');
                }}
                className="pause-btn-secondary"
              >
                Change Realm &amp; Armory
              </button>

              <button
                type="button"
                onClick={handleExitToHome}
                className="pause-btn-danger"
              >
                Exit to Home Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden fallback for reset handler when unpaused */}
      {(!isPaused || viewMode !== 'playing') && (
        <button
          type="button"
          id="btn-reset"
          style={{ display: 'none' }}
          onClick={handleRestartMatch}
          aria-hidden="true"
        />
      )}

      {/* Active Session Game HUD */}
      <button
        type="button"
        className="hud-btn mobile-only-restore-ui"
        id="btn-mobile-show-ui"
        onClick={handleRestoreUI}
        title="Show HUD Controls"
      >
        Show UI
      </button>

      <div id="hud-top" style={{ display: viewMode === 'playing' ? 'flex' : 'none' }}>
        <div className="hud-group" id="hud-left">
          <div className="brand-pill">
            <span className="brand-title">Tactical Realms</span>
            <span className="realm-badge">{currentRealm}</span>
          </div>
          <div className="status-pill" id="status-pill">
            <span className="turn-dot" id="turn-dot"></span>
            <span id="turn-text">White to Move</span>
            <span className="mode-badge" id="mode-badge">Playing as White</span>
          </div>
        </div>

        <button
          type="button"
          className={`hud-btn mobile-controls-trigger ${mobileSheetOpen ? 'active' : ''}`}
          id="btn-mobile-controls"
          aria-expanded={mobileSheetOpen}
          aria-controls="hud-right"
          onClick={() => setMobileSheetOpen((prev) => !prev)}
        >
          {mobileSheetOpen ? 'Close' : 'Controls'}
        </button>

        <div
          className={`mobile-sheet-backdrop ${mobileSheetOpen ? 'open' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setMobileSheetOpen(false);
          }}
          aria-hidden="true"
        ></div>

        <div
          className={`hud-group ${mobileSheetOpen ? 'mobile-sheet-open' : ''}`}
          id="hud-right"
        >
          <div
            className="mobile-sheet-handle-wrap"
            onClick={(e) => {
              e.stopPropagation();
              setMobileSheetOpen(false);
            }}
            aria-hidden="true"
          >
            <div className="mobile-sheet-handle"></div>
          </div>

          <div className="mobile-sheet-header">
            <span className="mobile-sheet-title">Match Controls</span>
            <button
              type="button"
              className="mobile-sheet-close"
              id="btn-mobile-sheet-close"
              onClick={(e) => {
                e.stopPropagation();
                setMobileSheetOpen(false);
              }}
              aria-label="Close Controls"
            >
              Close ✕
            </button>
          </div>

          <div className="mobile-sheet-section-label">Game Actions</div>

          {/* Side Toggle Icon Button */}
          <button
            className="hud-btn hud-btn-icon"
            id="btn-side-toggle"
            title="Switch Playing Side (White / Black)"
            aria-label="Switch Playing Side"
            onClick={() => setMobileSheetOpen(false)}
          >
            <SideToggleIcon />
          </button>

          {/* AI Move Icon Button */}
          <button
            className="hud-btn hud-btn-icon"
            id="btn-ai-move"
            title="Let AI Move Immediately"
            aria-label="AI Move"
            onClick={() => setMobileSheetOpen(false)}
          >
            <AIMoveIcon />
          </button>

          <div className="hud-divider" aria-hidden="true"></div>

          <div className="mobile-sheet-section-label">
            <span>Camera Perspectives</span>
          </div>

          {/* Camera View Icon Buttons */}
          <button
            className="hud-btn hud-btn-icon active"
            id="btn-cam-player"
            title="Player Camera (Tap again to flip)"
            aria-label="Player Perspective Camera"
          >
            <PlayerCamIcon />
          </button>
          <button
            className="hud-btn hud-btn-icon"
            id="btn-cam-top"
            title="Overhead Board View"
            aria-label="Overhead Board View"
          >
            <OverheadCamIcon />
          </button>
          <button
            className="hud-btn hud-btn-icon"
            id="btn-cam-side"
            title="Side Profile View"
            aria-label="Side Profile View"
          >
            <SideCamIcon />
          </button>
          <button
            className="hud-btn hud-btn-icon"
            id="btn-cam-wide"
            title="Cathedral &amp; Colosseum Wide View"
            aria-label="Arena Architecture View"
          >
            <ArenaCamIcon />
          </button>

          <div className="hud-divider" aria-hidden="true"></div>

          <div className="mobile-sheet-section-label">Session Controls</div>

          {/* Home Page Button */}
          <button
            type="button"
            className="hud-btn hud-btn-icon"
            id="btn-home"
            title="Return to Home Screen"
            aria-label="Home Screen"
            onClick={() => {
              setMobileSheetOpen(false);
              handleExitToHome();
            }}
          >
            <HomeIcon />
          </button>

          {/* Pause Button */}
          <button
            type="button"
            className="hud-btn hud-btn-icon"
            id="btn-pause"
            title="Pause Game (Shortcut: Esc)"
            aria-label="Pause Game"
            onClick={() => {
              setMobileSheetOpen(false);
              handleTogglePause();
            }}
          >
            <PauseIcon />
          </button>

          {/* Exit Button */}
          <button
            type="button"
            className="hud-btn hud-btn-icon hud-btn-danger"
            id="btn-exit"
            title="Exit to Home Page"
            aria-label="Exit to Home"
            onClick={() => {
              setMobileSheetOpen(false);
              handleExitToHome();
            }}
          >
            <ExitIcon />
          </button>

          <div className="hud-divider" aria-hidden="true"></div>

          {/* Hide UI Icon Button */}
          <button
            className="hud-btn hud-btn-icon"
            id="btn-hide-ui"
            title="Toggle HUD Visibility (Shortcut: H)"
            aria-label="Toggle HUD Visibility"
            onClick={() => setMobileSheetOpen(false)}
          >
            <HideUIIcon />
          </button>

          <div className="mobile-sheet-hint">
            <strong>Touch:</strong> Tap Piece to Move &nbsp;•&nbsp; 1-Finger: Orbit &nbsp;•&nbsp; 2-Finger: Pan &nbsp;•&nbsp; Pinch: Zoom
          </div>
        </div>
      </div>

      <div
        id="hud-bottom"
        style={{ display: viewMode === 'playing' ? 'flex' : 'none' }}
      >
        <div className="hint-pill" id="controls-hint">
          <strong>Controls:</strong> Click Piece &nbsp;•&nbsp; Left-Drag: Orbit &nbsp;•&nbsp; Right-Drag: Pan &nbsp;•&nbsp; Scroll: Zoom &nbsp;•&nbsp; Esc: Pause &nbsp;•&nbsp; H: Hide UI
        </div>
        <div className="captured-pill" id="captured-tray"></div>
      </div>

      <div id="checkmate-overlay" role="status" aria-live="polite">
        <div className="checkmate-banner">
          <div className="checkmate-ornament">✦ &nbsp; Sanctum Judgment &nbsp; ✦</div>
          <div className="checkmate-crown" id="checkmate-crown">♔</div>
          <div className="checkmate-title" id="checkmate-title">Checkmate</div>
          <div className="checkmate-rule"></div>
          <div className="checkmate-subtitle" id="checkmate-subtitle">
            White Triumphs • The Black King Has Fallen
          </div>
          <div className="checkmate-actions">
            <button className="checkmate-btn" id="btn-checkmate-replay">
              Replay King Fall
            </button>
            <button
              className="checkmate-btn"
              id="btn-checkmate-newgame"
              onClick={() => {
                const overlay = document.getElementById('checkmate-overlay');
                if (overlay) overlay.classList.remove('visible');
                handleRestartMatch();
              }}
            >
              Play Again
            </button>
            <button className="checkmate-btn secondary" id="btn-checkmate-dismiss">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
