// src/components/ScadaImage.tsx
import React, { useState } from 'react';

interface ScadaImageProps {
  localPath: string;          // 例如 "/assets/scada/eq01_ge_icl_compressor.png"
  alt?: string;
  className?: string;
}

// 占位图(SVG data URL,加载失败时显示)
const FALLBACK_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140">
      <rect width="200" height="140" fill="#1f2937"/>
      <text x="100" y="70" fill="#9ca3af" font-size="12"
            font-family="monospace" text-anchor="middle"
            dominant-baseline="middle">SCADA IMG MISSING</text>
    </svg>`
  );

export const ScadaImage: React.FC<ScadaImageProps> = ({
  localPath,
  alt = 'SCADA asset',
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  // 同时兼容两种部署:
  // 1. 本地 public/assets/scada/...  → 直接用 localPath
  // 2. 若本地 404,回退到 GitHub RAW 外链
  const primarySrc = localPath;
  const fallbackSrc = `https://raw.githubusercontent.com/CarliYz/Energy-System/main/public${localPath}`;

  const [src, setSrc] = useState(primarySrc);

  return (
    <img
      src={failed ? FALLBACK_SVG : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (src === primarySrc) {
          // 第一次失败 → 试 RAW 外链
          setSrc(fallbackSrc);
        } else {
          // RAW 也失败 → 显示占位图
          setFailed(true);
        }
      }}
    />
  );
};

export default ScadaImage;
