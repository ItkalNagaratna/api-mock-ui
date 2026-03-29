import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

interface CodeExporterProps {
  typeScript: string;
  zodSchema: string;
  mswHandler: string;
}

type TabType = 'typescript' | 'zod' | 'msw';

export function CodeExporter({ typeScript, zodSchema, mswHandler }: CodeExporterProps) {
  const [activeTab, setActiveTab] = useState<TabType>('typescript');
  const [copied, setCopied] = useState<TabType | null>(null);

  const getContent = () => {
    switch (activeTab) {
      case 'typescript': return typeScript;
      case 'zod': return zodSchema;
      case 'msw': return mswHandler;
      default: return '';
    }
  };

  const getFileName = () => {
    switch (activeTab) {
      case 'typescript': return 'types.ts';
      case 'zod': return 'schema.ts';
      case 'msw': return 'handlers.ts';
      default: return 'code.ts';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getContent());
      setCopied(activeTab);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([getContent()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = getFileName();
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'typescript', label: 'TypeScript', icon: <span className="text-[#3178C6] font-bold">TS</span> },
    { id: 'zod', label: 'Zod Schema', icon: <span className="text-[#3068b7] font-bold">Zod</span> },
    { id: 'msw', label: 'MSW Handler', icon: <span className="text-[#FF6A33] font-bold">MSW</span> },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: 'rgba(14,14,18,0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div
        className="flex items-center justify-between border-b shrink-0 pr-4"
        style={{ background: 'rgba(9,9,11,0.6)', borderColor: 'rgba(99,102,241,0.12)' }}
      >
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Download as file"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all border border-zinc-700 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Copy to clipboard"
          >
            {copied === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 custom-scrollbar" style={{ background: 'rgba(9,9,11,0.45)' }}>
        <pre className="font-mono text-[13px] leading-relaxed text-zinc-300">
          <code>{getContent()}</code>
        </pre>
      </div>
    </div>
  );
}
