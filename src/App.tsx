/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { HowICanHelpSection } from './components/HowICanHelpSection';
import { ProjectsSection, type ProjectItem } from './components/ProjectsSection';
import { ContactModal, ProjectModal, ResumeModal } from './components/Modals';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <main
      className="min-h-screen w-full bg-[#0C0C0C] text-[#D7E2EA]"
      style={{ overflowX: 'clip' }}
    >
      <Navbar onOpenContact={() => setIsContactOpen(true)} />
      <HeroSection />
      <MarqueeSection />
      <AboutSection onOpenResume={() => setIsResumeOpen(true)} />
      <ServicesSection />
      <HowICanHelpSection onOpenContact={() => setIsContactOpen(true)} />
      <ProjectsSection onSelectProject={(project) => setSelectedProject(project)} />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={() => setIsContactOpen(true)}
      />
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </main>
  );
}
