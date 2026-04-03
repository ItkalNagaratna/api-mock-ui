import { useState, useEffect } from 'react';
import { X, ExternalLink, Braces } from 'lucide-react';

interface AiConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AIGeneratorModal({ isOpen, onClose }: AiConfigModalProps) {
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-[440px] bg-[#18181b] border border-zinc-800 rounded-[20px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="relative p-7">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <Braces className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 6px rgba(129,140,248,0.5))' }} />
                        </div>
                        <h2 className="text-lg font-semibold text-zinc-100">AI Configuration</h2>
                    </div>

                    <p className="text-[13px] text-zinc-400 leading-relaxed mb-7 pb-1">
                        Enter your Google Gemini API key to unlock AI-powered JSON generation. Your key is stored securely in your browser's local storage and is never sent to our servers.
                    </p>

                    <div className="space-y-4">
                        <div className="space-y-2.5">
                            <label className="block text-[10px] font-bold text-zinc-500 tracking-[0.1em] uppercase">
                                Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your API key"
                                className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-400"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                        >
                            <span>Get an API key</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer"
                        >
                            Save Key
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
