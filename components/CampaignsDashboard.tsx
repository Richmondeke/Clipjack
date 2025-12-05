
import React, { useState } from 'react';
import { Ghost, ChefHat, Twitter, Youtube, Instagram, Search, Lock, Wallet, Compass, User, Globe, ArrowUpRight, DollarSign, Clock, CreditCard, CheckCircle2, AlertCircle, BarChart3, Link as LinkIcon, Share2, Award, Trophy, Zap, TrendingUp, Users, Plus, Unlink, X } from 'lucide-react';
import { AppView } from '../types';

interface CampaignsDashboardProps {
    onChangeView: (view: AppView) => void;
}

// Custom TikTok Icon
const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.394 6.394 0 0 0-5.394 10.137 6.388 6.388 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
  </svg>
);

// Custom Discord Icon
const DiscordIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
  </svg>
);

// --- Mock Data for Discover View ---

const LEADERBOARD = [
    { rank: 1, name: 'CryptoKing', handle: '@cryptok', earnings: '$4,200', points: 15400, trend: '+12%' },
    { rank: 2, name: 'SarahShorts', handle: '@sarahclips', earnings: '$3,150', points: 12200, trend: '+5%' },
    { rank: 3, name: 'ViralVince', handle: '@vincev', earnings: '$2,800', points: 11050, trend: '+8%' },
    { rank: 4, name: 'ClipMaster99', handle: '@clipm', earnings: '$1,200', points: 5400, trend: '-2%' },
    { rank: 5, name: 'NewbieFarmer', handle: '@farmbot', earnings: '$850', points: 3200, trend: '+20%' },
];

const OPPORTUNITIES = [
    { 
        id: 1, 
        brand: 'TechDaily', 
        title: 'AI News Recap', 
        payout: '$50 / 10k views', 
        difficulty: 'Medium', 
        slots: '5/20', 
        bg: 'from-blue-600 to-indigo-600',
        icon: <Zap size={20} />
    },
    { 
        id: 2, 
        brand: 'GymShark', 
        title: 'Workout Fails Reaction', 
        payout: '$100 / 10k views', 
        difficulty: 'Hard', 
        slots: '1/10', 
        bg: 'from-gray-800 to-black',
        icon: <TrendingUp size={20} />
    },
    { 
        id: 3, 
        brand: 'CoinBase', 
        title: 'Crypto Explainers', 
        payout: '$0.50 / 1k views', 
        difficulty: 'Easy', 
        slots: 'Unlimited', 
        bg: 'from-blue-500 to-cyan-500',
        icon: <DollarSign size={20} />
    },
];

// --- Sub-Components ---

const PrivateCampaignModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
                
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523060-8da1d56ae167?w=500&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                    <div className="absolute -bottom-6 left-6 flex items-end gap-4 z-10">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" className="w-20 h-20 rounded-2xl border-4 border-[#0a0a0a] shadow-lg" alt="Austyn" />
                        <div className="mb-1.5 drop-shadow-md">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Austyn</h2>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-8 bg-[#0a0a0a]">
                    
                    {/* Header Info */}
                    <div className="flex items-start justify-between mb-6 pl-1">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="bg-[#5865F2] p-1.5 rounded-lg text-white"><DiscordIcon size={18}/></div>
                                <h3 className="font-bold text-white text-xl">Austyn</h3>
                            </div>
                            <div className="text-gray-500 text-sm mb-3 font-medium">DWY Example</div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide">Clipping</span>
                                <span className="bg-gray-800 text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide border border-gray-700">Personal Brand</span>
                                <div className="flex gap-3 text-gray-400 ml-2">
                                    <TikTokIcon size={14} className="hover:text-white transition-colors" />
                                    <Instagram size={14} className="hover:text-white transition-colors" />
                                    <Globe size={14} className="hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Offer */}
                    <div className="mb-6">
                        <p className="font-bold text-white text-sm leading-relaxed">
                            Post Austyn Clips and earn <span className="text-green-400">$1000 PER 1M VIEWS</span> 💸🔥
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="bg-[#111] rounded-xl p-4 mb-6 border border-gray-800/50">
                        <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider">
                            <span className="text-white">Budget Progress</span>
                            <span className="text-gray-400">$0 / $5,000</span>
                        </div>
                        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-2 rounded-full" />
                        </div>
                    </div>

                    {/* Select Accounts */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-300 mb-3 block flex justify-between">
                            Select Social Accounts <span className="text-red-500">*</span>
                        </label>
                        <div className="bg-[#111] border border-gray-800 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:border-gray-700 transition-colors">
                            <div className="mb-3 text-gray-600 group-hover:text-gray-500 transition-colors">
                                <div className="relative">
                                    <Unlink size={32} />
                                    <div className="absolute -top-1 -right-1 text-red-500 bg-[#111] rounded-full">
                                        <AlertCircle size={14} fill="currentColor" className="text-black" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-white font-bold text-sm mb-4">No available accounts</p>
                            <button className="flex items-center gap-2 bg-[#222] hover:bg-[#333] border border-gray-700 hover:border-gray-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg">
                                <Plus size={14} /> Add Account
                            </button>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3.5 bg-[#1a1a1a] hover:bg-[#252525] text-white rounded-xl font-bold transition-colors text-sm border border-gray-800">
                            Cancel
                        </button>
                        <button className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors text-sm shadow-lg shadow-indigo-900/20">
                            Join Campaign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const WalletView = () => (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Balance */}
            <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Wallet size={120} className="text-indigo-500" />
                </div>
                <div className="relative z-10">
                    <div className="text-gray-400 font-medium mb-1 flex items-center gap-2"><DollarSign size={16} className="text-green-500"/> Total Earnings</div>
                    <div className="text-5xl font-bold text-white tracking-tight mb-6">$0.00</div>
                    
                    <div className="flex gap-4">
                        <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <ArrowUpRight size={18} /> Withdraw
                        </button>
                        <button className="bg-gray-800 text-white border border-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors">
                            Payout Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Pending */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col justify-between">
                <div>
                    <div className="text-gray-400 font-medium mb-1 flex items-center gap-2"><Clock size={16} className="text-yellow-500"/> Pending</div>
                    <div className="text-3xl font-bold text-white">$0.00</div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-2">Next Payout</div>
                    <div className="text-white font-medium">No payouts scheduled</div>
                </div>
            </div>
        </div>

        {/* Transactions */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-white text-lg">Transaction History</h3>
                <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">Export CSV</button>
            </div>
            <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard size={24} />
                </div>
                <p>No transactions yet.</p>
            </div>
        </div>
    </div>
);

const ProfileView = () => (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
                U
            </div>
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">User</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="text-gray-400 text-sm">Creator ID: #882910</span>
                    <span className="bg-green-900/30 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Verified
                    </span>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="text-center px-4">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Clips</div>
                </div>
                <div className="w-px bg-gray-800 h-10 self-center"></div>
                <div className="text-center px-4">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Views</div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Social Connections */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                    <Share2 size={18} className="text-indigo-500" /> Linked Accounts
                </h3>
                <div className="space-y-4">
                    {[
                        { name: 'TikTok', icon: <TikTokIcon />, connected: false },
                        { name: 'Instagram', icon: <Instagram />, connected: false },
                        { name: 'YouTube', icon: <Youtube />, connected: false },
                    ].map((platform) => (
                        <div key={platform.name} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-800 rounded-lg text-white">
                                    {React.cloneElement(platform.icon as React.ReactElement, { size: 18 })}
                                </div>
                                <span className="font-medium text-gray-300">{platform.name}</span>
                            </div>
                            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                                Connect
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements / Trust Score */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                    <Award size={18} className="text-yellow-500" /> Creator Score
                </h3>
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 bg-gray-800 h-3 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full w-[15%]"></div>
                    </div>
                    <span className="font-bold text-white">15/100</span>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        <CheckCircle2 size={16} className="text-green-500" /> Email Verified
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-700"></div> Complete 1st Campaign
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-700"></div> Link Social Account
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const DiscoverView = () => (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold text-white">Discover</h2>
                <p className="text-gray-400">Find active campaigns and see who's topping the charts.</p>
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                Refresh Data
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: Leaderboard */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 lg:col-span-1 h-fit">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20} /> Weekly Leaderboard
                </h3>
                
                <div className="space-y-4">
                    {LEADERBOARD.map((user) => (
                        <div key={user.rank} className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-gray-800 hover:border-gray-700 transition-colors">
                            <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg text-sm ${
                                user.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                                user.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                                user.rank === 3 ? 'bg-orange-700/20 text-orange-400' :
                                'bg-gray-800 text-gray-500'
                            }`}>
                                #{user.rank}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-white truncate">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.handle}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-green-400">{user.earnings}</div>
                                <div className={`text-[10px] font-bold ${user.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                    {user.trend}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                    <p className="text-xs text-gray-500 mb-3">You are currently ranked <span className="text-white font-bold">#842</span></p>
                    <button className="w-full py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors">
                        View Full Rankings
                    </button>
                </div>
            </div>

            {/* RIGHT: Opportunities */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="text-indigo-500" size={20} /> Active Opportunities
                    </h3>
                    <div className="flex gap-2">
                        <span className="text-xs font-bold text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">Filter: All</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {OPPORTUNITIES.map((opp) => (
                        <div key={opp.id} className="group relative bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-gray-600 transition-all duration-300 overflow-hidden cursor-pointer">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${opp.bg} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opp.bg} flex items-center justify-center text-white shadow-lg`}>
                                    {opp.icon}
                                </div>
                                <div className="text-xs font-bold bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">
                                    {opp.difficulty}
                                </div>
                            </div>

                            <div className="mb-6 relative z-10">
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{opp.brand}</div>
                                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{opp.title}</h4>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-green-400 font-bold bg-green-900/20 px-2 py-0.5 rounded">{opp.payout}</span>
                                    <span className="text-gray-500 flex items-center gap-1"><Users size={12}/> {opp.slots}</span>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                View Details <ArrowUpRight size={16} />
                            </button>
                        </div>
                    ))}
                    
                    {/* Coming Soon Card */}
                    <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 mb-3">
                            <Clock size={20} />
                        </div>
                        <h4 className="text-white font-bold mb-1">More Coming Soon</h4>
                        <p className="text-gray-500 text-sm">New campaigns drop every Tuesday.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const CampaignsView = ({ onDiscover, onJoinPrivate }: { onDiscover: () => void, onJoinPrivate: () => void }) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
        {/* Empty State Composition */}
        <div className="relative mb-12">
            {/* Central Ghost */}
            <div className="w-40 h-40 bg-gray-800 rounded-full flex items-center justify-center relative shadow-2xl z-10 border border-gray-700">
                <Ghost size={80} className="text-gray-300 fill-gray-300/10" />
                
                {/* Chef Hat Accessory */}
                <div className="absolute -top-8 -left-4 transform -rotate-12 bg-gray-900 rounded-full p-2 border border-gray-700 shadow-xl">
                    <ChefHat size={48} className="text-white" />
                </div>
            </div>

            {/* Floating Social Icons */}
            <div className="absolute -top-2 -right-8 bg-black border border-gray-800 p-2.5 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '0s' }}>
                <Instagram size={24} className="text-pink-500" />
            </div>
            <div className="absolute top-20 -right-16 bg-black border border-gray-800 p-2.5 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <TikTokIcon size={24} className="text-white" />
            </div>
            <div className="absolute top-24 -left-12 bg-black border border-gray-800 p-2.5 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                <Youtube size={24} className="text-red-500 fill-current" />
            </div>
            <div className="absolute -top-4 -left-6 bg-black border border-gray-800 p-2.5 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                <Twitter size={24} className="text-white fill-current" />
            </div>
        </div>

        {/* Text & Actions */}
        <div className="text-center max-w-md z-10">
            <h2 className="text-2xl font-bold text-white mb-8">You haven't joined any campaigns yet</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full">
                <button 
                    onClick={onDiscover}
                    className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                    <Search size={18} /> Discover Campaigns
                </button>
                <button 
                    onClick={onJoinPrivate}
                    className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:bg-white/5"
                >
                    <Lock size={18} /> Join Private Campaign
                </button>
            </div>
        </div>
    </div>
);

// --- Main Component ---

export const CampaignsDashboard: React.FC<CampaignsDashboardProps> = ({ onChangeView }) => {
    const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'WALLET' | 'DISCOVER' | 'PROFILE'>('CAMPAIGNS');
    const [isPrivateModalOpen, setIsPrivateModalOpen] = useState(false);

    const handleDiscover = () => {
        // Changed from redirecting to templates to switching internal tab
        setActiveTab('DISCOVER');
    };

    return (
        <div className="h-full bg-black text-white flex flex-col font-sans overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-center p-6 border-b border-gray-900/50">
                <div className="flex items-center gap-1 bg-gray-900/50 p-1 rounded-2xl border border-gray-800 backdrop-blur-md">
                    <button 
                        onClick={() => setActiveTab('CAMPAIGNS')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'CAMPAIGNS' 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Globe size={16} /> Campaigns
                    </button>
                    <button 
                        onClick={() => setActiveTab('WALLET')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'WALLET' 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Wallet size={16} /> Wallet
                    </button>
                    <button 
                        onClick={() => setActiveTab('DISCOVER')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'DISCOVER' 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Compass size={16} /> Discover
                    </button>
                    <button 
                        onClick={() => setActiveTab('PROFILE')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === 'PROFILE' 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <User size={16} /> Profile
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 h-full flex flex-col">
                    {activeTab === 'CAMPAIGNS' && <CampaignsView onDiscover={handleDiscover} onJoinPrivate={() => setIsPrivateModalOpen(true)} />}
                    {activeTab === 'WALLET' && <WalletView />}
                    {activeTab === 'DISCOVER' && <DiscoverView />}
                    {activeTab === 'PROFILE' && <ProfileView />}
                </div>
            </div>
            
            {/* Private Campaign Modal */}
            {isPrivateModalOpen && <PrivateCampaignModal onClose={() => setIsPrivateModalOpen(false)} />}

            {/* Styles for animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
