import Editor from '@monaco-editor/react';
import { AlignLeft, Trash2 } from 'lucide-react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  error?: string | null;
}

export function JsonEditor({ value, onChange, error }: JsonEditorProps) {
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // If invalid JSON, we can't format it
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div
      className="flex flex-col h-full border-r"
      style={{
        background: 'rgba(14,14,18,0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'rgba(99,102,241,0.12)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 border-b shrink-0"
        style={{ background: 'rgba(9,9,11,0.6)', borderColor: 'rgba(99,102,241,0.12)' }}
      >
        <div className="flex items-center space-x-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Input JSON</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFormat}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Format JSON"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 rounded hover:bg-red-900/20 text-zinc-400 hover:text-red-400 transition-colors"
              title="Clear Editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {error && (
          <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded truncate max-w-[150px]" title={error}>
            {error}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          defaultLanguage="json"
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            renderLineHighlight: 'all',
          }}
        />
      </div>
    </div>
  );
}
