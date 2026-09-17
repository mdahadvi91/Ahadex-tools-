import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Trash2, MoveUp, MoveDown, RotateCw, FileText, Sliders, ShieldCheck, CheckCircle2, Plus } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Button } from '../../ui/Button';
import { useToast } from '../../../context/ToastContext';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  rotation: number; // 0, 90, 180, 270
}

export const ImageToPdfConverter: React.FC = () => {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'medium'>('small');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Handle image files addition
  const handleFilesAdded = (files: FileList | File[]) => {
    const newItems: ImageItem[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
          rotation: 0,
        });
      }
    });

    if (newItems.length === 0) {
      addToast('No Valid Images', 'Please select JPG, PNG, or WebP images.', 'error');
      return;
    }

    setImages((prev) => [...prev, ...newItems]);
    addToast('Images Added', `Added ${newItems.length} image(s) to document queue.`, 'success');
  };

  // Move image up/down
  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) return;

    const newArr = [...images];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setImages(newArr);
  };

  // Rotate image
  const rotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  // Remove image
  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  // Generate PDF
  const handleGeneratePdf = async () => {
    if (images.length === 0) {
      addToast('No Images Selected', 'Please upload at least one image to convert.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      let doc: jsPDF | null = null;

      const marginPx = margin === 'none' ? 0 : margin === 'small' ? 10 : 20;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];

        // Load image onto offscreen canvas to handle rotation
        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((res) => { img.onload = res; });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (item.rotation % 180 === 90) {
          canvas.width = img.naturalHeight;
          canvas.height = img.naturalWidth;
        } else {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }

        if (ctx) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((item.rotation * Math.PI) / 180);
          ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        }

        const rotatedImgData = canvas.toDataURL('image/jpeg', 0.92);

        if (i === 0) {
          if (pageSize === 'fit') {
            doc = new jsPDF({
              orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
              unit: 'px',
              format: [canvas.width, canvas.height],
            });
            doc.addImage(rotatedImgData, 'JPEG', 0, 0, canvas.width, canvas.height);
          } else {
            doc = new jsPDF({
              orientation,
              unit: 'mm',
              format: pageSize,
            });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const printableW = pageWidth - marginPx * 2;
            const printableH = pageHeight - marginPx * 2;

            const imgAspect = canvas.width / canvas.height;
            let drawW = printableW;
            let drawH = drawW / imgAspect;

            if (drawH > printableH) {
              drawH = printableH;
              drawW = drawH * imgAspect;
            }

            const x = (pageWidth - drawW) / 2;
            const y = (pageHeight - drawH) / 2;

            doc.addImage(rotatedImgData, 'JPEG', x, y, drawW, drawH);
          }
        } else if (doc) {
          if (pageSize === 'fit') {
            doc.addPage([canvas.width, canvas.height], canvas.width > canvas.height ? 'landscape' : 'portrait');
            doc.addImage(rotatedImgData, 'JPEG', 0, 0, canvas.width, canvas.height);
          } else {
            doc.addPage(pageSize, orientation);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const printableW = pageWidth - marginPx * 2;
            const printableH = pageHeight - marginPx * 2;

            const imgAspect = canvas.width / canvas.height;
            let drawW = printableW;
            let drawH = drawW / imgAspect;

            if (drawH > printableH) {
              drawH = printableH;
              drawW = drawH * imgAspect;
            }

            const x = (pageWidth - drawW) / 2;
            const y = (pageHeight - drawH) / 2;

            doc.addImage(rotatedImgData, 'JPEG', x, y, drawW, drawH);
          }
        }
      }

      if (doc) {
        doc.save(`converted-document-${Date.now()}.pdf`);
        addToast('PDF Generated', 'Successfully created and downloaded your PDF file!', 'success');
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      addToast('PDF Generation Error', 'Failed to generate PDF document.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
      />

      {images.length === 0 ? (
        /* Empty Upload Zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) handleFilesAdded(e.dataTransfer.files);
          }}
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
              <h3 className="text-lg font-bold text-slate-100">Upload Images to Convert to PDF</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Select or drop multiple JPG, PNG, or WebP images to merge into a single PDF document.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Images
              </Button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% In-Browser Local Execution. Files are never stored or uploaded.</span>
            </div>
          </div>
        </div>
      ) : (
        /* PDF Converter Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Document Settings Panel */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>PDF Document Options</span>
                </h4>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
              </div>

              {/* Page Size */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium block">Page Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'a4', label: 'A4 Standard' },
                    { id: 'letter', label: 'US Letter' },
                    { id: 'fit', label: 'Fit Image' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPageSize(p.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        pageSize === p.id
                          ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Orientation */}
              {pageSize !== 'fit' && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium block">Page Orientation</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'portrait', label: 'Portrait' },
                      { id: 'landscape', label: 'Landscape' },
                    ].map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setOrientation(o.id as any)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          orientation === o.id
                            ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Margin */}
              {pageSize !== 'fit' && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium block">Page Margins</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'none', label: 'No Margin' },
                      { id: 'small', label: 'Small Margin' },
                      { id: 'medium', label: 'Medium Margin' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMargin(m.id as any)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          margin === m.id
                            ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Summary */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Total Pages:</span>
                  <span className="text-cyan-300 font-bold">{images.length} Page(s)</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="md"
                className="w-full py-3"
                onClick={handleGeneratePdf}
                isLoading={isGenerating}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Convert & Download PDF
              </Button>
            </div>
          </div>

          {/* Reorderable Image Page Queue */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>PDF Pages Order ({images.length})</span>
              <span>Drag or use buttons to reorder</span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {images.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-3.5 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div
                      className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-1"
                      style={{ transform: `rotate(${item.rotation}deg)` }}
                    >
                      <img src={item.previewUrl} alt={`Page ${index + 1}`} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="truncate min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{item.file.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {(item.file.size / 1024).toFixed(1)} KB • {item.rotation}° Rotated
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rotateImage(item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(item.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      title="Remove Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
