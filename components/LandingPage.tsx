
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Play, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MessageCircle, 
  Zap, 
  Globe, 
  Smartphone, 
  Menu, 
  X as XIcon,
  ShieldCheck,
  BarChart3,
  Wallet,
  MonitorPlay
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// --- Animation Styles ---
const marqueeStyle = {
  display: 'flex',
  width: '100%',
  overflow: 'hidden',
  userSelect: 'none' as const,
};

// --- Mock Data ---
const TICKER_IMAGES = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup, isDarkMode, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
        setScrolled(container.scrollTop > 20);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Fixed positioning ensures this container takes over the viewport scrolling behavior
    <div ref={scrollRef} className="fixed inset-0 w-full h-full overflow-y-auto bg-[#020205] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden scroll-smooth z-0">
      
      {/* --- INLINE STYLES FOR ANIMATIONS --- */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .glass-panel {
          background: rgba(20, 20, 25, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
        }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#020205]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { if(scrollRef.current) scrollRef.current.scrollTop = 0; }}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
               <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
            </div>
            <span className="text-xl font-bold tracking-tight">ClipJack</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">FAQ</a>
            <div className="h-4 w-px bg-white/10" />
            <button onClick={onLogin} className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">Login</button>
            <button 
              onClick={onSignup}
              className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-all transform hover:scale-105"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <XIcon /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0c] border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
            <a href="#features" className="text-gray-300" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-gray-300" onClick={() => setMobileMenuOpen(false)}>How it works</a>
            <button onClick={onLogin} className="text-left text-gray-300">Login</button>
            <button onClick={onSignup} className="bg-indigo-600 text-white py-3 rounded-lg font-bold">Get Started</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        
        {/* Background Marquee (Faded) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0 grayscale mix-blend-screen mask-gradient-to-b">
           <div className="flex flex-col gap-8 transform -rotate-3 scale-110">
              <div style={marqueeStyle}>
                <div className="flex gap-4 animate-scroll">
                  {[...TICKER_IMAGES, ...TICKER_IMAGES].map((src, i) => (
                    <img key={i} src={src} className="w-80 h-48 object-cover rounded-xl" alt="" />
                  ))}
                </div>
              </div>
              <div style={marqueeStyle}>
                <div className="flex gap-4 animate-scroll" style={{ animationDirection: 'reverse' }}>
                  {[...TICKER_IMAGES, ...TICKER_IMAGES].map((src, i) => (
                    <img key={i} src={src} className="w-80 h-48 object-cover rounded-xl" alt="" />
                  ))}
                </div>
              </div>
           </div>
           {/* Gradient Overlay for Text Readability */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#020205]/80 to-[#020205]"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-[#020205] via-transparent to-[#020205]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          
          {/* Trusted Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-in fade-in zoom-in duration-700">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border border-black bg-gray-700 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="" />
                  </div>
                ))}
             </div>
             <span className="text-xs font-medium text-gray-300 pl-2">Trusted by 20,000+ Creators</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">
            Get Paid to <br/> Make Content.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            ClipJack connects Content Creators with AI-powered tools and monetization opportunities. For any niche, experience level, and account size.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onSignup}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight size={18} />
            </button>
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Log In
            </button>
          </div>

        </div>
      </header>

      {/* --- BENTO GRID SECTION --- */}
      <section className="py-24 relative" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">We Connect You with <span className="text-indigo-500">Opportunities</span></h2>
             <p className="text-gray-400 max-w-2xl mx-auto">Create content, grow your audience, and get paid directly through our platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
             
             {/* Card 1: Wallet */}
             <div className="glass-panel rounded-3xl p-8 md:col-span-1 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-600/30 transition-all"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400"><Wallet size={24} /></div>
                   <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Balance</div>
                </div>
                
                <div className="relative z-10">
                   <div className="text-4xl font-mono font-bold text-white mb-1">$12,450</div>
                   <div className="text-sm text-gray-400">Total Earnings</div>
                   
                   {/* Mini Chart Visual */}
                   <div className="flex items-end gap-1 h-12 mt-6 opacity-50">
                      {[40, 60, 45, 70, 50, 80, 65, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Card 2: Growth */}
             <div className="glass-panel rounded-3xl p-8 md:col-span-1 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-600/30 transition-all"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><TrendingUp size={24} /></div>
                   <div className="text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded text-xs">+18%</div>
                </div>
                
                <div className="relative z-10">
                   <div className="text-4xl font-bold text-white mb-1">2.4M</div>
                   <div className="text-sm text-gray-400">Total Views</div>
                   <div className="mt-4 text-xs text-gray-500">Over the last 30 days</div>
                </div>
             </div>

             {/* Card 3: Campaigns (Taller) */}
             <div className="glass-panel rounded-3xl p-8 md:col-span-1 md:row-span-2 flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><Zap size={20} /></div>
                   <h3 className="font-bold text-lg">Active Campaigns</h3>
                </div>

                <div className="space-y-4 flex-1">
                   {[
                     { name: 'Tech Review', payout: '$1,200', brand: 'Samsung' },
                     { name: 'Fashion Haul', payout: '$800', brand: 'Zara' },
                     { name: 'Crypto News', payout: '$2,500', brand: 'Coinbase' },
                     { name: 'Gaming Clip', payout: '$500', brand: 'Razer' },
                   ].map((c, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-gray-300">
                              {c.brand[0]}
                           </div>
                           <div>
                              <div className="text-sm font-bold text-gray-200">{c.name}</div>
                              <div className="text-xs text-gray-500">{c.brand}</div>
                           </div>
                        </div>
                        <div className="text-sm font-bold text-green-400">{c.payout}</div>
                     </div>
                   ))}
                </div>
                
                <button onClick={onSignup} className="mt-6 w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                   View All Campaigns
                </button>
             </div>

             {/* Card 4: Top Creators (Wide) */}
             <div className="glass-panel rounded-3xl p-8 md:col-span-2 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Users size={20} /></div>
                      <h3 className="font-bold text-lg">Top Creators</h3>
                   </div>
                   <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">This Week</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {[
                     { name: 'Sarah J.', country: 'USA', earned: '$56,834', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
                     { name: 'David K.', country: 'UK', earned: '$33,657', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' }
                   ].map((creator, i) => (
                      <div key={i} className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/5">
                         <div className="flex items-center gap-3">
                            <img src={creator.img} className="w-10 h-10 rounded-full object-cover" alt="" />
                            <div>
                               <div className="font-bold text-gray-200">{creator.name}</div>
                               <div className="text-xs text-gray-500 flex items-center gap-1"><Globe size={10} /> {creator.country}</div>
                            </div>
                         </div>
                         <div className="text-lg font-bold text-white">{creator.earned}</div>
                      </div>
                   ))}
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-[#050508] border-t border-white/5" id="how-it-works">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-16">How it Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
               {/* Connecting Line (Desktop) */}
               <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-900 to-transparent z-0"></div>

               {[
                 { step: '01', title: 'Upload or Generate', desc: 'Use our AI tools to clip videos or generate shorts from scratch.', icon: <MonitorPlay /> },
                 { step: '02', title: 'Go Viral', desc: 'Post to TikTok, Shorts & Reels. Our AI optimizes for engagement.', icon: <TrendingUp /> },
                 { step: '03', title: 'Get Paid', desc: 'Earn from platform funds or brand sponsorships directly.', icon: <DollarSign /> }
               ].map((item, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-3xl bg-[#0a0a0e] border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative group transition-all hover:-translate-y-2">
                       <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="text-indigo-400 w-10 h-10">{item.icon}</div>
                       <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 border-4 border-[#050508] flex items-center justify-center text-xs font-bold">{item.step}</div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- FAQ SECTION (Chat Style) --- */}
      <section className="py-32 relative overflow-hidden" id="faq">
         <div className="max-w-3xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">FAQ</h2>
               <p className="text-xl text-gray-400">Common questions that might be on your mind.</p>
            </div>

            <div className="space-y-8">
               {/* Q1 */}
               <div className="flex flex-col gap-4">
                  <div className="self-end max-w-[85%] md:max-w-[70%]">
                     <div className="bg-indigo-600/20 border border-indigo-500/30 text-white p-6 rounded-3xl rounded-tr-sm backdrop-blur-sm animate-in slide-in-from-right-10 fade-in duration-700">
                        <p className="font-medium">How much can I actually make?</p>
                     </div>
                     <div className="text-right mt-2 text-xs text-gray-500 font-bold tracking-wider mr-2">YOU</div>
                  </div>

                  <div className="self-start max-w-[90%] md:max-w-[80%] flex gap-4">
                     <div className="flex-shrink-0 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                           <img src="https://ui-avatars.com/api/?name=Support&background=random&color=fff&bold=true" className="w-full h-full object-cover" alt="Support" />
                        </div>
                     </div>
                     <div>
                        <div className="bg-[#121217] border border-white/10 text-gray-200 p-6 rounded-3xl rounded-tl-sm shadow-xl">
                           <p className="leading-relaxed">Top creators earn <span className="text-white font-bold">$10k+ monthly</span>. Average active creators make $500-2000. It depends on your output, content quality, and campaign selection. The more you post, the more you earn.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Q2 */}
               <div className="flex flex-col gap-4">
                  <div className="self-end max-w-[85%] md:max-w-[70%]">
                     <div className="bg-indigo-600/20 border border-indigo-500/30 text-white p-6 rounded-3xl rounded-tr-sm backdrop-blur-sm">
                        <p className="font-medium">Can I work on multiple campaigns?</p>
                     </div>
                     <div className="text-right mt-2 text-xs text-gray-500 font-bold tracking-wider mr-2">YOU</div>
                  </div>

                  <div className="self-start max-w-[90%] md:max-w-[80%] flex gap-4">
                     <div className="flex-shrink-0 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                           <img src="https://ui-avatars.com/api/?name=Support&background=random&color=fff&bold=true" className="w-full h-full object-cover" alt="Support" />
                        </div>
                     </div>
                     <div>
                        <div className="bg-[#121217] border border-white/10 text-gray-200 p-6 rounded-3xl rounded-tl-sm shadow-xl">
                           <p className="leading-relaxed">Yes. Most creators work on 3-5 campaigns simultaneously. You can pick campaigns that match your content style and interests.</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Q3 */}
               <div className="flex flex-col gap-4">
                  <div className="self-end max-w-[85%] md:max-w-[70%]">
                     <div className="bg-indigo-600/20 border border-indigo-500/30 text-white p-6 rounded-3xl rounded-tr-sm backdrop-blur-sm">
                        <p className="font-medium">How do I get started?</p>
                     </div>
                     <div className="text-right mt-2 text-xs text-gray-500 font-bold tracking-wider mr-2">YOU</div>
                  </div>

                  <div className="self-start max-w-[90%] md:max-w-[80%] flex gap-4">
                     <div className="flex-shrink-0 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                           <img src="https://ui-avatars.com/api/?name=Support&background=random&color=fff&bold=true" className="w-full h-full object-cover" alt="Support" />
                        </div>
                     </div>
                     <div>
                        <div className="bg-[#121217] border border-white/10 text-gray-200 p-6 rounded-3xl rounded-tl-sm shadow-xl">
                           <p className="leading-relaxed mb-4">Simply click on the button below and create your account. It takes 30 seconds.</p>
                           <button onClick={onSignup} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                              Create Free Account
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/10 bg-[#020205] text-center">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
               </div>
               <span className="font-bold text-white">ClipJack</span>
            </div>
            
            <div className="text-gray-500 text-sm">
               © 2024 ClipJack AI. All rights reserved.
            </div>

            <div className="flex gap-6">
               <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Terms</a>
               <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Privacy</a>
               <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Twitter</a>
            </div>
         </div>
      </footer>

    </div>
  );
};
