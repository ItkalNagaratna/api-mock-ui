import { Shuffle, Zap } from 'lucide-react';

interface HeaderProps {
  onRandomize: () => void;
  hasData: boolean;
}

export function Header({ onRandomize, hasData }: HeaderProps) {
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
          <Zap className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.9))' }} />
        </div>

        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-wide" style={{
            background: 'linear-gradient(90deg, #e2e8f0 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            API Mock &amp; Play
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
      </div>
    </header>
  );
}
