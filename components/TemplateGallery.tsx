
import React, { useState, useEffect } from 'react';
import { Loader2, ShoppingBag, Clapperboard, Sparkles, Scissors, Search, ArrowRight, Smartphone, Video, Layers, Trophy, Flame, Target, DollarSign, CheckCircle2, X } from 'lucide-react';
import { Template, HeyGenAvatar, ClippingProject } from '../types';
import { getAvatars } from '../services/heygenService';

export interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  heyGenKey?: string;
  initialView?: 'DASHBOARD' | 'AVATAR_SELECT';
  userProfile?: any;
  recentProjects?: any[];
}

type GalleryView = 'DASHBOARD' | 'AVATAR_SELECT';

// Mock Clipping Campaigns
const CLIPPING_PROJECTS: ClippingProject[] = [
    {
        id: 'cp_1',
        title: 'Future Tech Review',
        brand: 'TechDaily',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
        reward_pool: '$10,000',
        payout_model: '$2.00 per 1k views',
        category: 'Technology',
        brief: 'Create a 30-second viral short discussing the potential of AI in daily life. Must be upbeat and futuristic.',
        requirements: ['Use "Cyberpunk" visual style', 'Voice: Puck (Energetic)', 'Mention "AI Revolution" in script'],
        recommended_voice: 'Puck',
        recommended_style: 'Cyberpunk'
    },
    {
        id: 'cp_2',
        title: 'Summer Fashion Haul',
        brand: 'VogueStyles',
        thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
        reward_pool: '$5,000',
        payout_model: '$1.50 per 1k views',
        category: 'Fashion',
        brief: 'Showcase trending summer outfits. Focus on bright colors and luxury aesthetics.',
        requirements: ['Use "Luxury" visual style', 'Voice: Kore (Calm)', 'Format: 9:16 Vertical'],
        recommended_voice: 'Kore',
        recommended_style: 'Luxury'
    },
    {
        id: 'cp_3',
        title: 'Crypto Market Update',
        brand: 'CoinBase Pro',
        thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a440bbabb91?q=80&w=2070&auto=format&fit=crop',
        reward_pool: '$15,000',
        payout_model: '$3.00 per 1k views',
        category: 'Finance',
        brief: 'Explain a recent crypto trend in simple terms. Keep it informative and trustworthy.',
        requirements: ['Use "Corporate" visual style', 'Voice: Charon (Deep)', 'No financial advice disclaimer'],
        recommended_voice: 'Charon',
        recommended_style: 'Corporate'
    }
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate, heyGenKey, initialView = 'DASHBOARD', userProfile, recentProjects = [] }) => {
  const [view, setView] = useState<GalleryView>(initialView);
  const [avatars, setAvatars] = useState<HeyGenAvatar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Clipping Project State
  const [selectedCampaign, setSelectedCampaign] = useState<ClippingProject | null>(null);

  const handleStartCampaign = (campaign: ClippingProject) => {
      const template: Template = {
          id: `campaign_${campaign.id}`,
          name: `Clip: ${campaign.title}`,
          category: 'Campaign',
          thumbnailUrl: campaign.thumbnail,
          variables: [
              { key: 'idea', label: 'Idea', type: 'textarea', defaultValue: campaign.brief },
              { key: 'style', label: 'Style', type: 'text', defaultValue: campaign.recommended_style }
          ],
          mode: 'SHORTS'
      };
      onSelectTemplate(template);
      setSelectedCampaign(null);
  };

  // --- CORE TOOLS CONFIGURATION ---
  const CORE_TOOLS = [
    {
        id: 'shorts_maker',
        title: 'Shorts Maker',
        desc: 'Turn ideas into viral vertical videos with AI.',
        icon: <Smartphone size={32} />,
        color: 'bg-rose-500',
        bg: 'bg-rose-50 dark:bg-rose-900/10',
        text: 'text-rose-500',
        isHot: true,
        onClick: () => onSelectTemplate({ id: 'shorts', name: 'Shorts Maker', thumbnailUrl: '', variables: [], mode: 'SHORTS', category: 'AI' })
    },
    {
        id: 'video_clipper',
        title: 'AI Video Clipper',
        desc: 'Repurpose long-form YouTube videos into shorts.',
        icon: <Scissors size={32} />,
        color: 'bg-indigo-500',
        bg: 'bg-indigo-50 dark:bg-indigo-900/10',
        text: 'text-indigo-500',
        isHot: false,
        onClick: () => onSelectTemplate({ id: 'clipper', name: 'AI Video Clipper', thumbnailUrl: '', variables: [], mode: 'CLIPPING', category: 'AI' })
    }
  ];

  const filteredTools = CORE_TOOLS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // MAIN DASHBOARD VIEW
  return (
    <>
    <div className="h-full overflow-y-auto p-4 md:p-8 no-scrollbar bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto pb-24 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">ClipJack Studio</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Create, Edit, and Clip videos in seconds.</p>
            </div>
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search tools..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
            </div>
        </div>

        {/* Contest Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 group cursor-pointer hover:scale-[1.01] transition-transform">
            <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                <Trophy size={240} />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30 mb-4 shadow-sm">
                    <Flame size={12} className="text-yellow-300 fill-yellow-300" /> 
                    Live Contest
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm">
                    Enter our Clipping Contest
                </h2>
                <p className="text-lg md:text-xl font-medium text-white/95 leading-relaxed mb-8 max-w-2xl drop-shadow-sm">
                    For every <span className="font-extrabold bg-white/20 px-2 py-0.5 rounded-lg border border-white/20">1,000 views</span> you get with clips created on ClipJack, we pay you <span className="font-extrabold text-yellow-300">$1</span>.
                </p>
                <button 
                    onClick={() => onSelectTemplate({ id: 'clipper', name: 'AI Video Clipper', thumbnailUrl: '', variables: [], mode: 'CLIPPING', category: 'AI' })}
                    className="bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all flex items-center gap-2 group-hover:gap-3"
                >
                    Start Clipping <ArrowRight size={18} />
                </button>
            </div>
        </div>

        {/* Core Tools Grid */}
        <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="text-indigo-500" size={18} /> Core Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTools.map(tool => (
                    <div 
                        key={tool.id}
                        onClick={tool.onClick}
                        className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 cursor-pointer hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] dark:hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
                    >
                        {tool.isHot && (
                            <div className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                                POPULAR
                            </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-16 h-16 ${tool.bg} rounded-2xl flex items-center justify-center ${tool.text}`}>
                                {tool.icon}
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-full p-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                                <ArrowRight size={20} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.title}</h3>
                        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">{tool.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Active Clipping Campaigns Section */}
        <div>
             <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="text-green-500" size={18} /> Active Campaigns (Clipping)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CLIPPING_PROJECTS.map(project => (
                    <div 
                        key={project.id}
                        onClick={() => setSelectedCampaign(project)}
                        className="bg-gray-900 rounded-3xl overflow-hidden relative group cursor-pointer border border-gray-800 hover:border-green-500/50 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="h-40 relative">
                             <img src={project.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                             <div className="absolute top-4 left-4 bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                                {project.category}
                             </div>
                             <div className="absolute top-4 right-4 bg-black/60 text-white backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                <DollarSign size={12} className="text-green-400" />
                                {project.payout_model}
                             </div>
                        </div>
                        <div className="p-6 pt-2">
                             <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{project.brand}</div>
                             <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">{project.title}</h3>
                             <div className="flex items-center gap-3 text-sm text-gray-400">
                                 <span className="flex items-center gap-1"><Trophy size={14} className="text-yellow-500" /> Pool: {project.reward_pool}</span>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Recent Activity */}
        {recentProjects.length > 0 && (
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Projects</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {recentProjects.slice(0, 5).map((p, i) => (
                        <div key={i} className="min-w-[220px] h-36 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden relative group cursor-pointer hover:border-indigo-400 transition-colors">
                            <img src={p.thumbnailUrl || 'https://via.placeholder.com/200x120'} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                <p className="text-white text-xs font-bold truncate">{p.templateName}</p>
                                <p className="text-gray-300 text-[10px]">{new Date(p.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        </div>
    </div>

    {/* Campaign Details Modal */}
    {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="relative h-48 flex-shrink-0">
                    <img src={selectedCampaign.thumbnail} className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                    <button 
                        onClick={() => setSelectedCampaign(null)}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-6 left-6">
                        <div className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Target size={14} /> {selectedCampaign.brand}
                        </div>
                        <h2 className="text-3xl font-black text-white">{selectedCampaign.title}</h2>
                    </div>
                </div>
                
                <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">The Brief</h3>
                            <p className="text-gray-300 leading-relaxed">{selectedCampaign.brief}</p>
                        </div>
                        <div className="w-full md:w-48 flex-shrink-0 bg-gray-800 rounded-xl p-4 border border-gray-700">
                             <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Payout Structure</h4>
                             <div className="text-2xl font-bold text-white mb-1">{selectedCampaign.payout_model}</div>
                             <div className="text-xs text-yellow-500 flex items-center gap-1">
                                 <Trophy size={12} /> Pool: {selectedCampaign.reward_pool}
                             </div>
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Requirements</h3>
                        <ul className="space-y-3">
                            {selectedCampaign.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <button 
                        onClick={() => handleStartCampaign(selectedCampaign)}
                        className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                        <Clapperboard size={20} /> Start Creating Clip
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};