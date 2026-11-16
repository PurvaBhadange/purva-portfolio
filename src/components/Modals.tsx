import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Check,
  Download,
  Cpu,
  Layers,
  GitBranch,
  RefreshCw,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { ProjectItem } from './ProjectsSection';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const RESUME_PATH = '/assets/aistudio/Purva_resume___fb5ecba2.pdf';
const RESUME_DOWNLOAD_NAME = 'Purva_Manishrao_Bhadange_Resume.pdf';
const CONTACT_EMAIL = 'purvabhadange06@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/purva-b-660982259/';
const GITHUB_URL = 'https://github.com/PurvaBhadange';

export async function triggerResumeDownload(): Promise<void> {
  try {
    const response = await fetch(RESUME_PATH);
    if (!response.ok) throw new Error('Failed to fetch resume PDF');
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(
      new Blob([blob], { type: 'application/pdf' })
    );
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = RESUME_DOWNLOAD_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
  } catch {
    const fallbackLink = document.createElement('a');
    fallbackLink.href = RESUME_PATH;
    fallbackLink.download = RESUME_DOWNLOAD_NAME;
    fallbackLink.target = '_blank';
    fallbackLink.rel = 'noopener noreferrer';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
  }
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_OPTIONS = [
  'Internship / Role',
  'AI/ML & RAG',
  'Multi-Agent Systems',
  'Full-Stack',
  'Data Science',
  'Collaboration / Hackathon',
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState('Internship / Role');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadingResume, setDownloadingResume] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleDownloadResume = async () => {
    if (downloadingResume) return;
    setDownloadingResume(true);
    try {
      await triggerResumeDownload();
    } finally {
      setDownloadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Block automated spam silently if honeypot field is populated
    if (honeypot.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!cleanMessage) {
      setErrorMsg('Please enter a brief message about the role or project.');
      return;
    }

    setSubmitting(true);
    try {
      const apiRes = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          topic: selectedService,
          message: cleanMessage,
          _honey: honeypot,
        }),
      });

      if (apiRes.ok) {
        const data = (await apiRes.json()) as { ok?: boolean; error?: string };
        if (data.ok) {
          setSubmitted(true);
          return;
        }
        throw new Error(data.error || 'Submission failed');
      }

      if (apiRes.status === 400) {
        const errData = (await apiRes.json()) as { error?: string };
        throw new Error(errData.error || 'Please check your input fields.');
      }

      // If /api/contact is not hosted (e.g. static deployment), try direct external relay
      if (apiRes.status === 404 || apiRes.status === 405) {
        const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT as
          | string
          | undefined;
        const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
          | string
          | undefined;

        if (formspreeEndpoint) {
          const res = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              name: cleanName,
              email: cleanEmail,
              topic: selectedService,
              message: cleanMessage,
              _gotcha: honeypot,
            }),
          });
          if (!res.ok) throw new Error('Submission failed');
        } else if (web3FormsKey) {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              access_key: web3FormsKey,
              name: cleanName,
              email: cleanEmail,
              subject: `[${selectedService}] Portfolio Inquiry from ${cleanName}`,
              message: `Topic: ${selectedService}\n\n${cleanMessage}`,
              botcheck: honeypot,
            }),
          });
          const data = (await res.json()) as { success?: boolean; message?: string };
          if (!res.ok || !data.success) {
            throw new Error(data.message || 'Submission failed');
          }
        } else {
          const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              name: cleanName,
              email: cleanEmail,
              topic: selectedService,
              message: cleanMessage,
              _subject: `[${selectedService}] Portfolio Inquiry from ${cleanName}`,
              _honey: honeypot,
              _template: 'table',
            }),
          });
          const data = (await res.json()) as {
            success?: boolean | string;
            message?: string;
          };
          if (!res.ok || data.success === false || data.success === 'false') {
            throw new Error(data.message || 'Submission failed');
          }
        }

        setSubmitted(true);
        return;
      }

      throw new Error('Could not send your message right now.');
    } catch (err) {
      const msg =
        err instanceof Error && err.message && err.message !== 'Submission failed'
          ? err.message
          : 'Could not send your message right now. Please try again or email directly using the Email button above.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setErrorMsg(null);
    setName('');
    setEmail('');
    setMessage('');
    setHoneypot('');
    setSelectedService('Internship / Role');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={handleResetAndClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[32px] border border-[#D7E2EA]/25 bg-[#0C0C0C] p-6 text-[#D7E2EA] sm:p-8"
          >
            <button
              type="button"
              onClick={handleResetAndClose}
              aria-label="Close contact dialog"
              className="absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#D7E2EA]/30 bg-[#D7E2EA]/10">
                  <Check className="h-7 w-7 text-[#D7E2EA]" />
                </div>
                <h3
                  id="contact-modal-title"
                  className="hero-heading mb-3 text-3xl font-black uppercase tracking-tight"
                >
                  Let&rsquo;s talk.
                </h3>
                <p className="mb-6 max-w-sm text-sm font-light leading-relaxed text-[#D7E2EA]/85 sm:text-base">
                  Message sent. Thanks, I&rsquo;ll get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="cursor-pointer rounded-full border-2 border-[#D7E2EA] px-7 py-2.5 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
                >
                  Back to Portfolio
                </button>
              </div>
            ) : (
              <>
                <h3
                  id="contact-modal-title"
                  className="hero-heading mb-1 pr-10 text-3xl font-black uppercase tracking-tight sm:text-4xl"
                >
                  Let&rsquo;s talk.
                </h3>
                <p className="text-sm font-light text-[#D7E2EA]/85 sm:text-base">
                  Open to AI/ML, AI engineering &amp; data science internships
                </p>
                <p className="mb-4 mt-0.5 text-xs font-light uppercase tracking-wider text-[#D7E2EA]/55">
                  Pune, India
                </p>

                <div className="mb-5 flex flex-wrap items-center gap-2.5 border-b border-[#D7E2EA]/15 pb-5">
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    disabled={downloadingResume}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#D7E2EA] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0C0C0C] transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {downloadingResume ? 'Downloading...' : 'Download Resume'}
                  </button>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-[#D7E2EA]/30 px-3.5 py-2 text-xs font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
                  >
                    LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-[#D7E2EA]/30 px-3.5 py-2 text-xs font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
                  >
                    GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-1 rounded-full border border-[#D7E2EA]/30 px-3.5 py-2 text-xs font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
                  >
                    Email <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Hidden honeypot field for spam filtering */}
                  <input
                    type="text"
                    name="_honey"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/75">
                      Name
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Kim"
                        className="rounded-xl border border-[#D7E2EA]/20 bg-white/5 px-3.5 py-2.5 text-sm font-normal text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:border-[#D7E2EA] focus:outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/75">
                      Email
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="rounded-xl border border-[#D7E2EA]/20 bg-white/5 px-3.5 py-2.5 text-sm font-normal text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:border-[#D7E2EA] focus:outline-none"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/75">
                      Topic
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SERVICE_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedService(option)}
                          className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                            selectedService === option
                              ? 'border-[#D7E2EA] bg-[#D7E2EA] text-[#0C0C0C]'
                              : 'border-[#D7E2EA]/25 text-[#D7E2EA]/80 hover:border-[#D7E2EA]/60'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/75">
                    Message
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me about the role or project, and the timeline if there is one."
                      className="resize-none rounded-xl border border-[#D7E2EA]/20 bg-white/5 px-3.5 py-2.5 text-sm font-normal text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:border-[#D7E2EA] focus:outline-none"
                    />
                  </label>

                  {errorMsg && (
                    <div
                      role="alert"
                      className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2.5 text-xs leading-relaxed text-rose-200"
                    >
                      {errorMsg}
                    </div>
                  )}

                  <div className="mt-1 flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
                    <p className="text-xs font-light text-[#D7E2EA]/55">
                      I usually reply within 24&ndash;48 hours.
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="cursor-pointer self-end rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform active:scale-95 disabled:opacity-60 sm:self-auto"
                      style={{
                        background:
                          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                        boxShadow:
                          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                        outline: '2px solid #FFFFFF',
                        outlineOffset: '-3px',
                      }}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onOpenContact,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'architecture' | 'stack'>('all');

  useEffect(() => {
    setActiveImageIndex(0);
    setActiveTab('all');
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  const allImages = project
    ? [project.col2Image, project.col1Images[0], project.col1Images[1]]
    : [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-[36px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-5 text-[#D7E2EA] sm:p-8"
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black leading-none text-[#D7E2EA] tabular-nums sm:text-5xl">
                  {project.number}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/60">
                      {project.category}
                    </span>
                    {project.status && (
                      <span className="text-xs font-medium uppercase tracking-widest text-amber-300/90">
                        &middot; {project.status}
                      </span>
                    )}
                  </div>
                  <h3
                    id="project-modal-title"
                    className="text-xl font-medium uppercase tracking-tight text-[#D7E2EA] sm:text-3xl"
                  >
                    {project.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project preview"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#D7E2EA]/25 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Section View Filter Tabs */}
            <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-[#D7E2EA]/12 pb-4">
              {[
                { id: 'all', label: 'Full Technical View' },
                { id: 'architecture', label: 'Architecture Diagram' },
                { id: 'stack', label: 'Technologies & Specs' },
              ].map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id as 'all' | 'architecture' | 'stack')
                    }
                    className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                      selected
                        ? 'border-[#D7E2EA] bg-[#D7E2EA] text-[#0C0C0C]'
                        : 'border-[#D7E2EA]/25 text-[#D7E2EA]/75 hover:border-[#D7E2EA]/60 hover:text-[#D7E2EA]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Overview & Gallery */}
            {activeTab === 'all' && (
              <>
                <div className="mb-4 overflow-hidden rounded-[28px] bg-[#161616]">
                  <img
                    src={allImages[activeImageIndex]}
                    alt={`${project.name} detail frame ${activeImageIndex + 1}`}
                    referrerPolicy="no-referrer"
                    className="h-[220px] w-full object-cover sm:h-[320px]"
                  />
                </div>

                <div className="mb-6 grid grid-cols-3 gap-3">
                  {allImages.map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`cursor-pointer overflow-hidden rounded-2xl border-2 transition-opacity ${
                        activeImageIndex === idx
                          ? 'border-[#D7E2EA] opacity-100'
                          : 'border-transparent opacity-55 hover:opacity-85'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${project.name} thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-16 w-full object-cover sm:h-24"
                      />
                    </button>
                  ))}
                </div>

                {/* Technical Overview & Highlights */}
                <div className="mb-6 rounded-3xl border border-[#D7E2EA]/15 bg-[#111317] p-5 sm:p-6">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/65">
                    <Cpu className="h-4 w-4 text-[#D7E2EA]/75" />
                    <span>Technical Overview</span>
                  </div>
                  <p className="mb-4 text-sm font-light leading-relaxed text-[#D7E2EA]/90 sm:text-base">
                    {project.summary}
                  </p>
                  <ul className="space-y-2 text-xs font-light leading-relaxed text-[#D7E2EA]/80 sm:text-sm">
                    {project.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="text-[#D7E2EA]/50">
                          &mdash;
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* System Architecture Diagram */}
            {(activeTab === 'all' || activeTab === 'architecture') && (
              <div className="mb-6 rounded-3xl border border-[#D7E2EA]/15 bg-[#101216] p-5 sm:p-6">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/70">
                    <GitBranch className="h-4 w-4 text-[#D7E2EA]" />
                    <span>System Architecture Diagram</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/45">
                    {project.architectureStages.length} Stages
                  </span>
                </div>
                <p className="mb-5 text-xs font-light leading-relaxed text-[#D7E2EA]/75 sm:text-sm">
                  {project.architectureSummary}
                </p>

                {/* Flow Pipeline Diagram */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-2">
                  {project.architectureStages.map((stage, idx) => (
                    <div key={stage.layer} className="flex flex-col md:flex-row md:items-stretch">
                      <div className="flex flex-1 flex-col justify-between rounded-2xl border border-[#D7E2EA]/20 bg-[#171A21] p-4">
                        <div>
                          <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                            {stage.layer}
                          </span>
                          <h4 className="mt-1 text-sm font-semibold text-[#D7E2EA]">
                            {stage.title}
                          </h4>
                          <ul className="mt-3 space-y-1.5">
                            {stage.components.map((comp) => (
                              <li
                                key={comp}
                                className="rounded-lg border border-[#D7E2EA]/10 bg-[#0C0C0C]/70 px-2.5 py-1 text-[11px] font-light text-[#D7E2EA]/85"
                              >
                                {comp}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {stage.connectionLabel && (
                          <div className="mt-3 border-t border-[#D7E2EA]/10 pt-2 text-[10px] font-medium uppercase tracking-wider text-sky-300/80">
                            &rarr; {stage.connectionLabel}
                          </div>
                        )}
                      </div>

                      {idx < project.architectureStages.length - 1 && (
                        <div
                          aria-hidden="true"
                          className="flex items-center justify-center py-1 text-[#D7E2EA]/45 md:px-1.5 md:py-0"
                        >
                          <ArrowDown className="h-4 w-4 md:hidden" />
                          <ArrowRight className="hidden h-4 w-4 md:block" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {project.architectureLoopNote && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#D7E2EA]/12 bg-[#0C0C0C]/70 px-4 py-3 text-xs font-light text-[#D7E2EA]/75">
                    <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D7E2EA]/60" />
                    <span>{project.architectureLoopNote}</span>
                  </div>
                )}
              </div>
            )}

            {/* Technical Specifications & Full Categorized Technology Stack */}
            {(activeTab === 'all' || activeTab === 'stack') && (
              <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
                {/* Technical Specs Matrix */}
                <div className="rounded-3xl border border-[#D7E2EA]/15 bg-[#111317] p-5 lg:col-span-5">
                  <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/70">
                    <Cpu className="h-4 w-4 text-[#D7E2EA]" />
                    <span>Technical Specifications</span>
                  </div>
                  <dl className="space-y-3">
                    {project.technicalSpecs.map((spec) => (
                      <div
                        key={spec.label}
                        className="border-b border-[#D7E2EA]/10 pb-2.5 last:border-b-0 last:pb-0"
                      >
                        <dt className="text-[11px] font-medium uppercase tracking-widest text-[#D7E2EA]/45">
                          {spec.label}
                        </dt>
                        <dd className="mt-0.5 text-xs font-normal text-[#D7E2EA]/90 sm:text-sm">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Full Categorized List of Technologies */}
                <div className="rounded-3xl border border-[#D7E2EA]/15 bg-[#111317] p-5 lg:col-span-7">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/70">
                      <Layers className="h-4 w-4 text-[#D7E2EA]" />
                      <span>Full Technology Stack</span>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/45">
                      {project.deliverables.length} Core Technologies
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {project.techStackGroups.map((grp) => (
                      <div
                        key={grp.group}
                        className="rounded-2xl border border-[#D7E2EA]/10 bg-[#0C0C0C]/65 p-3.5"
                      >
                        <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#D7E2EA]/50">
                          {grp.group}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {grp.items.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-[#D7E2EA]/18 bg-[#181B22] px-2.5 py-1 text-xs font-normal text-[#D7E2EA]/90"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex flex-col justify-between gap-4 border-t border-[#D7E2EA]/15 pt-5 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-[#D7E2EA]/55">
                {project.filterCategories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-[#D7E2EA]/20 px-3 py-1 text-[11px]"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#D7E2EA] px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-[#0C0C0C] transition-opacity hover:opacity-90"
                  >
                    Open Live App
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="cursor-pointer rounded-full border-2 border-[#D7E2EA] px-7 py-2.5 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
                >
                  Discuss Project
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const [pdfStatus, setPdfStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const renderPdf = async () => {
      setPdfStatus('loading');
      try {
        const res = await fetch(RESUME_PATH);
        if (!res.ok) throw new Error('Failed to load resume PDF');
        const data = await res.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;
        if (cancelled || !pagesContainerRef.current) return;

        const container = pagesContainerRef.current;
        container.innerHTML = '';

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
        const targetRenderScale = 1.65 * pixelRatio;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: targetRenderScale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.className = 'mx-auto block w-full max-w-[780px] rounded-xl bg-white shadow-lg';

          await page.render({
            canvasContext: context,
            viewport,
            canvas,
          }).promise;

          if (cancelled) return;
          container.appendChild(canvas);
        }

        if (!cancelled) {
          setPdfStatus('ready');
        }
      } catch {
        if (!cancelled) {
          setPdfStatus('fallback');
        }
      }
    };

    void renderPdf();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const handleDownloadResume = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const response = await fetch(RESUME_PATH);
      if (!response.ok) throw new Error('Failed to fetch resume PDF');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(
        new Blob([blob], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = RESUME_DOWNLOAD_NAME;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
    } catch {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = RESUME_PATH;
      fallbackLink.download = RESUME_DOWNLOAD_NAME;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[88vh] w-full max-w-4xl flex-col rounded-[36px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-5 text-[#D7E2EA] sm:p-7"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/60">
                  Curriculum Vitae
                </span>
                <h3
                  id="resume-modal-title"
                  className="text-lg font-medium uppercase tracking-tight text-[#D7E2EA] sm:text-2xl"
                >
                  Purva Manishrao Bhadange
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E2EA]/35 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
                >
                  Open PDF
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  disabled={downloading}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#D7E2EA] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#0C0C0C] transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloading ? 'Downloading...' : 'Download'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume viewer"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D7E2EA]/25 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto rounded-2xl border border-[#D7E2EA]/15 bg-[#161616] p-3 sm:p-6">
              {pdfStatus === 'loading' && (
                <div className="flex h-full min-h-[260px] items-center justify-center text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/60">
                  Loading Resume PDF...
                </div>
              )}

              <div
                ref={pagesContainerRef}
                className={`flex flex-col gap-5 ${pdfStatus === 'ready' ? '' : 'hidden'}`}
              />

              {pdfStatus === 'fallback' && (
                <article className="mx-auto max-w-[780px] rounded-xl bg-white p-6 text-neutral-900 shadow-lg sm:p-10">
                  <header className="border-b border-neutral-300 pb-4 text-center">
                    <h4 className="text-2xl font-bold tracking-wide text-slate-900">
                      PURVA MANISHRAO BHADANGE
                    </h4>
                    <p className="mt-1 text-xs text-neutral-700 sm:text-sm">
                      Pune, Maharashtra, India &bull;{' '}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-blue-700 underline"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                  </header>

                  <section className="mt-5">
                    <h5 className="border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-800">
                      Professional Summary
                    </h5>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-800 sm:text-sm">
                      Third-year B.Tech student specializing in Artificial Intelligence and Machine Learning, seeking AI/ML opportunities. Proficient in Python, Machine Learning, Data Science and Data Structures &amp; Algorithms. Built end-to-end AI applications including LLM-powered Retrieval-Augmented Generation (RAG) systems, multi-agent pipelines and predictive models, with backend APIs for deployment.
                    </p>
                  </section>

                  <section className="mt-5">
                    <h5 className="border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-800">
                      Education
                    </h5>
                    <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-neutral-800 sm:text-sm">
                      <div>
                        <p className="font-semibold">PES Modern College of Engineering, Pune</p>
                        <p>B.Tech in Artificial Intelligence &amp; Machine Learning &ndash; CGPA: 9.31</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">August 2024 &ndash; July 2028</p>
                        <p>Pune &ndash; 411005, India</p>
                      </div>
                    </div>
                  </section>

                  <section className="mt-5">
                    <h5 className="border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-800">
                      Technical Skills
                    </h5>
                    <ul className="mt-2 space-y-1 text-xs text-neutral-800 sm:text-sm">
                      <li><strong>Languages:</strong> Python, C++, C, Java, SQL</li>
                      <li><strong>Data Science:</strong> Pandas, NumPy, Matplotlib, Scikit-learn, Seaborn, Exploratory Data Analysis (EDA)</li>
                      <li><strong>AI/ML:</strong> Generative AI, LLMs, LangChain, RAG, Embeddings, AI Agents</li>
                      <li><strong>Web Development:</strong> FastAPI, React, Node.js</li>
                      <li><strong>Databases &amp; Tools:</strong> MongoDB, MySQL, Git, GitHub, Docker, Vercel</li>
                      <li><strong>System Design:</strong> Rate Limiting, Load Balancing, Caching, Database Sharding, Replication, Message Queues, Consistent Hashing, Fault-Tolerant Architectures</li>
                    </ul>
                  </section>

                  <section className="mt-5">
                    <h5 className="border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-800">
                      Projects
                    </h5>
                    <div className="mt-2 space-y-3 text-xs text-neutral-800 sm:text-sm">
                      <div>
                        <p className="font-semibold">EchoSeek &mdash; Voice-Enabled Multilingual RAG Assistant</p>
                        <p className="text-neutral-600">Tech Stack: Python | FastAPI | React | Sarvam AI | Gemini | FAISS | Hugging Face</p>
                      </div>
                      <div>
                        <p className="font-semibold">SANKALP &mdash; Government Innovation-Procurement Platform</p>
                        <p className="text-neutral-600">Tech Stack: Next.js | TypeScript | FastAPI | PostgreSQL | SQLAlchemy | Docker</p>
                      </div>
                      <div>
                        <p className="font-semibold">ResearchMind &mdash; Multi-Agent Research System</p>
                        <p className="text-neutral-600">Tech Stack: Python | LangChain | Mistral AI | Tavily | BeautifulSoup | Streamlit</p>
                      </div>
                    </div>
                  </section>

                  <section className="mt-5">
                    <h5 className="border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-800">
                      Achievements &amp; Extracurricular
                    </h5>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-neutral-800 sm:text-sm">
                      <li>150+ Data Structures &amp; Algorithms problems solved on LeetCode</li>
                      <li>Completed NPTEL &ndash; Data Science for Engineers &amp; Google AI Certification</li>
                      <li>Secretary, App Club, PES Modern College of Engineering (previously Technical Team)</li>
                    </ul>
                  </section>
                </article>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
