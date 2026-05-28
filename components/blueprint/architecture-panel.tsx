"use client";

import { Layers } from "lucide-react";
import { useRepoForgeState } from "@/hooks/use-repo-forge-state";

export default function ArchitecturePanel() {
  const { blueprintResult } = useRepoForgeState();
  const mods = blueprintResult?.modules ?? [];
  const edges = blueprintResult?.architecture_diagram_data?.edges ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">技术架构</span>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" /> 各个仓库在项目中的角色
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          AI 分析了每个仓库的代码结构，给它们分配了明确的分工角色，避免功能重叠和依赖冲突。
        </p>
      </div>

      <div className="space-y-4">
        {mods.map((mod: any, index: number) => (
          <div key={index} className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-sm font-bold text-amber-400 font-mono">{mod.repo}</span>
              <span className="text-xs font-mono bg-zinc-900 text-zinc-300 font-bold px-2.5 py-1 border border-zinc-700 rounded">
                角色：{mod.role}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-zinc-300 leading-relaxed">
                <strong className="text-zinc-400">技术兼容性：</strong> {mod.technical_compatibility}
              </p>
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-zinc-500 block font-bold">主要能力：</span>
                {(mod.key_features ?? []).map((f: string, i: number) => (
                  <span key={i} className="text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-2 py-0.5 border border-zinc-700 rounded transition-colors">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {edges.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4 font-mono">
          <h4 className="text-sm font-bold text-zinc-200">模块关系</h4>
          <div className="space-y-2.5 text-sm">
            {edges.map((edge: any, sIdx: number) => (
              <div key={sIdx} className="flex items-center gap-2 bg-zinc-900/30 border border-zinc-800 rounded-lg p-3 pl-4">
                <span className="text-zinc-300 font-bold">{edge.from}</span>
                <span className="text-zinc-500 text-xs">──({edge.label})──❯</span>
                <span className="text-amber-400 font-bold">{edge.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
