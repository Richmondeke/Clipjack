
import React, { useState } from 'react';
import { Scissors, Link as LinkIcon, Play, Loader2, ChevronRight, Smartphone, Youtube, BarChart2, Zap, Upload, FileVideo, CheckCircle, AlertCircle } from 'lucide-react';
import { Template } from '../types';
import { analyzeViralHooks } from '../services/geminiService';

interface ClippingEditorProps {
    onBack: () => void;
    onGenerate: (data: any) => Promise<void> | void;
    userCredits: number;
    template: Template;
}

export const ClippingEditor: React.FC<ClippingEditorProps> = ({ onBack, onGenerate, userCredits, template }) => {
    const [mode, setMode] = useState<'AI_REPURPOSE' | 'MANUAL'>('AI_REPURPOSE');
    
    // AI Repurpose State
    const [url, setUrl] = useState('');
    const [topic, setTopic] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('');
    const [clips, setClips] = useState<any[]>([]);
    const [step, setStep] = useState<'INPUT' | 'TOPIC_CONFIRM' | 'RESULTS'>('INPUT');

    // Manual Upload State
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleUrlSubmit = async () => {
        if (!url) return;
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
            alert("Please enter a valid YouTube URL.");
            return;
        }
        
        setIsAnalyzing(true);
        setLoadingStatus('Fetching video details...');
        
        try {
            // Use noembed.com (CORS friendly oEmbed) to get title
            const response = await fetch(`https://noembed.com/embed?url=${url}`);
            const data = await response.json();
            
            if (data.title) {
                setTopic(data.title);
            } else {
                setTopic("General YouTube Video"); // Fallback
            }
            setStep('TOPIC_CONFIRM');
        } catch (e) {
            console.warn("Auto-fetch failed", e);
            // Fallback to manual entry, don't block user
            setStep('TOPIC_CONFIRM');
        } finally {
            setIsAnalyzing(false);
            setLoadingStatus('');
        }
    };

    const handleAnalyze = async () => {
        if (!topic) return;
        setIsAnalyzing(true);
        setLoadingStatus('AI analyzing content potential...');
        
        try {
            const results = await analyzeViralHooks(topic);
            setClips(results);
            setStep('RESULTS');
        } catch (e) {
            alert("Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
            setLoadingStatus('');
        }
    };

    const handleCreateFromIdea = async (clip: any) => {
        // Pass the "Script Idea" to the Shorts Maker
        await onGenerate({
            isDirectSave: false, // We want to redirect, not save immediately
            type: 'CLIPPING',
            templateName: `Repurposed: ${clip.title}`,
            idea: clip.scriptIdea, // This is key - passes data to ShortsMaker
            shouldRedirect: true
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const handleManualClip = () => {
        alert("Manual clipping editor coming soon. Use AI Repurpose mode for now!");
    };

    return (
        <div className="h-full bg-black text-white flex flex-col overflow-hidden font-sans">
             {/* Header */}
             <div className="h-16 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between px-6 flex-shrink-0 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <ChevronRight className="rotate-180" size={20} />
                    </button>
                    <h3 className="font-bold text-lg text-gray-200">
                        AI Video Clipper
                    </h3>
                </div>
                
                <div className="flex bg-gray-800 rounded-lg p-1 text-xs font-bold">
                    <button 
                        onClick={() => setMode('AI_REPURPOSE')}
                        className={`px-3 py-1.5 rounded-md transition-all ${mode === 'AI_REPURPOSE' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        AI Repurpose
                    </button>
                    <button 
                        onClick={() => setMode('MANUAL')}
                        className={`px-3 py-1.5 rounded-md transition-all ${mode === 'MANUAL' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Manual Upload
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
                
                {mode === 'MANUAL' ? (
                     <div className="w-full max-w-xl text-center mt-10">
                        <div className="border-2 border-dashed border-gray-700 bg-gray-900/50 rounded-3xl p-10 flex flex-col items-center justify-center h-64">
                            {uploadedFile ? (
                                <div className="text-center">
                                    <FileVideo size={48} className="text-green-500 mx-auto mb-4" />
                                    <p className="font-bold text-lg">{uploadedFile.name}</p>
                                    <p className="text-gray-500 text-sm mb-6">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <button onClick={handleManualClip} className="bg-white text-black px-6 py-2 rounded-full font-bold">Open Editor</button>
                                </div>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center group">
                                    <Upload size={48} className="text-gray-600 group-hover:text-white transition-colors mb-4" />
                                    <span className="font-bold text-lg text-gray-400 group-hover:text-white transition-colors">Upload MP4 File</span>
                                    <span className="text-sm text-gray-600 mt-2">Max 50MB</span>
                                    <input type="file" accept="video/mp4" onChange={handleFileUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                     </div>
                ) : (
                    <>
                        {step === 'INPUT' && (
                            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 text-center mt-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20">
                                    <Scissors size={40} className="text-white" />
                                </div>
                                <h1 className="text-4xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Repurpose Content</h1>
                                <p className="text-gray-400 text-lg mb-10">Paste a YouTube URL. Our AI will analyze the topic and generate viral short concepts.</p>

                                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 flex items-center shadow-xl relative">
                                    <div className="p-3 bg-gray-800 rounded-xl text-red-500">
                                        <Youtube size={24} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Paste YouTube Link here..."
                                        className="flex-1 bg-transparent border-none text-white px-4 py-2 focus:ring-0 outline-none placeholder-gray-600"
                                        disabled={isAnalyzing}
                                    />
                                    <button 
                                        onClick={handleUrlSubmit}
                                        disabled={!url || isAnalyzing}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : 'Analyze'}
                                    </button>
                                </div>
                                {isAnalyzing && <p className="text-gray-500 text-sm mt-4 animate-pulse">{loadingStatus}</p>}
                            </div>
                        )}

                        {step === 'TOPIC_CONFIRM' && (
                            <div className="w-full max-w-xl animate-in fade-in slide-in-from-right-8 duration-500 mt-10">
                                <h2 className="text-2xl font-bold mb-6 text-center">Confirm Context</h2>
                                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Extracted Topic</label>
                                    <input 
                                        type="text" 
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. Productivity Hacks..."
                                        className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none mb-6 font-medium"
                                        autoFocus
                                    />
                                    
                                    <div className="flex items-start gap-3 bg-indigo-900/20 p-4 rounded-xl mb-6">
                                        <Zap className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                                        <p className="text-sm text-indigo-200">Gemini will now "watch" this topic and hallucinate 3 viral angles perfect for Shorts/Reels.</p>
                                    </div>

                                    <button 
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing || !topic}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {isAnalyzing ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                                        {isAnalyzing ? 'Generating Strategies...' : 'Generate Viral Ideas'}
                                    </button>
                                </div>
                                <button onClick={() => setStep('INPUT')} className="w-full text-center text-gray-500 mt-4 text-sm hover:text-white">Go Back</button>
                            </div>
                        )}

                        {step === 'RESULTS' && (
                            <div className="w-full max-w-5xl animate-in fade-in duration-500">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Viral Opportunities</h2>
                                        <p className="text-gray-400">Found {clips.length} ways to repurpose this topic into a Short.</p>
                                    </div>
                                    <button onClick={() => setStep('INPUT')} className="text-gray-500 hover:text-white transition-colors">Start Over</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {clips.map((clip) => (
                                        <div key={clip.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group hover:-translate-y-1 flex flex-col h-full">
                                            <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 relative p-6 flex flex-col justify-between">
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <Scissors size={80} />
                                                </div>
                                                <div className="flex justify-between items-start relative z-10">
                                                     <div className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                                                        AI Concept
                                                    </div>
                                                    <div className="bg-green-500/20 text-green-400 border border-green-500/50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                                        <BarChart2 size={12} /> {clip.viralScore}
                                                    </div>
                                                </div>
                                                <h3 className="font-bold text-lg text-white leading-tight relative z-10 line-clamp-2">{clip.title}</h3>
                                            </div>
                                            
                                            <div className="p-6 flex-1 flex flex-col">
                                                <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-1">{clip.description}</p>
                                                
                                                <div className="bg-black/30 p-3 rounded-lg mb-6 border border-gray-800">
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Generated Prompt</div>
                                                    <p className="text-xs text-gray-300 italic line-clamp-3">"{clip.scriptIdea}"</p>
                                                </div>

                                                <button 
                                                    onClick={() => handleCreateFromIdea(clip)}
                                                    className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                                >
                                                    <Smartphone size={18} /> Create AI Short
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
