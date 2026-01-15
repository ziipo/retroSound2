import React from 'react';
import { PRESETS } from '../../presets/presetDefinitions';
import type { PresetConfig } from '../../types/audio.types';

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetConfig) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset }) => {
  const [selectedId, setSelectedId] = React.useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = event.target.value;
    setSelectedId(presetId);

    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      onSelectPreset(preset);
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>PRESET</label>
      <select
        value={selectedId}
        onChange={handleChange}
        style={styles.select}
        className="art-deco-select"
      >
        <option value="">-- Select a Preset --</option>
        {PRESETS.map(preset => (
          <option key={preset.id} value={preset.id}>
            {preset.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginBottom: 'var(--space-xl)'
  },
  label: {
    color: 'var(--gold-primary)',
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '0.15rem',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 'var(--space-sm)'
  },
  select: {
    width: '100%',
    padding: 'var(--space-md)',
    background: 'var(--black-input)',
    color: 'var(--cream-text)',
    border: '2px solid var(--gold-primary)',
    fontSize: '1rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)'
  }
};
