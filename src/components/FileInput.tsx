interface FileInputProps {
  selectedFile: File | null
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileInput({ selectedFile, onChange }: FileInputProps) {
  return (
    <label className="file-input">
      <input
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/avi"
        onChange={onChange}
      />
      <span>
        {selectedFile
          ? `File: ${selectedFile.name}`
          : 'Select a video (.mp4, .webm, .avi, .mov)'}
      </span>
    </label>
  )
}
