import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Header from './components/Header'
import FileInput from './components/FileInput'
import CompressionPanel from './components/CompressionPanel'
import VideoPreview from './components/VideoPreview'
import { DEFAULT_SETTINGS } from './components/types'
import type { CompressionSettings } from './components/types'

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/optimize'
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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
      <Header />

      <section className="card">
        <form onSubmit={handleSubmit} className="form">
          <FileInput selectedFile={selectedFile} onChange={handleFileChange} />

          <CompressionPanel settings={settings} onChange={setSettings} />

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
        <VideoPreview
          title="Original"
          videoUrl={originalUrl}
          placeholder="Select a video to preview."
        />
        <VideoPreview
          title="Optimized"
          videoUrl={optimizedUrl}
          placeholder="When optimization is complete, you'll see the result here."
          downloadLabel="Download optimized video"
        />
      </section>
    </div>
  )
}

export default App
