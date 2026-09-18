import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Camera, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PassportUploaderProps {
  onImageSelected: (file: File) => void;
  loading?: boolean;
}

export const PassportUploader: React.FC<PassportUploaderProps> = ({
  onImageSelected,
  loading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateAndProcess = (file: File) => {
    setFileError(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type.toLowerCase())) {
      setFileError('Unsupported file format. Please upload JPG, JPEG, PNG, or WebP.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setFileError('File is too large (max 25MB). Please choose a smaller photo.');
      return;
    }

    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            validateAndProcess(e.target.files[0]);
          }
        }}
      />

      {/* Main Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : 'border-slate-700/80 hover:border-cyan-500/60 bg-slate-900/60 hover:bg-slate-900/90'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-transform">
            <Camera className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Upload Your Portrait Photo
            </h3>
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
              Drag & drop your portrait photo here, or click to browse from your device
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-cyan-300">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>JPG • JPEG • PNG • WEBP (Up to 25MB)</span>
          </div>

          <button
            type="button"
            disabled={loading}
            className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Select Photo from Device</span>
          </button>
        </div>
      </div>

      {fileError && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">Neutral Face Expression</span>
            <span className="text-slate-400 text-[11px]">Look straight into the camera with both eyes open.</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">Balanced Even Lighting</span>
            <span className="text-slate-400 text-[11px]">Avoid harsh facial shadows or strong backlights.</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block">100% Client-Side Privacy</span>
            <span className="text-slate-400 text-[11px]">Your original face reference is locked and never shared.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
