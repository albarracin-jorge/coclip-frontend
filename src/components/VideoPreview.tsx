interface VideoPreviewProps {
  title: string
  videoUrl: string | null
  placeholder: string
  downloadLabel?: string
}

export default function VideoPreview({
  title,
  videoUrl,
  placeholder,
  downloadLabel,
}: VideoPreviewProps) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      {videoUrl ? (
        <>
          <video
            controls
            src={videoUrl}
            className="video"
            preload="metadata"
          />
          {downloadLabel && (
            <a className="download" href={videoUrl} download>
              {downloadLabel}
            </a>
          )}
        </>
      ) : (
        <p className="placeholder">{placeholder}</p>
      )}
    </div>
  )
}
