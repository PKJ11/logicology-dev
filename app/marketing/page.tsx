// app/marketing/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';



export default function MarketingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('strategy');
  const videoTrackRef = useRef<HTMLDivElement>(null);
  
  const videoSlides = [
    {
      src: "/videos/Foldax long_[Final].mp4",
      badge: "Brand Film",
      title: "Foldax — Long Form",
      description: "Full-length brand video showcasing Foldax's product story and visual identity."
    },
    {
      src: "/videos/Foldax_Video_Ad_1.mp4",
      badge: "Video Ad",
      title: "Foldax — Video Ad 1",
      description: "Short-form video advertisement crafted for digital campaign performance."
    },
    {
      src: "/videos/Foldax_Video_Ad_2.mp4",
      badge: "Video Ad",
      title: "Foldax — Video Ad 2",
      description: "Alternate cut for A/B testing across social and paid channels."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animation observer removed
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleVideoSlide = (direction: 'prev' | 'next') => {
    let newSlide = direction === 'next' ? currentVideoSlide + 1 : currentVideoSlide - 1;
    if (newSlide >= videoSlides.length) newSlide = 0;
    if (newSlide < 0) newSlide = videoSlides.length - 1;
    setCurrentVideoSlide(newSlide);
  };

  const toggleVideoPlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const wrap = btn.closest('.video-thumb-wrap');
    const vid = wrap?.querySelector('video');
    
    if (!vid) return;
    
    // Pause all other videos
    document.querySelectorAll('.video-thumb-wrap video').forEach((v) => {
      if (v !== vid && !(v as HTMLVideoElement).paused) {
        (v as HTMLVideoElement).pause();
        const ob = v.closest('.video-thumb-wrap')?.querySelector('.play-btn');
        if (ob) resetPlayBtn(ob as HTMLButtonElement);
      }
    });

    if (vid.paused) {
      vid.play();
      btn.classList.add('playing');
      btn.innerHTML = '<span class="text-white text-sm tracking-widest">❚❚</span>';
    } else {
      vid.pause();
      resetPlayBtn(btn);
    }
    
    vid.onended = () => resetPlayBtn(btn);
  };

  const resetPlayBtn = (btn: HTMLButtonElement) => {
    btn.classList.remove('playing');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-0.5"><polygon points="5,3 19,12 5,21"/></svg>`;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.textContent = 'Message Sent ✓';
    btn.style.backgroundColor = '#047FFF';
    btn.style.color = 'white';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.backgroundColor = '';
      btn.style.color = '';
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#F6FAFA] text-[#17224C]">
      {/* Custom styles to match the new design with updated color scheme */}
      <style jsx global>{`
        :root {
          --brand-navy: #17224C;
          --brand-blue: #047FFF;
          --brand-cyan: #19E9E3;
          --brand-bg: #F6FAFA;
          --brand-bg-alt: #E0E4EE;
          --brand-white: #ffffff;
          --brand-gray-light: #E0E4EE;
          --brand-gray-mid: #8a9ab0;
          --brand-gray-dark: #3a4a60;
          --brand-text-primary: #17224C;
          --brand-text-muted: #5a6e88;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: #F6FAFA;
        }

        h1, h2, h3, h4, h5, h6, .font-heading {
          font-family: 'Barlow', sans-serif;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .font-heading-bold {
          font-family: 'Barlow', sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .hero-card-stack {
          position: relative;
          width: 380px;
          height: 420px;
        }

        @media (max-width: 900px) {
          .hero-visual {
            display: none;
          }
        }

        .hero-bg-gradient {
          background: #E0E4EE;
        }

        .hero-isometric-overlay {
          display: none;
        }

        .hero-grid-overlay {
          display: none;
        }

        .glow-blue {
          box-shadow: 0 0 40px rgba(4, 127, 255, 0.25), 0 20px 60px rgba(23, 34, 76, 0.15);
        }

        .glow-cyan {
          box-shadow: 0 0 30px rgba(25, 233, 227, 0.20), 0 20px 60px rgba(23, 34, 76, 0.12);
        }

        .btn-primary {
          background: #047FFF;
          border-radius: 50px;
          transition: all 0.25s ease;
        }
        .btn-primary:hover {
          background: #0066dd;
          box-shadow: 0 0 24px rgba(4, 127, 255, 0.45);
          transform: translateY(-1px);
        }

        .btn-secondary {
          border: 2px solid rgba(23,34,76,0.25);
          color: #17224C;
          border-radius: 50px;
          transition: all 0.25s ease;
        }
        .btn-secondary:hover {
          border-color: #047FFF;
          color: #047FFF;
          background: rgba(4, 127, 255, 0.06);
        }

        /* Hero image styles */
        .hero-image-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: auto;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .card-hover {
          transition: all 0.25s ease;
        }
        .card-hover:hover {
          border-color: #047FFF !important;
          box-shadow: 0 16px 48px rgba(4, 127, 255, 0.12);
          transform: translateY(-2px);
        }

        .tab-fade-in {
          animation: none;
        }

        .accent-line {
          display: inline-block;
          width: 28px;
          height: 2px;
          background: linear-gradient(90deg, #047FFF, #19E9E3);
          margin-right: 10px;
          vertical-align: middle;
        }

        .section-tag {
          display: inline-flex;
          align-items: center;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          color: #047FFF;
          margin-bottom: 1rem;
          font-family: 'Inter', sans-serif;
        }

        .cyan-tag {
          color: #19E9E3;
        }

        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Google Fonts - Updated to Inter and Barlow */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] h-[72px] bg-[rgba(224,228,238,0.95)] backdrop-blur-[14px] ${
        scrolled ? 'border-b border-[#c8cedd] shadow-[0_4px_32px_rgba(23,34,76,0.08)]' : ''
      }`}>
        <Image 
          src="https://ik.imagekit.io/pratik2002/logicology-marketing-removebg-preview.png" 
          alt="Logicology Marketing Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
          priority
        />
        <ul className="hidden lg:flex gap-8 list-none">
          {['Why Outsourced', 'Cost', 'Is This for You', 'Offerings', 'Pricing', 'Process', 'Work', 'Contact'].map((item, i) => (
            <li key={i}>
              <a 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[#3a4a60] text-xs tracking-widest uppercase font-medium hover:text-[#047FFF] transition-colors no-underline"
                style={{fontFamily: 'Inter, sans-serif'}}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-8">
          <a href="#contact" className="hidden lg:block bg-[#17224C] text-white px-5 py-2.5 rounded-sm text-xs tracking-widest font-semibold uppercase hover:bg-[#047FFF] transition-colors whitespace-nowrap" style={{fontFamily: 'Inter, sans-serif'}}>
            Book a Consultation
          </a>
          <button 
            className="lg:hidden flex flex-col gap-1 p-1"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-[#17224C] transition-transform"></span>
            <span className="block w-6 h-0.5 bg-[#17224C] transition-opacity"></span>
            <span className="block w-6 h-0.5 bg-[#17224C] transition-transform"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-[72px] left-0 right-0 bg-[#F6FAFA] px-[5%] py-6 border-b border-[#E0E4EE] shadow-lg z-40 ${
        isMenuOpen ? 'block' : 'hidden'
      }`}>
        {['Why Outsourced', 'Cost Comparison', 'Is This for You', 'Offerings', 'Pricing', 'Process', 'Work', 'Book a Consultation'].map((item, i) => (
          <a
            key={i}
            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
            className="block py-3 text-[#17224C] no-underline border-b border-[#E0E4EE] last:border-b-0"
            onClick={toggleMenu}
            style={{fontFamily: 'Inter, sans-serif'}}
          >
            {item}
          </a>
        ))}
      </div>

      {/* HERO SECTION — Light theme with single image */}
      <section id="home" className="min-h-screen flex items-center px-[5%] py-20 hero-bg-gradient overflow-hidden relative">

        <div className="max-w-[1160px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Text Content */}
          <div>
            <h1 className="font-heading-bold text-[#17224C] leading-tight mb-4" style={{fontSize: 'clamp(2.8rem, 5vw, 4.5rem)'}}>
              <span style={{color: '#047FFF', fontWeight: 500, fontFamily: 'Barlow, sans-serif'}}>Strategic</span><br />
              <span style={{fontFamily: 'Barlow, sans-serif', fontWeight: 800, fontSize: '1.18em', color: '#17224C', letterSpacing: '-0.02em'}}>Marketing</span>
            </h1>
            <p className="text-[#5a6e88] text-base leading-relaxed max-w-[480px] mb-8" style={{fontFamily: 'Inter, sans-serif'}}>
              Access senior-level marketing leadership — strategy, branding, digital presence, and execution — without the overhead of a full in-house department. Premium outcomes. Flexible engagement.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a href="#contact" className="btn-primary text-white px-8 py-3 text-sm font-semibold no-underline" style={{fontFamily: 'Inter, sans-serif'}}>
                Know more
              </a>
              <a href="#offerings" className="btn-secondary bg-transparent px-8 py-3 text-sm font-semibold no-underline" style={{fontFamily: 'Inter, sans-serif'}}>
                Explore Services
              </a>
            </div>
          </div>

          {/* Right: Single Image */}
          <div className="hero-visual relative flex items-center justify-center pr-4">
            <div className="hero-image-container">
  <Image 
    src="/Images/HIGHHEROIMAGE.png"
    alt="Marketing Strategy Illustration"
    width={500}
    height={500}
    className="w-full h-auto object-contain"
    priority
  />
</div>
          </div>
        </div>
      </section>

      {/* WHY OUTSOURCED */}
      <section id="why-outsourced" className="py-24 px-[5%] bg-white">
        <div className="max-w-[1160px] mx-auto">
          <div className="section-tag"><span className="accent-line"></span>The Case for Outsourcing</div>
          <h2 className="font-heading text-4xl sm:text-5xl text-[#17224C] mb-5">Why Outsourced<br />Marketing Services?</h2>
          <p className="text-base text-[#5a6e88] max-w-[540px] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
            Guaranteed world-class quality with high ROI. Senior expertise, complete execution, and the flexibility your business actually needs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: '🧠', title: 'Senior-Level Expertise', desc: 'Access strategic marketing leadership and deep cross-functional expertise — without the full-time overhead of a CMO salary.' },
              { icon: '📈', title: 'Higher ROI', desc: 'Optimize spend by investing in outcomes, not headcount. Every rupee goes toward results, not operational bloat.' },
              { icon: '⚡', title: 'Execution + Strategy', desc: 'Get both high-level strategic direction and practical, polished implementation — from the same trusted partner.' },
              { icon: '🔄', title: 'Flexibility', desc: 'Scale support up or down based on your business stage, priorities, and growth trajectory. No long-term lock-in.' }
            ].map((item, i) => (
              <div key={i} className="bg-[#F6FAFA] p-8 rounded-lg border-2 border-[#E0E4EE] card-hover">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-heading text-xl text-[#17224C] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5a6e88] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COST COMPARISON */}
      <section id="cost-comparison" className="py-24 px-[5%] bg-white">
        <div className="max-w-[1160px] mx-auto">
          <div className="section-tag"><span className="accent-line"></span>The Numbers</div>
          <h2 className="font-heading text-4xl sm:text-5xl text-[#17224C] mb-5">Typical Marketing Team Cost (USD)</h2>
          <p className="font-heading text-xl sm:text-2xl text-white py-5 px-8 rounded-full max-w-[700px] mx-auto text-center mb-12 italic" style={{background: 'linear-gradient(135deg, #17224C, #047FFF)'}}>
            "A Marketing Team in the US costs you at least $30,000 per month"
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[960px] mx-auto">
            {/* In-House Card */}
            <div className="bg-[#F6FAFA] border-2 border-[#E0E4EE] rounded-lg p-8">
              <h3 className="font-heading text-xl text-[#17224C] mb-5">In-House Marketing Team</h3>
              {[
                { role: 'Head of Marketing / Manager', amount: '$120,000' },
                { role: 'Copywriting & Content Expert', amount: '$60,000' },
                { role: 'Graphic Designer', amount: '$36,000' },
                { role: 'Video Editor', amount: '$25,000' },
                { role: 'Campaign / Social Media Mgr', amount: '$40,000' },
                { role: 'Cold Outreach Support', amount: '$20,000' },
                { role: 'Pre-sales / Pitch Deck Support', amount: '$60,000' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-start py-2 border-b border-[#E0E4EE] text-sm">
                  <span className="text-[#3a4a60]" style={{fontFamily: 'Inter, sans-serif'}}>{item.role}</span>
                  <span className="text-[#17224C] font-bold whitespace-nowrap ml-4" style={{fontFamily: 'Inter, sans-serif'}}>{item.amount}</span>
                </div>
              ))}
              <div className="flex justify-between items-start pt-4 mt-2 border-t-2 border-[#17224C] font-semibold">
                <span className="text-[#17224C] font-bold" style={{fontFamily: 'Inter, sans-serif'}}>Total Annual (Lower Bound)</span>
                <span className="text-[#17224C] font-bold" style={{fontFamily: 'Inter, sans-serif'}}>$360,000</span>
              </div>
              <p className="text-xs text-[#8a9ab0] mt-3 leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
                Does not include tool licenses, hiring delays, management overhead, or employee benefits.
              </p>
            </div>

            {/* Fractional Card */}
            <div className="border-2 rounded-lg p-8" style={{background: 'linear-gradient(145deg, #17224C 0%, #0d1a3d 100%)', borderColor: '#047FFF'}}>
              <h3 className="font-heading text-xl text-white mb-5">Fractional CMO + Outsourced Marketing</h3>
              {[
                'Significantly lower monthly commitment',
                'Specialized expertise across all functions',
                'Faster execution, no hiring delays',
                'Minimal management overhead from your side',
                'All tool and license costs covered',
                'Scalable and fully focused support',
                'Strategic clarity built-in from day one',
                'Flexible pay-as-you-go model — pause anytime'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 text-sm text-white/85">
                  <span className="flex-shrink-0 font-bold" style={{color: '#19E9E3', fontFamily: 'Inter, sans-serif'}}>✦</span>
                  <span style={{fontFamily: 'Inter, sans-serif'}}>{item}</span>
                </div>
              ))}
              <div className="mt-6 p-5 rounded-lg text-center" style={{background: 'rgba(4, 127, 255, 0.15)', border: '1px solid rgba(4, 127, 255, 0.3)'}}>
                <div className="text-xs tracking-widest uppercase mb-1" style={{color: '#19E9E3', fontFamily: 'Inter, sans-serif'}}>Save Up To</div>
                <div className="font-heading text-4xl font-bold" style={{color: '#047FFF'}}>70%</div>
                <div className="text-sm text-white/60" style={{fontFamily: 'Inter, sans-serif'}}>compared to full in-house team</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIT SECTION */}
      <section id="fit" className="py-24 px-[5%] bg-[#F6FAFA]">
        <div className="max-w-[1160px] mx-auto">
          <div className="section-tag"><span className="accent-line"></span>Ideal Fit</div>
          <h2 className="font-heading text-4xl sm:text-5xl text-[#17224C] mb-5">Is This for You?</h2>
          <p className="text-base text-[#5a6e88] max-w-[540px] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>This will work for you if:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[820px] mt-10">
            {[
              'You are a small or medium business with variable, patchy marketing demands',
              'You need world-class collaterals and deal with stakeholders who have high quality expectations',
              'You want to spend less time on marketing and stay focused on your core business',
              'You are convinced that top-quality design and marketing communication is a differentiator',
              'You want senior-level strategic thinking without the cost of a full-time hire',
              'You need support across brand, digital presence, and communication assets'
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-[#E0E4EE] card-hover">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{background: 'linear-gradient(135deg, #047FFF, #19E9E3)'}}>
                  <svg viewBox="0 0 12 12" className="w-3 h-3">
                    <polyline points="2,6 5,9 10,3" stroke="white" fill="none" strokeWidth="2.5" />
                  </svg>
                </div>
                <p className="text-sm text-[#3a4a60] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRATEGY COMPARISON */}
      <section id="strategy" className="py-24 px-[5%]" style={{background: 'linear-gradient(160deg, #17224C 0%, #0d1a3d 100%)'}}>
        <div className="max-w-[1160px] mx-auto">
          <div className="section-tag cyan-tag"><span className="accent-line"></span>Strategic Choice</div>
          <h2 className="font-heading text-4xl sm:text-5xl text-white mb-5">In-House vs Outsourced</h2>
          <p className="text-base text-white/55 max-w-[540px] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>Option 2 — Twice as impactful, a third of the cost.</p>
          
          <div className="overflow-x-auto mt-12">
            <table className="w-full max-w-[900px] border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left text-xs tracking-widest uppercase text-white/45 font-medium" style={{fontFamily: 'Inter, sans-serif'}}>Dimension</th>
                  <th className="p-4 text-left text-xs tracking-widest uppercase text-white/45 font-medium" style={{fontFamily: 'Inter, sans-serif'}}>In-House Team</th>
                  <th className="p-4 text-left text-xs tracking-widest uppercase font-medium" style={{color: '#19E9E3', fontFamily: 'Inter, sans-serif'}}>Fractional CMO / Outsourced ✦</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dim: 'Monthly Cost', lose: '$30,000+ USD', win: '70% Less', winTag: true },
                  { dim: 'Speed to Start', lose: 'Weeks to months of hiring', win: 'Immediate kickoff', winTag: true },
                  { dim: 'Flexibility', lose: 'Long-term salary commitment', win: 'Pay-as-you-go, pause anytime', winTag: true },
                  { dim: 'Senior Expertise', lose: 'Depends on who you hire', win: 'Built-in from day one', winTag: true },
                  { dim: 'Execution Breadth', lose: 'Siloed — each role limited', win: 'Full-spectrum delivery', winTag: true },
                  { dim: 'Overhead', lose: 'Tools, benefits, management', win: 'All included, zero overhead', winTag: true },
                  { dim: 'Scalability', lose: 'Headcount-bound growth', win: 'Scale scope, not staff', winTag: true },
                  { dim: 'Focus on ROI', lose: 'Effort measured, not outcomes', win: 'Outcome-driven by design', winTag: true }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs tracking-widest uppercase text-white/40 border-t border-white/5" style={{fontFamily: 'Inter, sans-serif'}}>{row.dim}</td>
                    <td className="p-4 text-sm border-t border-white/5 italic text-white/30" style={{fontFamily: 'Inter, sans-serif'}}>{row.lose}</td>
                    <td className="p-4 text-sm text-white border-t border-white/5">
                      {row.winTag ? (
                        <span className="inline-block text-xs tracking-widest uppercase px-2 py-0.5 rounded font-semibold" style={{background: 'rgba(4, 127, 255, 0.2)', color: '#19E9E3', fontFamily: 'Inter, sans-serif'}}>
                          {row.win}
                        </span>
                      ) : (
                        <span style={{fontFamily: 'Inter, sans-serif'}}>{row.win}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* OFFERINGS WITH TABS */}
      <section id="offerings" className="py-24 px-[5%] bg-white">
        <div className="max-w-[1160px] mx-auto">
          <div className="section-tag"><span className="accent-line"></span>Services</div>
          <h2 className="font-heading text-4xl sm:text-5xl text-[#17224C] mb-5">Our Offerings</h2>
          <p className="text-base text-[#5a6e88] max-w-[540px] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
            A comprehensive suite of marketing services designed to cover every dimension of your growth.
          </p>

          {/* Tab Bar */}
          <div className="flex flex-wrap gap-2 mt-12 bg-[#F6FAFA] rounded-t-xl p-2 pb-0 border-2 border-[#E0E4EE] border-b-0">
            {[
              { id: 'strategy', icon: '🧭', label: 'Strategy & Brand' },
              { id: 'digital', icon: '🌐', label: 'Digital Presence' },
              { id: 'sales', icon: '📊', label: 'Sales & Collateral' },
              { id: 'content', icon: '🎬', label: 'Content & Visibility' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#17224C] border-2 border-[#E0E4EE] border-b-white'
                    : 'bg-transparent text-[#5a6e88] hover:text-[#17224C] hover:bg-[rgba(4,127,255,0.05)]'
                }`}
                style={activeTab === tab.id ? {borderBottomColor: 'white', fontFamily: 'Inter, sans-serif'} : {fontFamily: 'Inter, sans-serif'}}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="text-base opacity-60">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          <div className="bg-white border-2 border-[#E0E4EE] border-t-0 rounded-b-xl p-8 md:p-10">
            {/* Strategy & Brand */}
            {activeTab === 'strategy' && (
              <div className="tab-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: '🧭', title: 'Fractional CMO Consultation', desc: 'Brand positioning, GTM strategies, ABM, lead gen, and brand storyboarding.' },
                    { icon: '📖', title: 'Brand Guidelines', desc: 'Brand identity, brand book, rebranding after M&A, and complete brand storytelling.' },
                    { icon: '💼', title: 'LinkedIn Branding', desc: 'Full turnkey social media brand management with monthly reporting and LinkedIn strategy.' }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#F6FAFA] p-6 rounded-lg border-2 border-[#E0E4EE] card-hover">
                      <div className="text-2xl mb-3">{item.icon}</div>
                      <h4 className="font-heading font-semibold text-[#17224C] mb-1">{item.title}</h4>
                      <p className="text-xs text-[#5a6e88] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Digital Presence */}
            {activeTab === 'digital' && (
              <div className="tab-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: '🌐', title: 'Website Development', desc: 'End-to-end website development with a full turnkey solution and modern design.' },
                    { icon: '🛠️', title: 'Website Maintenance', desc: 'Ongoing updates, design changes, and technical upkeep to keep your site performing.' },
                    { icon: '📋', title: 'Typeform Integration', desc: 'Seamless integration of lead capture forms and surveys into your digital presence.' }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#F6FAFA] p-6 rounded-lg border-2 border-[#E0E4EE] card-hover">
                      <div className="text-2xl mb-3">{item.icon}</div>
                      <h4 className="font-heading font-semibold text-[#17224C] mb-1">{item.title}</h4>
                      <p className="text-xs text-[#5a6e88] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sales & Collateral */}
            {activeTab === 'sales' && (
              <div className="tab-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: '📊', title: 'PowerPoint Decks', desc: 'Pitch decks, corporate overviews, and product decks — 15–20 polished slides each.' },
                    { icon: '🎨', title: 'PowerPoint Template', desc: 'Custom branded templates your team can use for any internal or external deck.' },
                    { icon: '📄', title: 'Marketing Collateral', desc: 'Single-pagers, two-pagers, and four-pagers for sales enablement and outreach.' },
                    { icon: '🖨️', title: 'Creative Print Designs', desc: 'Business cards, letterheads, banners, and event-ready print collateral.' }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#F6FAFA] p-6 rounded-lg border-2 border-[#E0E4EE] card-hover">
                      <div className="text-2xl mb-3">{item.icon}</div>
                      <h4 className="font-heading font-semibold text-[#17224C] mb-1">{item.title}</h4>
                      <p className="text-xs text-[#5a6e88] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content & Visibility with Video Slider */}
            {activeTab === 'content' && (
              <div className="tab-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: '🎬', title: 'Explainer Videos', desc: 'End-to-end animated, 3D, and stock-footage-based video production.' },
                    { icon: '🏛️', title: 'Tradeshow Support', desc: 'Booth designs, print collateral, videos, and end-to-end tradeshow management.' }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#F6FAFA] p-6 rounded-lg border-2 border-[#E0E4EE] card-hover">
                      <div className="text-2xl mb-3">{item.icon}</div>
                      <h4 className="font-heading font-semibold text-[#17224C] mb-1">{item.title}</h4>
                      <p className="text-xs text-[#5a6e88] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>{item.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Video Slider */}
                <div className="rounded-xl p-6 md:p-8 overflow-hidden" style={{background: 'linear-gradient(145deg, #17224C, #0d1a3d)'}}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="text-xs tracking-widest uppercase font-semibold mb-1" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>Work in Action</div>
                      <p className="text-sm text-white/50" style={{fontFamily: 'Inter, sans-serif'}}>Sample video productions — Foldax brand campaign</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        className="w-9 h-9 rounded-full border text-white flex items-center justify-center transition-all hover:border-[#047FFF]"
                        style={{background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)'}}
                        onClick={() => handleVideoSlide('prev')}
                        aria-label="Previous video"
                      >
                        ←
                      </button>
                      <div className="flex gap-1.5">
                        {videoSlides.map((_, i) => (
                          <button
                            key={i}
                            className="w-1.5 h-1.5 rounded-full transition-all"
                            style={{background: currentVideoSlide === i ? '#047FFF' : 'rgba(255,255,255,0.25)'}}
                            onClick={() => setCurrentVideoSlide(i)}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>
                      <button 
                        className="w-9 h-9 rounded-full border text-white flex items-center justify-center transition-all hover:border-[#047FFF]"
                        style={{background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)'}}
                        onClick={() => handleVideoSlide('next')}
                        aria-label="Next video"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg">
                    <div 
                      ref={videoTrackRef}
                      className="flex transition-transform duration-500"
                      style={{ transform: `translateX(-${currentVideoSlide * 100}%)` }}
                    >
                      {videoSlides.map((slide, i) => (
                        <div key={i} className="min-w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-lg overflow-hidden">
                            <div className="relative bg-black video-thumb-wrap">
                              <video 
                                src={slide.src} 
                                preload="metadata" 
                                playsInline
                                className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/15 pointer-events-none"></div>
                              <button 
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-none text-white flex items-center justify-center z-10 play-btn transition-all"
                                style={{background: 'linear-gradient(135deg, #047FFF, #19E9E3)', boxShadow: '0 4px 24px rgba(4, 127, 255, 0.45)'}}
                                onClick={toggleVideoPlay}
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                                  <polygon points="5,3 19,12 5,21"/>
                                </svg>
                              </button>
                            </div>
                            <div className="p-6 md:p-8 flex flex-col justify-center">
                              <span className="inline-block text-xs tracking-widest uppercase px-2 py-0.5 rounded border w-fit font-bold mb-3" style={{background: '#F6FAFA', color: '#047FFF', borderColor: '#047FFF', fontFamily: 'Inter, sans-serif'}}>
                                {slide.badge}
                              </span>
                              <h4 className="font-heading text-xl md:text-2xl text-[#17224C] mb-2 font-semibold">
                                {slide.title}
                              </h4>
                              <p className="text-sm text-[#5a6e88] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
                                {slide.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-[5%] bg-[#F6FAFA]">
        <div className="max-w-[1160px] mx-auto">
          <div className="section-tag"><span className="accent-line"></span>Startup Plans</div>
          <h2 className="font-heading text-4xl sm:text-5xl text-[#17224C] mb-5">Suggested Plans</h2>
          <p className="text-base text-[#5a6e88] max-w-[540px] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
            Structured to match where you are — and where you're heading.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 max-w-[1060px]">
            {/* Starter */}
            <div className="bg-white rounded-lg border-2 border-[#E0E4EE] p-8 hover:shadow-[0_20px_60px_rgba(4,127,255,0.10)] transition-all flex flex-col h-full">
              <div className="text-xs tracking-widest uppercase font-semibold mb-2" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>Bronze</div>
              <h3 className="font-heading text-2xl text-[#17224C] mb-2">Starter</h3>
              <p className="text-sm text-[#5a6e88] mb-5 pb-5 border-b border-[#E0E4EE] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
                For pre-seed startups at the idea stage who need core marketing fundamentals.
              </p>
              <ul className="list-none mb-0 flex-1">
                {[
                  'Logo design',
                  'WordPress website development',
                  '2 monthly website updates (48hr SLA)',
                  '1 pitch deck (15–20 slides)',
                  'Logo reveal video (10 sec)',
                  '4 creative print designs',
                  '3-month engagement'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#3a4a60] py-1">
                    <span className="font-bold flex-shrink-0" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>✦</span>
                    <span style={{fontFamily: 'Inter, sans-serif'}}>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center text-white py-3 rounded text-xs font-semibold tracking-widest uppercase transition-all no-underline hover:opacity-90" style={{background: '#17224C', fontFamily: 'Inter, sans-serif'}}>
                Request Proposal
              </a>
            </div>

            {/* Growth - Popular */}
            <div className="bg-white rounded-lg border-2 p-8 relative hover:shadow-[0_20px_60px_rgba(4,127,255,0.18)] transition-all flex flex-col h-full" style={{borderColor: '#047FFF'}}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-white text-xs tracking-widest uppercase px-4 py-1 rounded-full font-semibold whitespace-nowrap" style={{background: 'linear-gradient(135deg, #047FFF, #19E9E3)', fontFamily: 'Inter, sans-serif'}}>
                Most Popular
              </div>
              <div className="text-xs tracking-widest uppercase font-semibold mb-2" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>Silver</div>
              <h3 className="font-heading text-2xl text-[#17224C] mb-2">Growth</h3>
              <p className="text-sm text-[#5a6e88] mb-5 pb-5 border-b border-[#E0E4EE] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
                For startups with a clear product vision needing broader marketing and positioning.
              </p>
              <ul className="list-none mb-0 flex-1">
                {[
                  'Logo + WordPress website',
                  'Pitch deck + 1 additional deck',
                  'Logo reveal + 1 animated video (60 sec)',
                  'LinkedIn branding (10 posts/designs)',
                  '1 single-pager, 1 two-pager, 1 four-pager',
                  '7 print designs',
                  '1-month marketing collateral support',
                  '16 hrs Fractional CMO consultation',
                  '6-month engagement'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#3a4a60] py-1">
                    <span className="font-bold flex-shrink-0" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>✦</span>
                    <span style={{fontFamily: 'Inter, sans-serif'}}>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center text-white py-3 rounded text-xs font-semibold tracking-widest uppercase no-underline hover:opacity-90 transition-all" style={{background: 'linear-gradient(135deg, #047FFF, #19E9E3)', color: '#fff', fontFamily: 'Inter, sans-serif'}}>
                Request Proposal
              </a>
            </div>

            {/* Scale */}
            <div className="bg-white rounded-lg border-2 border-[#E0E4EE] p-8 hover:shadow-[0_20px_60px_rgba(4,127,255,0.10)] transition-all flex flex-col h-full">
              <div className="text-xs tracking-widest uppercase font-semibold mb-2" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>Gold</div>
              <h3 className="font-heading text-2xl text-[#17224C] mb-2">Scale</h3>
              <p className="text-sm text-[#5a6e88] mb-5 pb-5 border-b border-[#E0E4EE] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
                For growth-stage startups with seed funding ready to build a full marketing engine.
              </p>
              <ul className="list-none mb-0 flex-1">
                {[
                  'Full brand book + logo',
                  'Pitch deck + 2 decks + custom PPT template',
                  '2 animated videos + logo reveal',
                  'LinkedIn full brand management',
                  '2× single, two, & four-pagers',
                  '10 creative print designs',
                  'Tradeshow collateral support',
                  '24 hrs Fractional CMO consultation',
                  '1-year engagement'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#3a4a60] py-1">
                    <span className="font-bold flex-shrink-0" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>✦</span>
                    <span style={{fontFamily: 'Inter, sans-serif'}}>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center text-white py-3 rounded text-xs font-semibold tracking-widest uppercase transition-all no-underline hover:opacity-90" style={{background: '#17224C', fontFamily: 'Inter, sans-serif'}}>
                Request Proposal
              </a>
            </div>

            {/* Bespoke */}
            <div className="bg-white rounded-lg border-2 border-[#E0E4EE] p-8 hover:shadow-[0_20px_60px_rgba(4,127,255,0.10)] transition-all flex flex-col h-full">
              <div className="text-xs tracking-widest uppercase font-semibold mb-2" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>Custom</div>
              <h3 className="font-heading text-2xl text-[#17224C] mb-2">Bespoke</h3>
              <p className="text-sm text-[#5a6e88] mb-5 pb-5 border-b border-[#E0E4EE] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
                Tailored scope for businesses with specific needs beyond standard packages.
              </p>
              <ul className="list-none mb-0 flex-1">
                {[
                  'Full Fractional CMO advisory',
                  'Strategic planning & positioning',
                  'Cross-functional marketing direction',
                  'Curated service selection',
                  'Flexible timelines & milestones',
                  'Scope defined collaboratively'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#3a4a60] py-1">
                    <span className="font-bold flex-shrink-0" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>✦</span>
                    <span style={{fontFamily: 'Inter, sans-serif'}}>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center text-white py-3 rounded text-xs font-semibold tracking-widest uppercase transition-all no-underline hover:opacity-90" style={{background: '#17224C', fontFamily: 'Inter, sans-serif'}}>
                Request Proposal
              </a>
            </div>
          </div>

          <p className="text-center text-sm text-[#5a6e88] mt-8" style={{fontFamily: 'Inter, sans-serif'}}>
            Additional Fractional CMO consultation and design retainer contracts available on request.
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24 px-[5%]" style={{background: 'linear-gradient(160deg, #17224C 0%, #0d1a3d 100%)'}}>
        <div className="max-w-[1160px] mx-auto">
          <div className="section-tag cyan-tag"><span className="accent-line"></span>How We Work</div>
          <h2 className="font-heading text-4xl sm:text-5xl text-white mb-5">Next Steps</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mt-12">
            {[
              { num: '01', title: 'Explore', desc: 'Set up a call to understand our capabilities in depth, review samples of our work, and assess alignment.' },
              { num: '02', title: 'Experiment', desc: 'Start with a fixed-cost short-term project of 3–4 weeks to get a real flavor of working with us.' },
              { num: '03', title: 'Enrich', desc: 'Based on mutual experience of the short-term project, we structure the long-term engagement with clear milestones.' },
              { num: '04', title: 'Execute', desc: 'Full execution with accountability, regular reporting, and a transparent delivery framework.' }
            ].map((step, i) => (
              <div key={i} className="relative p-8 border-r border-white/5 last:border-r-0">
                <div className="font-heading text-5xl font-bold leading-none mb-2" style={{color: 'rgba(4, 127, 255, 0.12)'}}>{step.num}</div>
                <h3 className="font-heading text-xl mb-2" style={{color: '#19E9E3'}}>{step.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>{step.desc}</p>
                {i < 3 && (
                  <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs z-10 lg:block hidden" style={{background: 'linear-gradient(135deg, #047FFF, #19E9E3)'}}>
                    ›
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="work" className="py-24 px-[5%] bg-[#F6FAFA]">
        <div className="max-w-[1160px] mx-auto">
          <div className="section-tag"><span className="accent-line"></span>Portfolio</div>
          <h2 className="font-heading text-4xl sm:text-5xl text-[#17224C] mb-5">Examples of Our Work</h2>
          <p className="text-base text-[#5a6e88] max-w-[540px] leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>
            Here are publicly available examples of our work across websites, thought leadership, and brand assets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {[
              { bg: 'linear-gradient(135deg, #17224C, #047FFF)', icon: '🏢', badge: 'Website', title: 'stsllc.tech', desc: 'Corporate website for a technology and consulting firm — clean, professional, enterprise-grade.', link: 'https://stsllc.tech' },
              { bg: 'linear-gradient(135deg, #047FFF, #19E9E3)', icon: '🤖', badge: 'Website', title: 'konverge.ai', desc: 'AI-focused brand and web presence — modern, conversion-optimized, and forward-looking.', link: 'https://konverge.ai' },
              { bg: 'linear-gradient(135deg, #0d1a3d, #17224C)', icon: '🌊', badge: 'Website', title: 'ridethenextwave.com', desc: 'Bold, expressive web presence for a next-generation consulting and advisory brand.', link: 'https://ridethenextwave.com' },
              { bg: 'linear-gradient(135deg, #19E9E3, #047FFF)', icon: '📚', badge: 'Thought Leadership', title: 'Thought Leadership e-books', desc: 'Long-form strategic content and beautifully designed e-books for B2B positioning.', link: '#contact' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg border border-[#E0E4EE] overflow-hidden hover:shadow-[0_20px_50px_rgba(4,127,255,0.12)] transition-all">
                <div className="h-[180px] relative flex items-center justify-center overflow-hidden" style={{background: item.bg}}>
                  <div className="absolute top-0 left-0 right-0 h-7 flex items-center gap-1 px-3" style={{background: 'rgba(255,255,255,0.1)'}}>
                    <div className="w-2 h-2 rounded-full bg-white/35"></div>
                    <div className="w-2 h-2 rounded-full bg-white/35"></div>
                    <div className="w-2 h-2 rounded-full bg-white/35"></div>
                  </div>
                  <div className="text-5xl opacity-80 mt-4">{item.icon}</div>
                </div>
                <div className="p-5">
                  <span className="inline-block text-xs tracking-widest uppercase bg-[#F6FAFA] px-2 py-0.5 rounded font-semibold mb-2" style={{color: '#047FFF', fontFamily: 'Inter, sans-serif'}}>
                    {item.badge}
                  </span>
                  <h4 className="font-heading font-semibold text-[#17224C] mb-1">{item.title}</h4>
                  <p className="text-xs text-[#5a6e88] mb-4 leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>{item.desc}</p>
                  <a 
                    href={item.link} 
                    target={item.link.startsWith('http') ? '_blank' : undefined}
                    rel={item.link.startsWith('http') ? 'noopener' : undefined}
                    className="inline-block text-xs font-semibold tracking-widest uppercase pb-0.5 hover:opacity-70 transition-all no-underline border-b"
                    style={{color: '#047FFF', borderColor: '#047FFF', fontFamily: 'Inter, sans-serif'}}
                  >
                    {item.link === '#contact' ? 'Request Samples →' : 'View Project →'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-[5%] pb-32" style={{background: 'linear-gradient(160deg, #17224C 0%, #0d1a3d 100%)'}}>
        <div className="max-w-[1160px] mx-auto">
          <div className="section-tag cyan-tag"><span className="accent-line"></span>Get in Touch</div>
          <h2 className="font-heading text-4xl sm:text-5xl text-white mb-5">Thank You</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1000px] mx-auto mt-12 items-start">
            {/* Contact Info */}
            <div>
              <h3 className="font-heading text-2xl mb-4" style={{color: '#19E9E3'}}>Logicology Marketing Team</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8" style={{fontFamily: 'Inter, sans-serif'}}>
                Let's build a smarter, more efficient marketing engine for your business — one that delivers world-class results without the full-time overhead.
              </p>
              <div className="flex items-center gap-3 text-sm text-white/80 mb-3">
                <span className="text-base" style={{color: '#19E9E3'}}>✉</span>
                <a href="mailto:marketing@logicology.com" className="text-white/80 no-underline hover:text-white transition-colors" style={{fontFamily: 'Inter, sans-serif'}}>marketing@logicology.com</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80 mb-8">
                <span className="text-base" style={{color: '#19E9E3'}}>📞</span>
                <a href="tel:+919860265047" className="text-white/80 no-underline hover:text-white transition-colors" style={{fontFamily: 'Inter, sans-serif'}}>+91 98602 65047</a>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="https://calendly.com" target="_blank" rel="noopener" className="text-white px-6 py-3 rounded text-xs font-bold tracking-widest uppercase no-underline hover:opacity-90 transition-all" style={{background: 'linear-gradient(135deg, #047FFF, #19E9E3)', color: '#17224C', fontFamily: 'Inter, sans-serif'}}>
                  Schedule a Call
                </a>
                <a href="mailto:marketing@logicology.com" className="bg-transparent text-white px-6 py-3 rounded text-xs font-semibold tracking-widest uppercase no-underline btn-secondary" style={{fontFamily: 'Inter, sans-serif'}}>
                  Send an Email
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {[
                { type: 'text', placeholder: 'Your Name' },
                { type: 'email', placeholder: 'Email Address' },
                { type: 'text', placeholder: 'Company / Organisation' }
              ].map((field, i) => (
                <div key={i} className="mb-4">
                  <input 
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full p-3 rounded text-sm text-white placeholder-white/35 focus:outline-none transition-colors"
                    style={{background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'Inter, sans-serif'}}
                    onFocus={e => (e.target.style.borderColor = '#047FFF')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>
              ))}
              <div className="mb-4">
                <textarea 
                  placeholder="Tell me about your marketing goals and challenges…"
                  rows={4}
                  className="w-full p-3 rounded text-sm text-white placeholder-white/35 focus:outline-none transition-colors resize-vertical"
                  style={{background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'Inter, sans-serif'}}
                  onFocus={e => (e.target.style.borderColor = '#047FFF')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                ></textarea>
              </div>
              <button 
                className="w-full text-white py-3 rounded text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all"
                style={{background: 'linear-gradient(135deg, #047FFF, #19E9E3)', fontFamily: 'Inter, sans-serif'}}
                onClick={handleSubmit}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-white/35 text-center py-8 px-[5%] text-xs tracking-wider" style={{background: '#070f18'}}>
        <p style={{fontFamily: 'Inter, sans-serif'}}>© 2025 Logicology Marketing Team · Premium Marketing Solutions · <a href="mailto:marketing@logicology.com" className="text-white/35 hover:text-white/55 transition-colors" style={{fontFamily: 'Inter, sans-serif'}}>marketing@logicology.com</a></p>
      </footer>
    </main>
  );
}