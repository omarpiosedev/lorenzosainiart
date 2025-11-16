'use client';

import Biography from './Biography';
import GearTools from './GearTools';
import HeroAbout from './HeroAbout';
import LicensesCertifications from './LicensesCertifications';
import Timeline from './Timeline';

export default function AboutContent() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <HeroAbout />
      <Biography />
      <GearTools />
      <Timeline />
      <LicensesCertifications />
    </div>
  );
}
