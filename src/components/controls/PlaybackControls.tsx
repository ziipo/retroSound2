import React from 'react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStop
}) => {
  return (
    <div style={styles.container}>
      <button className="art-deco-button" onClick={isPlaying ? onPause : onPlay} style={styles.button}>
        {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
      </button>
      <button className="art-deco-button" onClick={onStop} style={styles.button}>
        ⏹ STOP
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: 'var(--space-md)',
    justifyContent: 'center',
    marginBottom: 'var(--space-xl)'
  },
  button: {
    minWidth: '120px'
  }
};
