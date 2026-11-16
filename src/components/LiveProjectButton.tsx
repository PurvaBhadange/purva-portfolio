import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Magnet } from './Magnet';

interface LiveProjectButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  href,
  onClick,
  className = '',
}) => {
  const sharedClasses = `inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-5 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-medium uppercase tracking-widest text-[#D7E2EA] whitespace-nowrap shrink-0 transition-colors duration-200 hover:bg-[#D7E2EA]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7E2EA] ${className}`;

  return (
    <Magnet padding={50} strength={5}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={sharedClasses}
        >
          <span>Live Project</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <button type="button" onClick={onClick} className={sharedClasses}>
          <span>Live Project</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
        </button>
      )}
    </Magnet>
  );
};
