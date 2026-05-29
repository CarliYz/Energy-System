import React from 'react';
import { cn } from '../../lib/utils';

export interface WordCloudItem {
  text: string;
  weight: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface ChartKeywordCloudProps {
  words: WordCloudItem[];
  width?: number;
  height?: number;
}

export function ChartKeywordCloud({ words, width, height }: ChartKeywordCloudProps) {
  // Map weight to text sizes and grid/flex columns for a classic rectangular cloud layout
  return (
    <div 
      className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex flex-wrap gap-2 justify-center items-center content-center select-none overflow-hidden h-28"
      style={{ width: width ? `${width}px` : '100%', minHeight: '112px' }}
    >
      {words.map((item, idx) => {
        // Sentiment color mappings
        const colorClass = 
          item.sentiment === 'positive' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-100' 
            : item.sentiment === 'negative'
            ? 'bg-rose-50 text-rose-700 border-rose-200/50 font-semibold hover:bg-rose-100'
            : 'bg-slate-100 text-slate-700 border-slate-200/50 hover:bg-slate-200';

        // Size styling depending on weight
        const sizeClass = 
          item.weight >= 40 
            ? 'text-[12.5px] px-2.5 py-1 font-bold shadow-xs' 
            : item.weight >= 30 
            ? 'text-[11px] px-2 py-0.5 font-semibold' 
            : item.weight >= 20 
            ? 'text-[10px] px-1.5 py-0.5' 
            : 'text-[9px] px-1 py-0.2 opacity-80';

        return (
          <span
            key={idx}
            className={cn(
              "inline-block border rounded transition-all duration-150 cursor-pointer transform hover:scale-[1.05] shadow-2xs whitespace-nowrap",
              colorClass,
              sizeClass
            )}
            title={`Frequency weight: ${item.weight}`}
          >
            {item.text}
          </span>
        );
      })}
    </div>
  );
}
