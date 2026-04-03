import { Key, X, ExternalLink } from 'lucide-react';

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
}

export function AIConfigModal({ isOpen, onClose, apiKey, onSave }: AIConfigModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#18181b] border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-100">AI Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <p className="text-sm text-zinc-400 leading-relaxed">
            Enter your Google Gemini API key to unlock AI-powered JSON generation. Your key is stored securely in your browser's local storage and is never sent to our servers.
          </p>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              GEMINI API KEY
            </label>
            <input
              type="password"
              placeholder="••••••••••••••••••••••••••••••••••••••"
              defaultValue={apiKey}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSave(e.currentTarget.value);
                  onClose();
                }
              }}
              className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-600"
              autoFocus
            />
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Get an API key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={(e) => {
              const input = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input');
              if (input) {
                onSave(input.value);
                onClose();
              }
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
}
