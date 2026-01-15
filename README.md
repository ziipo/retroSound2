# RetroSound - Vintage Vinyl Audio Effects

A web-based audio effects processor that recreates the authentic sound of vintage vinyl records, with a stunning gold-on-black Art Deco aesthetic.

## Features

### 🎵 12 Audio Effects

- **Surface Damage** - Random dropouts simulating scratched vinyl
- **Deterioration** - Overall degradation of the record
- **Crackle** - Vinyl surface noise with 24 authentic crackle sound variations
- **Vinyl Warp** - Playback speed wobble from warped records
- **Age Filter** - High-frequency rolloff (200-8000Hz range)
- **RIAA De-emphasis** - Industry-standard vinyl equalization curve
- **Stylus Resonance** - Harmonic peaks at 10kHz, 14kHz, 17kHz
- **Stylus Pinch** - High-frequency compression
- **Ghost Echo** - Multi-tap delay simulating groove bleed
- **Worn Stylus** - High-frequency dulling with modulated allpass filters
- **Inner Groove Distortion** - Tracking error distortion
- **Spindle Eccentricity** - Pitch modulation from off-center pressing

### 🎨 9 Curated Presets

1. **Original** - Pristine vinyl
2. **Warm Vintage** - Warm, well-preserved
3. **Worn and aged** - Heavy wear
4. **Jazz Club** - Smoky jazz club atmosphere
5. **Early Phonograph** - Early 1900s phonograph
6. **Super LoFi** - Lo-fi degradation
7. **Vintage Folk** - Vintage folk aesthetic
8. **Latin Spin** - South American archive
9. **Max Deterioration** - Maximum deterioration

### 🎛️ Additional Features

- **Drag & Drop Audio Upload** - Supports MP3, WAV, OGG, FLAC, M4A
- **Real-time Processing** - All effects applied using Web Audio API
- **Pitch Shifting** - ±12 semitones (coming soon)
- **WAV Export** - Download processed audio
- **Gold-on-Black Art Deco UI** - Beautiful, distinctive interface

## Technical Implementation

### Audio Processing Architecture

All audio effects use the **Web Audio API**:

```
Source → Stereo Balance → Vinyl Damage → RIAA → Age Filter →
Ghost Echo → Worn Stylus → Stylus Resonance → Pinch →
Inner Groove → Spindle Eccentricity → Master → Output
                                      ↑
                               Crackle Mix
```

### Key Technologies

- **React 18** + **TypeScript** for UI
- **Vite** for fast development and building
- **Web Audio API** for real-time audio processing
- **Zero external audio libraries** - pure Web Audio implementation

### Effect Specifications

**RIAA De-emphasis Filter:**
- Low shelf @ 50.05Hz: +17dB
- Peaking @ 500.5Hz: -8.5dB
- High shelf @ 2122Hz: -13.7dB

**Stylus Resonance:**
- Primary @ 17kHz, Q=4.5
- Secondary @ 14kHz, Q=3.5
- Tertiary @ 10kHz, Q=2.5

**Spindle Eccentricity (Warp):**
- LFO1: 0.3Hz, gain 0.02×intensity
- LFO2: 2.5Hz, gain 0.01×intensity
- LFO3: 8Hz, gain 0.005×intensity

## Getting Started

### Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Upload Audio** - Drag and drop an audio file or click to browse
2. **Select Preset** - Choose from 9 curated presets for instant vintage character
3. **Fine-tune Effects** - Adjust individual parameters for custom sound
4. **Export** - Download your processed audio as WAV

## Project Structure

```
src/
├── audio/
│   ├── core/           # AudioEngine, AudioEffect base class
│   ├── effects/        # All 10 audio effects
│   ├── processors/     # Crackle, Master, WAV Export
│   └── utils/          # Audio utilities
├── components/
│   ├── layout/         # Header, layout components
│   ├── upload/         # Audio uploader
│   ├── controls/       # Playback, sliders, presets
│   └── effects/        # Effects panel
├── hooks/              # React hooks (useAudioEngine)
├── presets/            # Preset definitions
├── styles/             # Global & Art Deco CSS
└── types/              # TypeScript types
```

## Implementation Details

### Exact Algorithm Reproduction

- **Filter frequencies** match exactly (50.05Hz, 500.5Hz, 2122Hz for RIAA)
- **LFO rates** replicate the original (0.13Hz, 0.27Hz for age filter modulation)
- **Preset parameters** extracted from the original site
- **Effect chain order** follows specific signal flow
- **Crackle system** uses 24 sound variations from the original

### Web Audio Graph

Each effect is a class extending `AudioEffect` with `input` and `output` gain nodes. The `AudioEngine` orchestrates the entire chain, managing playback, parameter updates, and export.

---

**RetroSound** - Bringing vintage vinyl warmth to modern audio production
