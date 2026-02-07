# Coclip Frontend

React + Vite interface to upload a video to the API and receive the optimized version.

## Requirements

- Node.js 18+
- The development API must be available at `http://localhost:3000/optimize`

## Setup

1. Copy the example file and add your API key.

```
VITE_API_KEY=your-api-key-here
```

2. (Optional) If you need to point to a different endpoint:

```
VITE_API_URL=http://localhost:3000/optimize
```

## Usage

- Select a video from the form.
- Press **Optimize Video** to send it to the API.
- Once complete, you can preview and download the optimized file.

## Compression Settings

The frontend now supports parameterized compression configuration:

- **Quality (CRF)**: 0–51 (lower = better quality, larger file)
- **Encoding Preset**: ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow (slower = better compression)
- **Resolution**: 480p, 720p, 1080p, 1440p, 4K
- **Framerate (FPS)**: 1–120
- **Video Codec**: H.264 (libx264) or H.265 / HEVC (libx265)
- **Audio Codec**: AAC or Opus
- **Audio Bitrate**: 64k, 96k, 128k, 192k, 256k, 320k

### How to Use Compression Settings

1. Click the **"▼ Compression Settings"** button to expand the settings panel.
2. Adjust the parameters to your preference:
   - Use the **Quality slider** for CRF (range 0–51)
   - Select from dropdown menus for preset, resolution, codecs, and audio bitrate
   - Enter custom FPS value directly
3. Click **"Reset to defaults"** to restore original settings at any time.
4. Click **"Optimize Video"** to apply the compression settings and process your video.

All parameters are sent to the API and validated before processing.

### API Integration

The compression parameters are sent via `FormData` as form fields:

```javascript
formData.append('crf', String(settings.crf))
formData.append('preset', settings.preset)
formData.append('width', String(settings.width))
formData.append('fps', String(settings.fps))
formData.append('audioBitrate', settings.audioBitrate)
formData.append('videoCodec', settings.videoCodec)
formData.append('audioCodec', settings.audioCodec)
```

The API validates each parameter and applies safe defaults if invalid values are received.

> Note: The frontend sends the file in `FormData` with the `video` field and adds the `x-api-key` header with the value of `VITE_API_KEY`. All compression parameters are sent as additional form fields.
