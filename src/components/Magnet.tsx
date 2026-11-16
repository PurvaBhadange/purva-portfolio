import React, { useEffect, useRef, useState } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  disabled?: boolean;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 60,
  strength = 3,
  disabled = false,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled) {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = Math.abs(e.clientX - centerX);
      const distY = Math.abs(e.clientY - centerY);

      if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
        setIsActive(true);
        const offsetX = (e.clientX - centerX) / strength;
        const offsetY = (e.clientY - centerY) / strength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, strength, disabled]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isActive
          ? 'transform 0.3s ease-out'
          : 'transform 0.6s ease-in-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
