import React from 'react';

interface EffectSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const EffectSlider: React.FC<EffectSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange
}) => {
  const displayValue = unit === 'Hz' ? Math.round(value) : value.toFixed(2);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <label style={styles.label}>{label}</label>
        <span style={styles.value}>
          {displayValue}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={styles.slider}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginBottom: 'var(--space-lg)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-sm)'
  },
  label: {
    color: 'var(--gold-primary)',
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '0.1rem',
    textTransform: 'uppercase'
  },
  value: {
    color: 'var(--cream-text)',
    fontSize: '0.875rem',
    fontFamily: 'monospace'
  },
  slider: {
    width: '100%'
  }
};
