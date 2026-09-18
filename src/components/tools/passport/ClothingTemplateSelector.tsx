import React from 'react';
import { CLOTHING_TEMPLATES } from '../../../data/passport/templates';
import { Check, ShieldCheck, User } from 'lucide-react';

interface ClothingTemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
}

export const ClothingTemplateSelector: React.FC<ClothingTemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Executive Clothing Overlays</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Face Protected 🔒
            </span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Select corporate formalwear. The overlay adapts below your neck line while your face remains 100% untouched.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CLOTHING_TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.id;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectTemplate(tpl.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[110px] ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-400 text-white ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: tpl.previewColor }}
                >
                  {tpl.id === 'none' ? (
                    <User className="w-4 h-4 text-slate-300" />
                  ) : (
                    <span className="text-[10px] font-bold text-white uppercase">👔</span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
              </div>

              <div>
                <span className="text-xs font-bold text-slate-100 block line-clamp-1">
                  {tpl.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {tpl.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
