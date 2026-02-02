import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/optimize'
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
          errorText || `La API respondió con el estado ${response.status}.`,
        )
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setOptimizedUrl(url)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado.'
      setErrorMessage(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Optimizador de video</p>
          <h1>Sube un video y recibe la versión optimizada</h1>
        </div>
        <p className="app__subtitle">
          Envía tu archivo a la API y descarga el resultado en segundos.
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
                ? `Archivo: ${selectedFile.name}`
                : 'Selecciona un video (.mp4, .webm)'}
            </span>
          </label>

          <div className="form__actions">
            <button type="submit" disabled={!canSubmit}>
              {isUploading ? 'Optimizando…' : 'Optimizar video'}
            </button>
            {selectedFile && (
              <button
                type="button"
                className="button--ghost"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Quitar archivo
              </button>
            )}
          </div>
        </form>

        {errorMessage && <p className="alert">{errorMessage}</p>}

        {!API_KEY && (
          <p className="hint">
            Agrega la variable <strong>VITE_API_KEY</strong> en tu archivo
            <code>.env</code> para enviar el header personalizado.
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
            <p className="placeholder">Selecciona un video para previsualizar.</p>
          )}
        </div>
        <div className="panel">
          <h2>Optimizado</h2>
          {optimizedUrl ? (
            <>
              <video
                controls
                src={optimizedUrl}
                className="video"
                preload="metadata"
              />
              <a className="download" href={optimizedUrl} download>
                Descargar video optimizado
              </a>
            </>
          ) : (
            <p className="placeholder">
              Cuando termines la optimización, verás el resultado aquí.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
