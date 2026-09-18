import React, { useState, useEffect } from 'react';
import { PaperSizeId, PassportSession } from '../../../types/passport';
import { PAPER_SIZES, calculatePrintGrid } from '../../../data/passport/paperSizes';
import { renderPrintSheetCanvas, exportPrintSheetPdf } from '../../../lib/passport/printSheet';
import {
  FileDown,
  Printer,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Info,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface PrintSheetPreviewProps {
  session: PassportSession;
  onUpdatePrintSettings: (settings: Partial<PassportSession['printSettings']>) => void;
}

export const PrintSheetPreview: React.FC<PrintSheetPreviewProps> = ({
  session,
  onUpdatePrintSettings,
}) => {
  const [sheetDataUrl, setSheetDataUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { printSettings, photoSize } = session;
  const currentPaper = PAPER_SIZES.find((p) => p.id === printSettings.paperSize) || PAPER_SIZES[0];

  const grid = calculatePrintGrid(
    currentPaper.widthMm,
    currentPaper.heightMm,
    photoSize.widthMm,
    photoSize.heightMm,
    printSettings.marginMm,
    printSettings.spacingMm
  );

  // Re-render the print sheet preview when settings change
  useEffect(() => {
    let active = true;
    const updateSheet = async () => {
      try {
        setIsRendering(true);
        const { canvas } = await renderPrintSheetCanvas(session);
        if (active) {
          setSheetDataUrl(canvas.toDataURL('image/jpeg', 0.85));
        }
      } catch (err) {
        console.error('Print sheet render error:', err);
      } finally {
        if (active) setIsRendering(false);
      }
    };

    updateSheet();
    return () => {
      active = false;
    };
  }, [
    session.photoSize,
    session.printSettings,
    session.background,
    session.clothingTemplateId,
    session.adjustments,
  ]);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await exportPrintSheetPdf(session);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Warning Banner: "Print at 100% / Actual Size" */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 block">
            Critical Printing Instruction (Avoid "Fit to Page"):
          </span>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            When sending this document to your printer, ensure your print scale is set to{' '}
            <strong className="underline text-white font-mono">100% (Actual Size)</strong>. Do NOT
            select "Fit to Page" or "Scale to Fit", or the photos will lose their official millimeter
            dimensions!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Paper Canvas Preview (Col 7) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>{currentPaper.name} Preview</span>
                <span className="font-mono text-cyan-400 text-[11px]">
                  ({currentPaper.widthMm} × {currentPaper.heightMm} mm)
                </span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/20">
                {grid.totalPhotos} Photos Max-Fit
              </span>
            </div>

            {/* Paper Sheet Rendering Frame */}
            <div
              className="relative w-full max-w-[420px] bg-white rounded-xl shadow-2xl border-4 border-slate-700 overflow-hidden flex items-center justify-center transition-all"
              style={{
                aspectRatio: `${currentPaper.widthMm} / ${currentPaper.heightMm}`,
              }}
            >
              {sheetDataUrl ? (
                <img
                  src={sheetDataUrl}
                  alt="Print Sheet Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 p-6 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  <span className="text-xs font-mono">Rendering high-res print sheet...</span>
                </div>
              )}

              {isRendering && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-[11px] text-slate-400 font-mono">
                Sheet Grid: {grid.columns} columns × {grid.rows} rows • Standard 300 DPI Vector PDF
              </p>
            </div>
          </div>
        </div>

        {/* Right: Controls & Paper Selection (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Paper Selection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Select Paper Format</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {PAPER_SIZES.map((paper) => {
                const isSelected = paper.id === printSettings.paperSize;
                const pGrid = calculatePrintGrid(
                  paper.widthMm,
                  paper.heightMm,
                  photoSize.widthMm,
                  photoSize.heightMm,
                  printSettings.marginMm,
                  printSettings.spacingMm
                );

                return (
                  <button
                    key={paper.id}
                    type="button"
                    onClick={() => onUpdatePrintSettings({ paperSize: paper.id })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-white ring-1 ring-cyan-400/40 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-850/60 border-slate-750 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{paper.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {paper.widthMm} × {paper.heightMm} mm
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono block font-semibold mt-1">
                      Fits {pGrid.totalPhotos} photos
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Layout Options */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Print Marks & Spacing</span>
            </h4>

            <div className="space-y-3">
              {/* Crop Marks Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-850/60 border border-slate-750 cursor-pointer hover:bg-slate-800 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    Corner Cutting Crop Marks
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Guides for scissors / rotary cutter
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={printSettings.includeCropMarks}
                  onChange={(e) => onUpdatePrintSettings({ includeCropMarks: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-800 border-slate-700"
                />
              </label>

              {/* Border Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-850/60 border border-slate-750 cursor-pointer hover:bg-slate-800 transition-colors">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    Thin Photo Border Line
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Helpful contrast line on pure white photo paper
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={printSettings.includeBorder}
                  onChange={(e) => onUpdatePrintSettings({ includeBorder: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-800 border-slate-700"
                />
              </label>

              {/* Photo Spacing Slider */}
              <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-750 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Photo Gap (Spacing)</span>
                  <span className="font-mono text-cyan-400 font-bold">{printSettings.spacingMm} mm</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  step={1}
                  value={printSettings.spacingMm}
                  onChange={(e) => onUpdatePrintSettings({ spacingMm: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Download Print Sheet PDF Action */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {isExporting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileDown className="w-5 h-5" />
              )}
              <span>
                {isExporting
                  ? 'Generating Print Sheet PDF...'
                  : `Download ${currentPaper.name} PDF (${grid.totalPhotos} Photos)`}
              </span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Ready for high-speed home inkjet, laser printers, or professional photo print labs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
