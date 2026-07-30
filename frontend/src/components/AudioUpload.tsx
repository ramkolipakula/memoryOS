import { useState, useRef, useCallback } from 'react';

interface AudioUploadProps {
  onUploadStart: (file: File) => void;
  uploadProgress: number;
  isUploading: boolean;
  disabled: boolean;
}

const ALLOWED_TYPES = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav',
  'audio/m4a', 'audio/x-m4a', 'audio/mp4',
  'audio/ogg', 'audio/flac', 'audio/webm',
];

const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'webm'];

export default function AudioUpload({ onUploadStart, uploadProgress, isUploading, disabled }: AudioUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      setError(`Unsupported format. Supported: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;
    setSelectedFile(file);

    // Create audio preview URL
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(URL.createObjectURL(file));
  }, [audioUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleUpload = () => {
    if (selectedFile) {
      onUploadStart(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="glass-card p-6 animate-slide-up" id="audio-upload-section">
      <h2 className="section-title">
        <span className="text-2xl">🎵</span>
        Upload Audio
      </h2>

      {/* Drop Zone */}
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".mp3,.wav,.m4a,.ogg,.flac,.webm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          disabled={disabled}
          id="audio-file-input"
        />

        <div className={`animate-float ${dragOver ? 'scale-110' : ''} transition-transform`}>
          <svg className="w-16 h-16 mx-auto mb-4 text-neural-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="text-neural-200 font-medium mb-2">
          {dragOver ? 'Drop your audio file here' : 'Drag & drop your audio file here'}
        </p>
        <p className="text-neural-400 text-sm">
          or <span className="text-synapse-400 font-semibold cursor-pointer hover:underline">browse files</span>
        </p>
        <p className="text-neural-500 text-xs mt-3">
          Supports MP3, WAV, M4A, OGG, FLAC, WebM • Max 50MB
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-forget-500/10 border border-forget-500/30 rounded-xl text-forget-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Selected File Info */}
      {selectedFile && !error && (
        <div className="mt-5 animate-slide-up">
          <div className="flex items-center gap-4 p-4 bg-neural-700/50 rounded-xl border border-neural-500/30">
            <div className="w-12 h-12 bg-synapse-500/15 rounded-xl flex items-center justify-center">
              <span className="text-xl">🎧</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-neural-100 font-medium truncate">{selectedFile.name}</p>
              <p className="text-neural-400 text-sm">{formatFileSize(selectedFile.size)}</p>
            </div>
            {!isUploading && (
              <button
                className="btn-primary"
                onClick={handleUpload}
                disabled={disabled}
                id="upload-button"
              >
                Upload & Transcribe
              </button>
            )}
          </div>

          {/* Audio Preview */}
          {audioUrl && (
            <div className="mt-4">
              <audio
                controls
                src={audioUrl}
                className="w-full rounded-lg"
                style={{ height: '40px' }}
                id="audio-preview"
              />
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neural-300">Uploading & Transcribing...</span>
                <span className="text-synapse-400 font-semibold">{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
