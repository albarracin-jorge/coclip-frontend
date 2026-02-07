import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/optimize'
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined

interface CompressionSettings {
  crf: number
  preset: string
  width: number
  fps: number
  audioBitrate: string
  videoCodec: string
  audioCodec: string
}

const DEFAULT_SETTINGS: CompressionSettings = {
  crf: 30,
  preset: 'slow',
  width: 854,
  fps: 24,
  audioBitrate: '96k',
  videoCodec: 'libx264',
  audioCodec: 'aac',
}

const PRESETS = [
  'ultrafast',
  'superfast',
  'veryfast',
  'faster',
  'fast',
  'medium',
  'slow',
  'slower',
  'veryslow',
]

const RESOLUTIONS = [
  { label: '480p (854px)', value: 854 },
  { label: '720p (1280px)', value: 1280 },
  { label: '1080p (1920px)', value: 1920 },
  { label: '1440p (2560px)', value: 2560 },
  { label: '4K (3840px)', value: 3840 },
]

const AUDIO_BITRATES = ['64k', '96k', '128k', '192k', '256k', '320k']

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<CompressionSettings>({ ...DEFAULT_SETTINGS })

  useEffect(() => {
    if (!selectedFile) {
      setOriginalUrl(null)
      return
    }

    const url = URL.createObjectURL(selectedFile)
    setOriginalUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [selectedFile])

  useEffect(() => {
    return () => {
      if (optimizedUrl) {
        URL.revokeObjectURL(optimizedUrl)
      }
    }
  }, [optimizedUrl])

  const canSubmit = useMemo(
    () => Boolean(selectedFile) && !isUploading,
    [selectedFile, isUploading],
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setOptimizedUrl(null)
    setErrorMessage(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedFile || isUploading) {
      return
    }

    setIsUploading(true)
    setErrorMessage(null)
    setOptimizedUrl(null)

    try {
      const formData = new FormData()
      formData.append('video', selectedFile, selectedFile.name)

      // Append compression settings
      formData.append('crf', String(settings.crf))
      formData.append('preset', settings.preset)
      formData.append('width', String(settings.width))
      formData.append('fps', String(settings.fps))
      formData.append('audioBitrate', settings.audioBitrate)
      formData.append('videoCodec', settings.videoCodec)
      formData.append('audioCodec', settings.audioCodec)

      const headers: HeadersInit = {}
      if (API_KEY) {
        headers['x-api-key'] = API_KEY
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          errorText || `The API responded with status ${response.status}.`,
        )
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setOptimizedUrl(url)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.'
      setErrorMessage(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Video Optimizer</p>
          <h1>Upload a video and get the optimized version</h1>
        </div>
        <p className="app__subtitle">
          Send your file to the API and download the result in seconds.
        </p>
      </header>

      <section className="card">
        <form onSubmit={handleSubmit} className="form">
          <label className="file-input">
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleFileChange}
            />
            <span>
              {selectedFile
                ? `File: ${selectedFile.name}`
                : 'Select a video (.mp4, .webm)'}
            </span>
          </label>

          <button
            type="button"
            className="button--ghost settings-toggle"
            onClick={() => setShowSettings((s) => !s)}
          >
            {showSettings ? '▲ Hide settings' : '▼ Compression Settings'}
          </button>

          {showSettings && (
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
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, crf: Number(e.target.value) }))
                    }
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
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, preset: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, width: Number(e.target.value) }))
                    }
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
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, fps: Number(e.target.value) }))
                    }
                  />
                </div>

                <div className="settings__field">
                  <label htmlFor="videoCodec">Video Codec</label>
                  <select
                    id="videoCodec"
                    value={settings.videoCodec}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, videoCodec: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, audioCodec: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, audioBitrate: e.target.value }))
                    }
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
                onClick={() => setSettings({ ...DEFAULT_SETTINGS })}
              >
                Reset to defaults
              </button>
            </div>
          )}

          <div className="form__actions">
            <button type="submit" disabled={!canSubmit}>
              {isUploading ? 'Optimizing…' : 'Optimize Video'}
            </button>
            {selectedFile && (
              <button
                type="button"
                className="button--ghost"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Remove file
              </button>
            )}
          </div>
        </form>

        {errorMessage && <p className="alert">{errorMessage}</p>}

        {!API_KEY && (
          <p className="hint">
            Add the <strong>VITE_API_KEY</strong> variable in your
            <code>.env</code> file to send the custom header.
          </p>
        )}
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Original</h2>
          {originalUrl ? (
            <video
              controls
              src={originalUrl}
              className="video"
              preload="metadata"
            />
          ) : (
            <p className="placeholder">Select a video to preview.</p>
          )}
        </div>
        <div className="panel">
          <h2>Optimized</h2>
          {optimizedUrl ? (
            <>
              <video
                controls
                src={optimizedUrl}
                className="video"
                preload="metadata"
              />
              <a className="download" href={optimizedUrl} download>
                Download optimized video
              </a>
            </>
          ) : (
            <p className="placeholder">
              When optimization is complete, you'll see the result here.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
