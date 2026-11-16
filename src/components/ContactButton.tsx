import React from 'react';
import { Magnet } from './Magnet';

interface ContactButtonProps {
  onClick?: () => void;
  className?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  onClick,
  className = '',
}) => {
  return (
    <Magnet padding={60} strength={4}>
      <button
        type="button"
        onClick={onClick}
        className={`contact-btn cursor-pointer rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base font-medium uppercase tracking-widest text-white whitespace-nowrap shrink-0 transition-transform duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#BBCCD7] ${className}`}
        style={{
          background:
            'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
          boxShadow:
            '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
          outline: '2px solid #FFFFFF',
          outlineOffset: '-3px',
        }}
      >
        Contact Me
      </button>
    </Magnet>
  );
};
