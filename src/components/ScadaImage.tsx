import React, { useState } from 'react';

const IMAGE_MAP = import.meta.glob('../assets/scada/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140">
       <rect width="200" height="140" fill="#1f2937"/>
       <text x="100" y="70" fill="#9ca3af" font-size="11"
             font-family="monospace" text-anchor="middle"
             dominant-baseline="middle">SCADA IMG MISSING</text>
     </svg>`
  );

interface ScadaImageProps {
  localPath: string;
  alt?: string;
  className?: string;
}

export const ScadaImage: React.FC<ScadaImageProps> = ({
  localPath,
  alt = 'SCADA asset',
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  const fileName = localPath.split('/').pop() ?? '';
  const matchKey = Object.keys(IMAGE_MAP).find((k) => k.endsWith('/' + fileName));
  const src = matchKey ? IMAGE_MAP[matchKey] : '';

  return (
    <img
      src={failed || !src ? FALLBACK : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export default ScadaImage;
