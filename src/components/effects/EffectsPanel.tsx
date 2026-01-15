import React from 'react';
import { EffectSlider } from '../controls/EffectSlider';
import type { EffectParameters } from '../../types/audio.types';

interface EffectsPanelProps {
  parameters: EffectParameters;
  onParameterChange: (effectId: keyof EffectParameters, value: number) => void;
}

export const EffectsPanel: React.FC<EffectsPanelProps> = ({ parameters, onParameterChange }) => {
  return (
    <div className="art-deco-panel geometric-bg" style={styles.panel}>
      <h2 style={styles.heading} className="gold-gradient-text">
        EFFECTS
      </h2>
      <div className="gold-divider"></div>

      {/* Surface Characteristics */}
      <div style={styles.group}>
        <h3 style={styles.groupTitle}>Surface Characteristics</h3>
        <EffectSlider
          label="Dropout"
          value={parameters.dropout}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('dropout', v)}
        />
        <EffectSlider
          label="Deterioration"
          value={parameters.deterioration}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('deterioration', v)}
        />
        <EffectSlider
          label="Crackle"
          value={parameters.crackle}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('crackle', v)}
        />
      </div>

      <div className="gold-divider"></div>

      {/* Playback Mechanics */}
      <div style={styles.group}>
        <h3 style={styles.groupTitle}>Playback Mechanics</h3>
        <EffectSlider
          label="Vinyl Warp"
          value={parameters.warp}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('warp', v)}
        />
        <EffectSlider
          label="Spindle Eccentricity"
          value={parameters.spindle}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('spindle', v)}
        />
      </div>

      <div className="gold-divider"></div>

      {/* Frequency Response */}
      <div style={styles.group}>
        <h3 style={styles.groupTitle}>Frequency Response</h3>
        <EffectSlider
          label="Age Filter"
          value={parameters.age}
          min={200}
          max={8000}
          step={100}
          unit="Hz"
          onChange={v => onParameterChange('age', v)}
        />
        <EffectSlider
          label="RIAA De-emphasis"
          value={parameters.riaa}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('riaa', v)}
        />
      </div>

      <div className="gold-divider"></div>

      {/* Stylus Characteristics */}
      <div style={styles.group}>
        <h3 style={styles.groupTitle}>Stylus Characteristics</h3>
        <EffectSlider
          label="Stylus Resonance"
          value={parameters.stylus}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('stylus', v)}
        />
        <EffectSlider
          label="Stylus Pinch"
          value={parameters.pinch}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('pinch', v)}
        />
        <EffectSlider
          label="Worn Stylus"
          value={parameters.wornStylus}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('wornStylus', v)}
        />
      </div>

      <div className="gold-divider"></div>

      {/* Spatial & Distortion */}
      <div style={styles.group}>
        <h3 style={styles.groupTitle}>Spatial & Distortion</h3>
        <EffectSlider
          label="Ghost Echo"
          value={parameters.ghostEcho}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('ghostEcho', v)}
        />
        <EffectSlider
          label="Inner Groove Distortion"
          value={parameters.innerGroove}
          min={0}
          max={1}
          step={0.01}
          onChange={v => onParameterChange('innerGroove', v)}
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    maxHeight: '80vh',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  heading: {
    fontSize: '1.5rem',
    letterSpacing: '0.3rem',
    fontFamily: 'var(--font-display)',
    textAlign: 'center',
    marginBottom: 'var(--space-md)'
  },
  group: {
    marginBottom: 'var(--space-lg)'
  },
  groupTitle: {
    color: 'var(--gold-light)',
    fontSize: '1rem',
    letterSpacing: '0.1rem',
    textTransform: 'uppercase',
    marginBottom: 'var(--space-md)',
    fontWeight: 600
  }
};
