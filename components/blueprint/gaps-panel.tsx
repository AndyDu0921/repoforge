"use client";

import { Search, Sparkles, ExternalLink } from "lucide-react";
import { useRepoForgeState } from "@/hooks/use-repo-forge-state";

export default function GapsPanel() {
  const { blueprintResult } = useRepoForgeState();
  const gaps = blueprintResult?.gaps ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">能力检查</span>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-amber-400" /> 还缺什么功能？
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          AI 扫描了你的仓库组合后，发现了这些能力空白，并自动在 GitHub 上搜索了真实可用的补充项目。
        </p>
      </div>

      <div className="space-y-4">
        {gaps.map((gap: any, index: number) => {
          const isCritical = gap.severity?.toLowerCase() === "critical";
          return (
            <div key={index} className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-sm font-bold text-zinc-100">缺少：{gap.title}</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                  isCritical ? "bg-red-950/30 text-red-400 border border-red-900/30" : "bg-zinc-900 text-zinc-400 border border-zinc-700"
                }`}>
                  {isCritical ? "重要" : "可选"}
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{gap.description}</p>

              <div className="space-y-2.5 bg-zinc-900/20 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold pl-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>GitHub 上找到的匹配项目（按星标排序）</span>
                </div>
                <div className="space-y-2">
                  {(gap.suggested_projects ?? []).map((proj: any, idx: number) => (
                    <div key={idx} className="bg-zinc-950 rounded-lg p-3 border border-zinc-800 hover:border-zinc-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-sm transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-amber-400">{proj.name}</span>
                          <span className="text-xs bg-zinc-900 border border-zinc-700 text-zinc-400 px-1.5 py-0.5 font-bold rounded">
                            ⭐ {(proj.stars || 0).toLocaleString()}
                          </span>
                          <a href={proj.url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-amber-400 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-sans">{proj.description}</p>
                      </div>
                      <button
                        onClick={() => alert(`已将 ${proj.name} 加入方案。`)}
                        className="bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-bold py-1.5 px-3 rounded transition-all cursor-pointer shrink-0"
                      >
                        加入方案
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
