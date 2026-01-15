import React from 'react';
import { AppHeader } from './components/layout/AppHeader';
import { AudioUploader } from './components/upload/AudioUploader';
import { PlaybackControls } from './components/controls/PlaybackControls';
import { PresetSelector } from './components/controls/PresetSelector';
import { EffectsPanel } from './components/effects/EffectsPanel';
import { useAudioEngine } from './hooks/useAudioEngine';
import type { PresetConfig, EffectParameters } from './types/audio.types';
import './styles/globals.css';
import './styles/artdeco.css';

function App() {
  const {
    audioState,
    effectParameters,
    isLoaded,
    loadFile,
    play,
    pause,
    stop,
    updateEffect,
    loadCrackle,
    exportWAV
  } = useAudioEngine();

  const [selectedPresetId, setSelectedPresetId] = React.useState<string>('mellow-vintage');

  const handleFileSelect = async (file: File) => {
    await loadFile(file);
  };

  const handleLoadDemo = async () => {
    try {
      // Load a demo audio file from the public directory
      const response = await fetch(`${import.meta.env.BASE_URL}demo.mp3`);
      if (!response.ok) {
        throw new Error('Demo file not found');
      }
      const blob = await response.blob();
      const file = new File([blob], 'demo.mp3', { type: 'audio/mpeg' });
      await loadFile(file);
    } catch (error) {
      console.error('Failed to load demo track:', error);
      alert('Demo track not available. Please upload your own audio file.');
    }
  };

  const handlePresetSelect = async (preset: PresetConfig) => {
    // Update selected preset ID
    setSelectedPresetId(preset.id);

    // Load crackle file
    await loadCrackle(preset.crackleFile);

    // Apply all effect parameters
    Object.entries(preset.params).forEach(([key, value]) => {
      updateEffect(key as keyof EffectParameters, value);
    });
  };

  const handleExport = async () => {
    try {
      await exportWAV('retrosound-export.wav', progress => {
        console.log(`Export progress: ${Math.round(progress * 100)}%`);
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div style={styles.app}>
      <AppHeader />

      <main style={styles.main}>
        {!isLoaded ? (
          <AudioUploader onFileSelect={handleFileSelect} onLoadDemo={handleLoadDemo} />
        ) : (
          <div style={styles.content}>
            {/* Left Column: Presets & Controls */}
            <div style={styles.leftColumn}>
              <div className="art-deco-panel" style={styles.controlsPanel}>
                <h2 style={styles.sectionTitle} className="gold-gradient-text">
                  CONTROLS
                </h2>
                <div className="gold-divider"></div>

                <PlaybackControls
                  isPlaying={audioState.isPlaying}
                  onPlay={play}
                  onPause={pause}
                  onStop={stop}
                />

                <PresetSelector
                  selectedPresetId={selectedPresetId}
                  onSelectPreset={handlePresetSelect}
                />

                <button
                  className="art-deco-button"
                  onClick={handleExport}
                  style={styles.exportButton}
                >
                  ⬇ EXPORT WAV
                </button>

                {audioState.duration > 0 && (
                  <div style={styles.info}>
                    <p style={styles.infoText}>
                      Duration: {Math.floor(audioState.duration)}s
                    </p>
                    {audioState.isPlaying && (
                      <p style={styles.infoText}>
                        Time: {Math.floor(audioState.currentTime)}s
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Effects */}
            <div style={styles.rightColumn}>
              <EffectsPanel
                parameters={effectParameters}
                onParameterChange={updateEffect}
              />
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          RetroSound · Vintage Vinyl Audio Effects · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    flex: 1,
    padding: 'var(--space-xl)',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: 'var(--space-xl)',
    alignItems: 'start'
  },
  leftColumn: {
    position: 'sticky',
    top: 'var(--space-xl)'
  },
  rightColumn: {
    minHeight: '600px'
  },
  controlsPanel: {
    padding: 'var(--space-xl)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    letterSpacing: '0.3rem',
    fontFamily: 'var(--font-display)',
    textAlign: 'center',
    marginBottom: 'var(--space-md)'
  },
  exportButton: {
    width: '100%',
    marginTop: 'var(--space-lg)'
  },
  info: {
    marginTop: 'var(--space-xl)',
    padding: 'var(--space-md)',
    borderTop: '1px solid var(--gold-dark)'
  },
  infoText: {
    color: 'var(--cream-dim)',
    fontSize: '0.875rem',
    marginBottom: 'var(--space-xs)'
  },
  footer: {
    borderTop: '2px solid var(--gold-primary)',
    padding: 'var(--space-lg)',
    textAlign: 'center'
  },
  footerText: {
    color: 'var(--gold-dark)',
    fontSize: '0.75rem',
    letterSpacing: '0.15rem',
    textTransform: 'uppercase'
  }
};

export default App;
