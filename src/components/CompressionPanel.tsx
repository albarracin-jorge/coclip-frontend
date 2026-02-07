import { useState } from 'react'
import {
  AUDIO_BITRATES,
  DEFAULT_SETTINGS,
  PRESETS,
  RESOLUTIONS,
} from './types'
import type { CompressionSettings } from './types'

interface CompressionPanelProps {
  settings: CompressionSettings
  onChange: (settings: CompressionSettings) => void
}

export default function CompressionPanel({
  settings,
  onChange,
}: CompressionPanelProps) {
  const [open, setOpen] = useState(false)

  const update = (patch: Partial<CompressionSettings>) =>
    onChange({ ...settings, ...patch })

  return (
    <>
      <button
        type="button"
        className="button--ghost settings-toggle"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '▲ Hide settings' : '▼ Compression Settings'}
      </button>

      {open && (
        <div className="settings">
          <div className="settings__grid">
            <div className="settings__field">
              <label htmlFor="crf">
                Quality (CRF): <strong>{settings.crf}</strong>
              </label>
              <input
                id="crf"
                type="range"
                min={0}
                max={51}
                value={settings.crf}
                onChange={(e) => update({ crf: Number(e.target.value) })}
              />
              <span className="settings__hint">
                0 = lossless · 51 = lowest quality
              </span>
            </div>

            <div className="settings__field">
              <label htmlFor="preset">Encoding Preset</label>
              <select
                id="preset"
                value={settings.preset}
                onChange={(e) => update({ preset: e.target.value })}
              >
                {PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <span className="settings__hint">
                Slower = better compression
              </span>
            </div>

            <div className="settings__field">
              <label htmlFor="width">Resolution</label>
              <select
                id="width"
                value={settings.width}
                onChange={(e) => update({ width: Number(e.target.value) })}
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="settings__field">
              <label htmlFor="fps">Framerate (FPS)</label>
              <input
                id="fps"
                type="number"
                min={1}
                max={120}
                value={settings.fps}
                onChange={(e) => update({ fps: Number(e.target.value) })}
              />
            </div>

            <div className="settings__field">
              <label htmlFor="videoCodec">Video Codec</label>
              <select
                id="videoCodec"
                value={settings.videoCodec}
                onChange={(e) => update({ videoCodec: e.target.value })}
              >
                <option value="libx264">H.264 (libx264)</option>
                <option value="libx265">H.265 / HEVC (libx265)</option>
              </select>
            </div>

            <div className="settings__field">
              <label htmlFor="audioCodec">Audio Codec</label>
              <select
                id="audioCodec"
                value={settings.audioCodec}
                onChange={(e) => update({ audioCodec: e.target.value })}
              >
                <option value="aac">AAC</option>
                <option value="libopus">Opus</option>
              </select>
            </div>

            <div className="settings__field">
              <label htmlFor="audioBitrate">Audio Bitrate</label>
              <select
                id="audioBitrate"
                value={settings.audioBitrate}
                onChange={(e) => update({ audioBitrate: e.target.value })}
              >
                {AUDIO_BITRATES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="button--ghost settings__reset"
            onClick={() => onChange({ ...DEFAULT_SETTINGS })}
          >
            Reset to defaults
          </button>
        </div>
      )}
    </>
  )
}
