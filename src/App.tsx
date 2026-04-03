import { useState, useMemo, useRef, useEffect } from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Header } from './components/Header';
import { JsonEditor } from './components/JsonEditor';
import { TreeView } from './components/TreeView';
import { CodeExporter } from './components/CodeExporter';
import { AnimatedBackground } from './components/AnimatedBackground';
import { useDebounce } from './hooks/useDebounce';
import { generateTypeScript, generateZodSchema, generateMswHandler, type JsonValue } from './utils/typeGenerator';
import { randomizeData } from './utils/mockGenerator';
import { Settings, Loader2, ArrowUp, Sparkles } from 'lucide-react';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { generateJsonData } from './utils/aiGenerator';

const DEFAULT_JSON = `{\n  "id": 1,\n  "name": "Jane Doe",\n  "isActive": true,\n  "tags": ["developer", "react"],\n  "profile": {\n    "github": "@janedoe",\n    "repoCount": 42\n  }\n}`;

function App() {
  const [jsonInput, setJsonInput] = useState<string>(DEFAULT_JSON);
  const [config, setConfig] = useState({
    interfaceName: 'ApiResponse',
    schemaName: 'apiResponseSchema',
    endpoint: '/api/endpoint'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const [hasApiKey, setHasApiKey] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const aiInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasApiKey(!!localStorage.getItem('gemini_api_key'));
  }, [showAiModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on '/' if not inside an input
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        aiInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounce the input for smoother typing experience
  const debouncedJsonInput = useDebounce(jsonInput, 300);

  // Parse JSON and handle errors
  const parsedState = useMemo(() => {
    try {
      if (!debouncedJsonInput.trim()) {
        return { data: null, error: null };
      }

      const parsed = JSON.parse(debouncedJsonInput);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return { data: null, error: 'Root element must be a JSON object' };
      } else {
        return { data: parsed, error: null };
      }
    } catch (err) {
      if (err instanceof Error) {
        return { data: null, error: err.message };
      } else {
        return { data: null, error: 'Invalid JSON' };
      }
    }
  }, [debouncedJsonInput]);

  const parsedData = parsedState.data;
  const jsonError = parsedState.error;

  // Memoize generated outputs to avoid unnecessary recalculation
  const { typeScript, zodSchema, mswHandler } = useMemo(() => {
    if (!parsedData) {
      return { typeScript: '', zodSchema: '', mswHandler: '' };
    }
    return {
      typeScript: generateTypeScript(parsedData, config.interfaceName),
      zodSchema: generateZodSchema(parsedData, config.schemaName),
      mswHandler: generateMswHandler(parsedData, config.endpoint),
    };
  }, [parsedData, config]);

  const handleRandomize = () => {
    if (parsedData) {
      const randomized = randomizeData(parsedData);
      const newJsonString = JSON.stringify(randomized, null, 2);
      setJsonInput(newJsonString);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;

    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      setShowAiModal(true);
      return;
    }

    setIsAiGenerating(true);
    setAiError(null);

    try {
      const jsonStr = await generateJsonData(apiKey, aiPrompt);
      JSON.parse(jsonStr); // Ensure validity before setting
      setJsonInput(jsonStr);
      setAiPrompt('');
    } catch (err: any) {
      console.error(err);
      setAiError(err?.message || 'Failed to generate JSON. Check your API key and prompt.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen text-zinc-100 font-sans overflow-hidden relative" style={{ background: 'transparent' }}>
      <AnimatedBackground />
      <Header onRandomize={handleRandomize} onAiConfigClick={() => setShowAiModal(true)} hasData={!!parsedData} hasApiKey={hasApiKey} />

      <AIGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />

      <main className="flex-1 overflow-hidden relative" style={{ zIndex: 1 }}>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute bottom-6 right-6 z-50 p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-lg transition-all active:scale-95 cursor-pointer"
          title="Generator Settings"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>

        {showSettings && (
          <div className="absolute bottom-20 right-6 z-50 w-72 p-4 rounded-xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-2xl animate-in slide-in-from-bottom-4">
            <h3 className="text-sm font-semibold mb-3 text-zinc-200">Generator Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Interface Name</label>
                <input
                  type="text"
                  value={config.interfaceName}
                  onChange={(e) => setConfig({ ...config, interfaceName: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Zod Schema Name</label>
                <input
                  type="text"
                  value={config.schemaName}
                  onChange={(e) => setConfig({ ...config, schemaName: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">MSW Endpoint</label>
                <input
                  type="text"
                  value={config.endpoint}
                  onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <PanelGroup orientation="horizontal" className="h-full w-full">
          {/* Left Pane: Editor */}
          <Panel defaultSize={33} minSize={20} className="h-full relative shadow-[4px_0_24px_-10px_rgba(0,0,0,0.5)] z-10">
            <JsonEditor
              value={jsonInput}
              onChange={(val) => setJsonInput(val || '')}
              error={jsonError}
            />
          </Panel>

          <ResizeHandle />

          {/* Middle Pane: Visual Tree */}
          <Panel defaultSize={33} minSize={20} className="h-full relative z-0">
            <TreeView data={parsedData as JsonValue} />
          </Panel>

          <ResizeHandle />

          {/* Right Pane: Code Exporter */}
          <Panel defaultSize={34} minSize={20} className="h-full relative z-0">
            <CodeExporter
              typeScript={typeScript}
              zodSchema={zodSchema}
              mswHandler={mswHandler}
            />
          </Panel>
        </PanelGroup>

        {/* Floating AI Command Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center w-full max-w-[500px] px-4 pointer-events-none">
          {aiError && (
            <div className="mb-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-xl flex items-center space-x-2 shadow-xl backdrop-blur-md pointer-events-auto w-fit max-w-full">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500/20 text-red-500 shrink-0 text-[10px] font-bold">!</span>
              <span className="truncate">{aiError}</span>
            </div>
          )}

          <div className="relative w-full shadow-[0_0_40px_-5px_rgba(0,0,0,0.8)] pointer-events-auto rounded-[20px]">
            <input
              ref={aiInputRef}
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAiGenerate();
              }}
              disabled={isAiGenerating}
              placeholder="Generate a new response... (Press '/')"
              className="w-full bg-[#09090b]/95 backdrop-blur-xl border border-zinc-800/80 rounded-[20px] pl-14 pr-12 py-[14px] text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all disabled:opacity-50"
            />
            {/* Logo at the front */}
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              {isAiGenerating ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-500/80" style={{ filter: 'drop-shadow(0 0 4px rgba(129,140,248,0.3))' }} />
                </div>
              )}
            </div>
            {aiPrompt.trim().length > 0 && !isAiGenerating && (
              <div className="absolute inset-y-0 right-2 flex items-center animate-in fade-in zoom-in-95 duration-200 z-10">
                <button
                  onClick={handleAiGenerate}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Custom resize handle component
function ResizeHandle() {
  return (
    <PanelResizeHandle
      className="w-1.5 flex items-center justify-center cursor-col-resize group z-20 transition-colors"
      style={{ background: 'rgba(9,9,11,0.6)', borderLeft: '1px solid rgba(99,102,241,0.1)', borderRight: '1px solid rgba(99,102,241,0.1)' }}
    >
      <div
        className="h-10 w-0.5 rounded-full transition-all duration-200 group-hover:h-16"
        style={{ background: 'rgba(99,102,241,0.3)' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 8px rgba(99,102,241,0.8)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      />
    </PanelResizeHandle>
  );
}

export default App;
