import { Shuffle, Sparkles, Key, Braces } from 'lucide-react';

interface HeaderProps {
  onRandomize: () => void;
  onAiConfigClick: () => void;
  hasData: boolean;
  hasApiKey: boolean;
}

export function Header({ onRandomize, onAiConfigClick, hasData, hasApiKey }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 shrink-0 select-none border-b"
      style={{
        background: 'rgba(9,9,11,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(99,102,241,0.18)',
        zIndex: 10,
        position: 'relative',
      }}
    >
      <div className="flex items-center space-x-3">
        {/* Glowing logo icon */}
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl text-indigo-300"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.35) 0%, rgba(139,92,246,0.25) 100%)',
            border: '1px solid rgba(99,102,241,0.45)',
            boxShadow: '0 0 18px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full" />
            <Braces className="w-5 h-5 text-indigo-400 relative z-10" style={{ filter: 'drop-shadow(0 0 8px rgba(129,140,248,0.6))' }} />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-wide" style={{
            background: 'linear-gradient(90deg, #e2e8f0 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            API Mock UI
          </h1>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(139,92,246,0.8)' }}>
            JSON IDE Dashboard
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onRandomize}
          disabled={!hasData}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500"
          style={hasData ? {
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%)',
            border: '1px solid rgba(99,102,241,0.4)',
            color: '#a5b4fc',
            boxShadow: '0 0 12px rgba(99,102,241,0.15)',
            cursor: 'pointer',
          } : {
            background: 'rgba(24,24,27,0.5)',
            border: '1px solid rgba(63,63,70,0.5)',
            color: '#52525b',
            cursor: 'not-allowed',
          }}
          title={hasData ? 'Replace current values with random mock data' : 'Paste JSON to randomize'}
        >
          <Shuffle className="w-4 h-4" />
          <span>Randomize Data</span>
        </button>

        <button
          onClick={onAiConfigClick}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500"
          style={hasApiKey ? {
            background: 'rgba(39, 39, 42, 0.5)',
            border: '1px solid rgba(63, 63, 70, 0.8)',
            color: '#a1a1aa',
            boxShadow: 'none',
            cursor: 'pointer',
          } : {
            background: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(217,70,239,0.15) 100%)',
            border: '1px solid rgba(168,85,247,0.4)',
            color: '#d8b4fe',
            boxShadow: '0 0 12px rgba(168,85,247,0.15)',
            cursor: 'pointer',
          }}
          title={hasApiKey ? "AI is configured and ready" : "Configure AI"}
        >
          {hasApiKey ? <Sparkles className="w-4 h-4" /> : <Key className="w-4 h-4" />}
          <span>{hasApiKey ? "AI Ready" : "Configure AI"}</span>
        </button>
      </div>
    </header>
  );
}
