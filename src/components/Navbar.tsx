import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Download, Menu, X } from 'lucide-react';
import { triggerResumeDownload } from './Modals';

interface NavbarProps {
  onOpenContact: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Skills', href: '#services', sectionId: 'services' },
  { label: 'Projects', href: '#projects', sectionId: 'projects' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    const el = document.getElementById(sectionId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleDownloadResume = async () => {
    if (downloadingResume) return;
    setDownloadingResume(true);
    try {
      await triggerResumeDownload();
    } finally {
      setDownloadingResume(false);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 backdrop-blur-md backdrop-saturate-150 ${
          scrolled
            ? 'border-[#D7E2EA]/18 bg-[#0C0C0C]/80 shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
            : 'border-[#D7E2EA]/10 bg-[#0C0C0C]/55'
        }`}
      >
        <nav
          aria-label="Primary Navigation"
          className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-8 md:px-10 md:py-3.5"
        >
          {/* Brand */}
          <button
            type="button"
            onClick={scrollToTop}
            className="cursor-pointer whitespace-nowrap text-base font-bold uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-80 sm:text-lg"
          >
            Purva
          </button>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex lg:gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.sectionId}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.sectionId)}
                className="whitespace-nowrap text-sm font-medium uppercase tracking-wider text-[#D7E2EA]/85 transition-colors duration-200 hover:text-white lg:text-[0.95rem]"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onOpenContact}
              className="cursor-pointer whitespace-nowrap text-sm font-medium uppercase tracking-wider text-[#D7E2EA]/85 transition-colors duration-200 hover:text-white lg:text-[0.95rem]"
            >
              Contact
            </button>
          </div>

          {/* Right Actions: Always-accessible Primary Download Resume CTA + Mobile Drawer Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleDownloadResume}
              disabled={downloadingResume}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[#D7E2EA] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#0C0C0C] transition-all duration-200 hover:bg-white active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[13px]"
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
              <span>{downloadingResume ? 'Downloading...' : 'Download Resume'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#D7E2EA]/25 bg-[#0C0C0C]/60 text-[#D7E2EA] transition-colors hover:border-[#D7E2EA]/60 hover:bg-[#D7E2EA]/10 md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Responsive Slide-Out Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <motion.aside
              id="mobile-nav-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-[min(86vw,340px)] flex-col justify-between border-l border-[#D7E2EA]/18 bg-[#0C0C0C]/92 p-6 text-[#D7E2EA] backdrop-blur-xl shadow-[-16px_0_48px_rgba(0,0,0,0.65)]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#D7E2EA]/12 pb-5">
                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="cursor-pointer text-base font-bold uppercase tracking-wider text-[#D7E2EA]"
                  >
                    Purva Bhadange
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation menu"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D7E2EA]/25 text-[#D7E2EA] transition-colors hover:border-[#D7E2EA]/60 hover:bg-[#D7E2EA]/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  {NAV_LINKS.map((link, idx) => (
                    <a
                      key={link.sectionId}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.sectionId)}
                      className="flex items-baseline gap-4 rounded-2xl px-4 py-3.5 text-lg font-medium uppercase tracking-wider text-[#D7E2EA]/90 transition-colors hover:bg-[#D7E2EA]/10 hover:text-white"
                    >
                      <span className="text-xs font-semibold tabular-nums text-[#D7E2EA]/40">
                        0{idx + 1}
                      </span>
                      <span>{link.label}</span>
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenContact();
                    }}
                    className="flex cursor-pointer items-baseline gap-4 rounded-2xl px-4 py-3.5 text-left text-lg font-medium uppercase tracking-wider text-[#D7E2EA]/90 transition-colors hover:bg-[#D7E2EA]/10 hover:text-white"
                  >
                    <span className="text-xs font-semibold tabular-nums text-[#D7E2EA]/40">
                      04
                    </span>
                    <span>Contact</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#D7E2EA]/12 pt-5">
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  disabled={downloadingResume}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#D7E2EA] px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0C0C0C] transition-all duration-200 hover:bg-white active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                >
                  <Download className="h-4 w-4 shrink-0" />
                  <span>{downloadingResume ? 'Downloading...' : 'Download Resume'}</span>
                </button>
                <p className="text-center text-xs text-[#D7E2EA]/50">
                  Open to AI/ML &amp; software engineering internships
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
