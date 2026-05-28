"use client";

import { Search, ExternalLink } from "lucide-react";
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
          AI 扫描了你的仓库组合，识别出以下能力空白，并自动在 GitHub 上搜索了真实可用的补充项目。
        </p>
      </div>

      {gaps.length === 0 ? (
        <div className="border-2 border-dashed border-zinc-700 rounded-lg py-10 text-center text-sm space-y-2 bg-zinc-950/30">
          <Search className="w-6 h-6 mx-auto text-zinc-500" />
          <p className="font-bold text-zinc-300">未发现明显功能缺失</p>
          <p className="text-zinc-500">你导入的仓库组合覆盖了所有核心功能。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {gaps.map((gap: any, index: number) => {
            const isCritical = gap.severity?.toLowerCase() === "critical";
            const hasProjects = gap.suggested_projects?.length > 0;

            return (
              <div key={index} className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-100">{gap.title}</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                    isCritical ? "bg-red-950/30 text-red-400 border border-red-900/30" : "bg-zinc-900 text-zinc-400 border border-zinc-700"
                  }`}>
                    {isCritical ? "重要" : "可选"}
                  </span>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed">{gap.description}</p>

                {/* Suggested projects — compact list */}
                <div className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-3">
                  <p className="text-xs text-zinc-500 font-bold mb-2">
                    {hasProjects ? "GitHub 上找到的匹配项目" : "未找到匹配的开源项目"}
                  </p>
                  {hasProjects ? (
                    <div className="space-y-1.5">
                      {gap.suggested_projects.map((proj: any, idx: number) => (
                        <a
                          key={idx}
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm hover:bg-zinc-800/50 rounded px-2 py-1.5 transition-colors group"
                        >
                          <span className="text-amber-400 font-bold font-mono text-xs truncate">{proj.name}</span>
                          <span className="text-xs text-zinc-500 shrink-0">⭐ {(proj.stars || 0).toLocaleString()}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-amber-400 transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">AI 识别到这里缺少功能，但在 GitHub 上暂未找到合适匹配。建议自行搜索或用现有库组合实现。</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
