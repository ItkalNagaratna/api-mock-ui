import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Type, Hash, ToggleLeft, Database, List, FileJson } from 'lucide-react';
import type { JsonValue } from '../utils/typeGenerator';

interface TreeViewProps {
  data: JsonValue;
}

const getTypeColor = (value: JsonValue): string => {
  if (value === null) return 'text-zinc-500';
  if (Array.isArray(value)) return 'text-purple-400';
  switch (typeof value) {
    case 'string': return 'text-emerald-400';
    case 'number': return 'text-blue-400';
    case 'boolean': return 'text-rose-400';
    case 'object': return 'text-indigo-400';
    default: return 'text-zinc-400';
  }
};

const getTypeIcon = (value: JsonValue) => {
  if (value === null) return <Database className="w-3.5 h-3.5 text-zinc-500" />;
  if (Array.isArray(value)) return <List className="w-3.5 h-3.5 text-purple-400" />;
  switch (typeof value) {
    case 'string': return <Type className="w-3.5 h-3.5 text-emerald-400" />;
    case 'number': return <Hash className="w-3.5 h-3.5 text-blue-400" />;
    case 'boolean': return <ToggleLeft className="w-3.5 h-3.5 text-rose-400" />;
    case 'object': return <FileJson className="w-3.5 h-3.5 text-indigo-400" />;
    default: return <Database className="w-3.5 h-3.5 text-zinc-400" />;
  }
};

const getTypeName = (value: JsonValue): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

interface TreeNodeProps {
  nodeKey: string;
  value: JsonValue;
  isLast?: boolean;
  level?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ nodeKey, value, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const hasChildren = isObject || isArray;

  const entries = hasChildren ? Object.entries(value) : [];

  return (
    <div className="font-mono text-[13px] leading-relaxed select-none">
      <div
        className={`flex items-start py-0.5 hover:bg-white/5 rounded px-1 -ml-1 cursor-pointer transition-colors duration-150`}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        <div className="flex items-center w-5 h-5 justify-center mr-1 opacity-60">
          {hasChildren ? (
            isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <span className="w-3.5 h-3.5" />
          )}
        </div>

        <div className="flex items-center flex-1 min-w-0 mr-2">
          {nodeKey && (
            <>
              <span className="text-zinc-300 font-medium mr-1.5 truncate">{nodeKey}</span>
              <span className="text-zinc-600 mr-2">:</span>
            </>
          )}

          <div className="flex items-center space-x-2 shrink-0">
            {getTypeIcon(value)}
            <span className="text-zinc-500 text-[11px] italic mr-2">{getTypeName(value)}</span>
          </div>

          {!hasChildren && (
            <span className={`${getTypeColor(value)} truncate max-w-[200px] ml-1`}>
              {typeof value === 'string' ? `"${value}"` : String(value)}
            </span>
          )}

          {hasChildren && !isExpanded && (
            <span className="text-zinc-500 ml-2">
              {isArray ? `[${entries.length} items]` : `{${entries.length} keys}`}
            </span>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="border-l border-zinc-800 ml-[10px] mt-0.5 mb-0.5">
          {entries.map(([childKey, childValue], index) => (
            <TreeNode
              key={childKey}
              nodeKey={isArray ? '' : childKey}
              value={childValue as JsonValue}
              isLast={index === entries.length - 1}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function TreeView({ data }: TreeViewProps) {
  if (data === undefined) {
    return (
      <div
        className="flex items-center justify-center h-full text-sm"
        style={{ color: 'rgba(99,102,241,0.5)' }}
      >
        Awaiting JSON input...
      </div>
    )
  }

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
        className="flex items-center px-4 py-2 border-b shrink-0"
        style={{ background: 'rgba(9,9,11,0.6)', borderColor: 'rgba(99,102,241,0.12)' }}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(165,180,252,0.7)' }}>Visual Tree</span>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <TreeNode nodeKey="root" value={data} />
      </div>
    </div>
  );
}
