import React, { useState, useEffect, useRef } from 'react';

const universities = [
  { id: 1, name: 'University of West London', url: 'https://www.uwl.ac.uk/', blueLogo: true },
  { id: 2, name: 'East London University', url: 'https://www.uel.ac.uk/' },
  { id: 3, name: 'Aston University', url: 'https://www.aston.ac.uk/' },
  { id: 4, name: 'Birmingham City University', url: 'https://www.bcu.ac.uk/', blueLogo: true },
  { id: 5, name: 'University of East Anglia', url: 'https://www.uea.ac.uk/' },
  { id: 6, name: 'University of Law', url: 'https://www.law.ac.uk/', blueLogo: true },
  { id: 7, name: 'BPP University', url: 'https://www.bpp.com/', blueLogo: true },
  { id: 8, name: 'Coventry University', url: 'https://www.coventry.ac.uk/', blueLogo: true },
  { id: 9, name: 'Munich Business School', url: 'https://www.munich-business-school.de/en/', blueLogo: true },
  { id: 10, name: 'BSBI', url: 'https://www.berlinsbi.com/', blueLogo: true },
  { id: 11, name: 'GISMA University', url: 'https://www.gisma.com/', blueLogo: true },
  { id: 12, name: 'ICN Business School', url: 'https://www.icn-artem.com/en/' },
  { id: 13, name: 'ISM', url: 'https://en.ism.de/', blueLogo: true },
  { id: 14, name: 'VU', url: 'https://www.vu.edu.au/', blueLogo: true },
  { id: 15, name: 'SMK', url: 'https://www.smk.lt/en/' },
  { id: 16, name: 'LSMU', url: 'https://lsmu.lt/en/', blueLogo: true },
  { id: 17, name: 'University of the Sunshine Coast', url: 'https://www.usc.edu.au/' },
  { id: 18, name: 'Navitas Group', url: 'https://www.navitas.com/' },
  { id: 19, name: 'Webster University', url: 'https://www.webster.edu/', blueLogo: true },
  { id: 20, name: 'University of Twente', url: 'https://www.utwente.nl/en/' },
];

function UniversityItem({ uni }) {
  const [imgError, setImgError] = useState(false);
  // Extract domain and use Google's Favicon V2 API for highly reliable, high-res official icons
  const domain = new URL(uni.url).hostname;
  const logoUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;

  return (
    <a
      href={uni.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 group/link whitespace-nowrap shrink-0"
      aria-label={`Visit official website of ${uni.name}`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${
        uni.blueLogo ? 'bg-white' : 'bg-white/5'
      }`}>
        {!imgError ? (
          <img
            src={logoUrl}
            alt={`${uni.name} logo`}
            className="w-full h-full object-contain p-2"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-base font-bold text-white uppercase tracking-wider">{uni.name.charAt(0)}</span>
        )}
      </div>
      <span className="text-xl md:text-[22px] font-medium tracking-wide text-[#F3F1EA] flex items-center whitespace-nowrap">
        {uni.name}
      </span>
    </a>
  );
}

export default function UniversityMarquee() {
  // Duplicate array for seamless CSS translate(-50%) trick
  const seamlessList = [...universities, ...universities];
  const sectionRef = useRef(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Fully visible when section top is at or below 40% of viewport
      // Fully faded when section top reaches 10% of viewport (scrolled well past)
      const fadeStart = viewH * 0.4;
      const fadeEnd = viewH * 0.1;
      if (rect.top >= fadeStart) {
        setOpacity(1);
      } else if (rect.top <= fadeEnd) {
        setOpacity(0);
      } else {
        setOpacity((rect.top - fadeEnd) / (fadeStart - fadeEnd));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ opacity, transition: 'opacity 0.25s ease-out' }}
      className="bg-transparent text-[#F3F1EA] mt-12 md:mt-20 mb-16 md:mb-24 py-6 md:py-0 min-h-[80px] md:h-[100px] flex items-center border-y border-white/20 relative z-20 overflow-hidden w-full"
    >
      <div
        className="relative flex overflow-hidden group w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        <div className="animate-marquee items-center group-hover:pause gap-[30px] md:gap-[40px] opacity-75">
          {seamlessList.map((uni, idx) => (
            <React.Fragment key={`uni-${idx}`}>
              <div className="cursor-pointer shrink-0">
                <UniversityItem uni={uni} />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" aria-hidden="true" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
