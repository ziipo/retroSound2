import React from 'react';

export const AppHeader: React.FC = () => {
  return (
    <header style={styles.header}>
      <div style={styles.cornerDecoration} className="corner-decoration top-left"></div>
      <div style={styles.cornerDecoration} className="corner-decoration top-right"></div>

      <div style={styles.titleContainer}>
        <img
          src={`${import.meta.env.BASE_URL}phonoIcon2.svg`}
          alt="Phonograph"
          style={styles.iconLeft}
        />

        <div style={styles.titleWrapper}>
          <h1 style={styles.title} className="gold-gradient-text">
            RETROSOUND
          </h1>
          <p style={styles.subtitle}>Vintage Vinyl Audio Effects</p>
        </div>

        <img
          src={`${import.meta.env.BASE_URL}phonoIcon2.svg`}
          alt="Phonograph"
          style={styles.iconRight}
        />
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    borderBottom: '2px solid var(--gold-primary)',
    padding: 'var(--space-xl)',
    textAlign: 'center',
    position: 'relative'
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-xl)'
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconLeft: {
    height: '60px',
    maxWidth: '60px',
    objectFit: 'contain',
    filter: 'invert(77%) sepia(58%) saturate(434%) hue-rotate(3deg) brightness(91%) contrast(87%)',
    opacity: 0.9
  },
  iconRight: {
    height: '60px',
    maxWidth: '60px',
    objectFit: 'contain',
    filter: 'invert(77%) sepia(58%) saturate(434%) hue-rotate(3deg) brightness(91%) contrast(87%)',
    opacity: 0.9,
    transform: 'scaleX(-1)' // Mirror horizontally
  },
  title: {
    fontSize: '3rem',
    letterSpacing: '0.5rem',
    marginBottom: 'var(--space-sm)',
    fontFamily: 'var(--font-display)'
  },
  subtitle: {
    color: 'var(--gold-primary)',
    fontSize: '0.875rem',
    letterSpacing: '0.3rem',
    textTransform: 'uppercase',
    fontWeight: 600
  },
  cornerDecoration: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    border: '2px solid var(--gold-primary)'
  }
};
