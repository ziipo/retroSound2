import React, { useRef, useState } from 'react';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  onLoadDemo?: () => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect, onLoadDemo }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isAudioFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && isAudioFile(file)) {
      onFileSelect(file);
    }
  };

  const isAudioFile = (file: File): boolean => {
    const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/mp4'];
    return audioTypes.includes(file.type) || file.name.match(/\.(mp3|wav|ogg|flac|m4a)$/i) !== null;
  };

  return (
    <div style={styles.container}>
      <div
        className="art-deco-panel"
        style={{
          ...styles.dropzone,
          borderColor: isDragging ? 'var(--gold-light)' : 'var(--gold-primary)',
          boxShadow: isDragging ? 'var(--shadow-gold-strong)' : 'none'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          style={styles.hiddenInput}
        />

        <div style={styles.content}>
          <div style={styles.icon}>🎵</div>
          <h2 style={styles.title} className="gold-gradient-text">
            DROP AUDIO FILE
          </h2>
          <p style={styles.subtitle}>or click to browse</p>
          <p style={styles.formats}>MP3, WAV, OGG, FLAC, M4A</p>
        </div>
      </div>

      {onLoadDemo && (
        <div style={styles.demoContainer}>
          <div className="gold-divider"></div>
          <button
            className="art-deco-button"
            onClick={(e) => {
              e.stopPropagation();
              onLoadDemo();
            }}
            style={styles.demoButton}
          >
            🎧 LOAD DEMO TRACK
          </button>
          <p style={styles.demoText}>Try the effects with a sample audio file</p>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  dropzone: {
    marginTop: 'var(--space-3xl)',
    padding: 'var(--space-3xl)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all var(--transition-medium)',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hiddenInput: {
    display: 'none'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-md)'
  },
  icon: {
    fontSize: '4rem',
    marginBottom: 'var(--space-lg)'
  },
  title: {
    fontSize: '2rem',
    letterSpacing: '0.3rem',
    fontFamily: 'var(--font-display)'
  },
  subtitle: {
    color: 'var(--cream-dim)',
    fontSize: '1rem'
  },
  formats: {
    color: 'var(--gold-dark)',
    fontSize: '0.75rem',
    letterSpacing: '0.1rem',
    marginTop: 'var(--space-md)'
  },
  demoContainer: {
    marginTop: 'var(--space-xl)',
    textAlign: 'center'
  },
  demoButton: {
    marginTop: 'var(--space-lg)',
    marginBottom: 'var(--space-md)'
  },
  demoText: {
    color: 'var(--cream-dim)',
    fontSize: '0.875rem',
    fontStyle: 'italic'
  }
};
