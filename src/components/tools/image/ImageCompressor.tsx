import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, RefreshCw, Sliders, CheckCircle2, ShieldCheck, ArrowRight, Zap, FileText } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../context/ToastContext';

export const ImageCompressor: React.FC = () => {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressedDimensions, setCompressedDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [quality, setQuality] = useState<number>(75); // 5% to 100%
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Handle image upload
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Invalid File', 'Please upload a valid image file (JPG, PNG, or WebP).', 'error');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      addToast('File Too Large', 'Maximum supported file size is 50MB.', 'error');
      return;
    }

    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    // Get original dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setMaxWidth(img.naturalWidth);
    };
    img.src = url;

    // Detect format
    if (file.type === 'image/png') setFormat('image/png');
    else if (file.type === 'image/webp') setFormat('image/webp');
    else setFormat('image/jpeg');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Re-compress when parameters change
  useEffect(() => {
    if (!originalUrl || !originalDimensions.width) return;

    const compressImage = async () => {
      setIsProcessing(true);
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = originalUrl;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Calculate aspect ratio scaled dimensions
        let targetWidth = originalDimensions.width;
        let targetHeight = originalDimensions.height;

        if (maxWidth && targetWidth > maxWidth) {
          const ratio = maxWidth / targetWidth;
          targetWidth = maxWidth;
          targetHeight = Math.round(originalDimensions.height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Canvas context unavailable');

        // Draw image onto canvas
        ctx.fillStyle = '#FFFFFF';
        if (format === 'image/jpeg') {
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedBlob(blob);
              setCompressedSize(blob.size);
              setCompressedDimensions({ width: targetWidth, height: targetHeight });

              if (compressedUrl) URL.revokeObjectURL(compressedUrl);
              setCompressedUrl(URL.createObjectURL(blob));
            }
            setIsProcessing(false);
          },
          format,
          quality / 100
        );
      } catch (err) {
        console.error('Compression error:', err);
        addToast('Compression Failed', 'Unable to compress image in browser.', 'error');
        setIsProcessing(false);
      }
    };

    const timer = setTimeout(compressImage, 150);
    return () => clearTimeout(timer);
  }, [originalUrl, quality, format, maxWidth, originalDimensions]);

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Reduction percentage
  const savedPercentage = originalFile && compressedSize
    ? Math.max(0, Math.round(((originalFile.size - compressedSize) / originalFile.size) * 100))
    : 0;

  // Download compressed image
  const handleDownload = () => {
    if (!compressedBlob || !originalFile) return;

    const extension = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
    const originalName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || 'image';
    const fileName = `${originalName}-compressed.${extension}`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Download Started', `Saved ${fileName} (${formatBytes(compressedSize)})`, 'success');
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />

      {!originalUrl ? (
        /* Upload Dropzone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-3xl glass-card border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 min-h-[380px] flex flex-col items-center justify-center shadow-xl ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/40 scale-[1.01] ring-4 ring-cyan-500/20'
              : 'border-slate-800 hover:border-cyan-400/50 bg-slate-900/90'
          }`}
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-xl shadow-cyan-950/30">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">Upload Image to Compress</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Drag & drop JPG, PNG, or WebP images here, or browse from your device.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<ImageIcon className="w-4 h-4" />}
              >
                Select Image
              </Button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% In-Browser Execution. Files never leave your RAM.</span>
            </div>
          </div>
        </div>
      ) : (
        /* Compression Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Compression Settings</span>
                </h4>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Image</span>
                </button>
              </div>

              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-300">Compression Quality</span>
                  <span className="font-mono text-cyan-400 font-bold">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Smallest Size</span>
                  <span>Balanced</span>
                  <span>Max Quality</span>
                </div>
              </div>

              {/* Output Format Selector */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium block">Target Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'image/jpeg', label: 'JPG / JPEG' },
                    { id: 'image/webp', label: 'WebP (Best)' },
                    { id: 'image/png', label: 'PNG' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormat(f.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        format === f.id
                          ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Width Resize Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-300">Max Resolution Width</span>
                  <span className="font-mono text-cyan-400 font-bold">{maxWidth}px</span>
                </div>
                <input
                  type="range"
                  min="320"
                  max={originalDimensions.width || 3840}
                  step="10"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Compression Stats Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Original Size:</span>
                  <span className="text-slate-200 font-bold">{originalFile ? formatBytes(originalFile.size) : '0 KB'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Compressed Size:</span>
                  <span className="text-cyan-300 font-bold">{formatBytes(compressedSize)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Space Saved:</span>
                  <span className="text-emerald-400 font-extrabold text-sm flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-emerald-400" />
                    <span>-{savedPercentage}%</span>
                  </span>
                </div>
              </div>

              {/* Primary Download Button */}
              <Button
                variant="primary"
                size="md"
                className="w-full py-3"
                onClick={handleDownload}
                isLoading={isProcessing}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download Compressed Image
              </Button>
            </div>
          </div>

          {/* Side-by-Side Visual Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Card */}
              <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
                  <span className="text-slate-300 font-bold">Original Image</span>
                  <span className="text-slate-400">{originalDimensions.width}x{originalDimensions.height}px</span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-64 flex items-center justify-center p-2">
                  <img src={originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="text-center text-xs font-mono text-slate-400">
                  {originalFile ? formatBytes(originalFile.size) : ''}
                </div>
              </div>

              {/* Compressed Card */}
              <div className="rounded-2xl glass-card border border-cyan-500/30 bg-slate-900/90 p-4 space-y-3 shadow-lg shadow-cyan-950/20">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Compressed Result</span>
                  </span>
                  <span className="text-cyan-400">{compressedDimensions.width}x{compressedDimensions.height}px</span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/20 h-64 flex items-center justify-center p-2">
                  {compressedUrl ? (
                    <img src={compressedUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="animate-pulse text-xs text-slate-500">Compressing...</div>
                  )}
                </div>
                <div className="text-center text-xs font-mono font-bold text-emerald-400">
                  {formatBytes(compressedSize)} (-{savedPercentage}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
