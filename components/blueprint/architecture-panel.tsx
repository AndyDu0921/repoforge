"use client";

import { Layers } from "lucide-react";
import { useRepoForgeState } from "@/hooks/use-repo-forge-state";

export default function ArchitecturePanel() {
  const { blueprintResult } = useRepoForgeState();
  const mods = blueprintResult?.modules ?? [];
  const edges = blueprintResult?.architecture_diagram_data?.edges ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-2 border-b border-zinc-850 pb-5">
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-500 block">物料在复合平台职责配对</span>
        <h3 className="text-xl font-black text-white font-mono uppercase flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" /> <span>已熔接之物理开源模块角色分配</span>
        </h3>
        <p className="text-xs text-zinc-450 font-sans pr-14 leading-relaxed">
          DeepSeek 解析了导入仓库的代码规模、核心控制器或视图部分，向其派驻以下明确职责，保障不发生冗量重合冲突。
        </p>
      </div>

      <div className="space-y-5">
        {mods.map((mod: any, index: number) => (
          <div key={index} className="bg-zinc-950 border border-zinc-850 p-6 rounded-none space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850/50 pb-2.5">
              <span className="text-xs font-black font-mono text-amber-500 uppercase tracking-tight">{mod.repo}</span>
              <span className="text-[9px] font-mono bg-zinc-900 text-zinc-300 font-bold px-3 py-1 border border-zinc-800 uppercase tracking-widest">
                派驻职责: {mod.role}
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                <strong className="text-zinc-350">物料同构与技术兼容方案判定：</strong> {mod.technical_compatibility}
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[9px] text-zinc-550 block font-bold uppercase tracking-widest">抽取引渡核心特征:</span>
                {(mod.key_features ?? []).map((f: string, i: number) => (
                  <span key={i} className="text-[9px] font-mono bg-zinc-900 hover:bg-zinc-850 text-zinc-305 px-2 py-0.5 border border-zinc-805 uppercase tracking-wide">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {edges.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-850 p-6 space-y-5 font-mono">
          <h4 className="text-xs font-black uppercase text-zinc-300 tracking-wider">综合架构集成关系物理走向流</h4>
          <div className="space-y-4 text-xs font-mono">
            {edges.map((edge: any, sIdx: number) => (
              <div key={sIdx} className="flex flex-col md:flex-row md:items-center gap-2 bg-zinc-900/20 border border-zinc-850 p-3.5 pl-5 relative before:absolute before:left-2.5 before:top-4 before:w-1.5 before:h-1.5 before:bg-amber-500">
                <div>
                  <span className="text-zinc-400 font-bold mr-1 bg-zinc-900 px-2 py-0.5 border border-zinc-800 text-[10px]">{edge.from}</span>
                  <span className="text-zinc-650 font-bold mx-2">──({edge.label})──❯</span>
                  <span className="text-amber-500 font-bold bg-amber-950/20 px-2 py-0.5 border border-amber-900/40 text-[10px]">{edge.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
