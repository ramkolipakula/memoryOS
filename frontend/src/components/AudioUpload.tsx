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
    <div className="flex flex-col gap-lg">
      <section 
        className={`bg-surface-container-low rounded-xl border border-dashed p-xl flex flex-col items-center justify-center gap-md cursor-pointer transition-colors min-h-[240px]
          ${dragOver ? 'border-primary bg-surface-container' : 'border-outline hover:bg-surface-container'}
        `}
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
        />
        <span className={`material-symbols-outlined text-[48px] ${dragOver ? 'text-primary' : 'text-primary'}`}>
          {dragOver ? 'cloud_upload' : 'mic'}
        </span>
        <div className="text-center">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {dragOver ? 'Drop Audio Here' : 'Upload Audio'}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Drag and drop audio files or click to browse
          </p>
          <p className="font-mono-sm text-mono-sm text-outline mt-2">
            MP3, WAV, M4A, OGG • Max 50MB
          </p>
        </div>
      </section>

      {error && (
        <div className="p-sm bg-error-container/20 border border-error/50 rounded-lg text-error flex gap-2 items-center">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="font-body-md text-body-md">{error}</span>
        </div>
      )}

      {selectedFile && !error && (
        <div className="bg-surface-container rounded-lg border border-outline-variant p-md flex flex-col gap-md animate-slide-up">
          <div className="flex items-center gap-sm justify-between">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-[24px]">audio_file</span>
              <div>
                <p className="font-headline-md text-headline-md text-on-surface">{selectedFile.name}</p>
                <p className="font-mono-sm text-mono-sm text-on-surface-variant">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            {!isUploading && (
              <button 
                onClick={handleUpload} 
                disabled={disabled}
                className="bg-primary text-on-primary font-label-md text-label-md py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                Upload & Transcribe
              </button>
            )}
          </div>

          {audioUrl && (
            <audio controls src={audioUrl} className="w-full h-10 mt-2 opacity-80" />
          )}

          {isUploading && (
            <div className="flex flex-col gap-xs mt-2">
              <div className="flex justify-between items-center">
                <span className="font-mono-sm text-mono-sm text-on-surface-variant">Uploading & Transcribing...</span>
                <span className="font-mono-sm text-mono-sm text-primary">{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
