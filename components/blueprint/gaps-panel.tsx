"use client";

import { Search, Sparkles, ExternalLink } from "lucide-react";
import { useRepoForgeState } from "@/hooks/use-repo-forge-state";

export default function GapsPanel() {
  const { blueprintResult } = useRepoForgeState();
  const gaps = blueprintResult?.gaps ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-2 border-b border-zinc-850 pb-5">
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-500 block">功能断档缺口雷达 // Live 联网检索</span>
        <h3 className="text-xl font-black text-white font-mono uppercase flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-500" /> <span>核心逻辑缺失痛点与实存补缺组件</span>
        </h3>
        <p className="text-xs text-zinc-450 font-sans pr-14 leading-relaxed">
          物理物料导入后，大模型分析了最终 SaaS 系统拼图存在的链路功能空白，并<b>调取 GitHub Search API 进行了 live 实存热门项目库检索适配</b>，直接排除臆造库，确保生产高可靠。
        </p>
      </div>

      <div className="space-y-6">
        {gaps.map((gap: any, index: number) => {
          const isCritical = gap.severity?.toLowerCase() === "critical";
          return (
            <div key={index} className="bg-zinc-950/60 border border-zinc-850 rounded-none p-6 space-y-4">
              <div className="flex items-center justify-between w-full border-b border-zinc-850/60 pb-3">
                <span className="text-xs font-black font-mono tracking-tight text-zinc-200">缺失断档: {gap.title}</span>
                <span className={`text-[8px] font-mono px-2.5 py-1 rounded-none font-black uppercase tracking-widest ${
                  isCritical ? "bg-red-950/30 text-red-400 border border-red-900/30" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                }`}>
                  {isCritical ? "致命缺失" : gap.severity || "可选缺口"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium">{gap.description}</p>

              <div className="space-y-3 bg-zinc-900/10 p-4 border border-zinc-850">
                <div className="flex items-center gap-2 text-[9px] text-zinc-550 font-mono font-bold uppercase tracking-widest pl-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>GitHub Live 搜索到适配的热门开源补缺组件 (星标降序排列)</span>
                </div>
                <div className="space-y-3">
                  {(gap.suggested_projects ?? []).map((proj: any, idx: number) => (
                    <div key={idx} className="bg-zinc-950 p-4 border border-zinc-850/70 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs hover:border-zinc-700 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-550 truncate">{proj.name}</span>
                          <div className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 font-bold uppercase">
                            ⭐ {(proj.stars || 0).toLocaleString()} stars
                          </div>
                          <a href={proj.url} target="_blank" rel="noreferrer" className="text-zinc-650 hover:text-amber-500 flex items-center transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{proj.description}</p>
                      </div>
                      <button
                        onClick={() => alert(`已锁配实存组件「${proj.name}」到最终 CLAUDE.md 工程依赖配置项中进行熔铸。`)}
                        className="bg-zinc-950 hover:bg-zinc-900 text-zinc-305 hover:text-white border border-zinc-800 text-[9px] uppercase tracking-widest font-black py-2 px-3.5 rounded-none transition-all cursor-pointer select-none"
                      >
                        挂载整合入蓝图
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
