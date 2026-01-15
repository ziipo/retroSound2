import React, { useRef, useState } from 'react';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect }) => {
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
  );
};

const styles: Record<string, React.CSSProperties> = {
  dropzone: {
    maxWidth: '600px',
    margin: 'var(--space-3xl) auto',
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
  }
};
