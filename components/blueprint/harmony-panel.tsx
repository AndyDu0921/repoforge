"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import { useRepoForgeState } from "@/hooks/use-repo-forge-state";

export default function HarmonyPanel() {
  const { blueprintResult } = useRepoForgeState();
  const conflicts = blueprintResult?.conflicts ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-2 border-b border-zinc-850 pb-5">
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-500 block">开源合规法务审计审查</span>
        <h3 className="text-xl font-black text-white font-mono uppercase flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> <span>授权传染机制与异构阻尼排障规避</span>
        </h3>
        <p className="text-xs text-zinc-450 font-sans leading-relaxed pr-10">
          排查是否有强传染性质的开源许可证（如 GPL, AGPL）导致的混合系统私有业务资产泄露传染，并出具隔离方案规避机制。
        </p>
      </div>

      {conflicts.length > 0 ? (
        <div className="space-y-4">
          {conflicts.map((conf: any, idx: number) => (
            <div key={idx} className="border border-amber-900/25 bg-amber-950/5 p-6 rounded-none space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
                <span className="text-xs font-black text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> 授权风险类型: {conf.category}
                </span>
                <span className="text-[8px] uppercase tracking-widest font-bold py-1 px-2 border border-amber-700/50 text-amber-400 bg-amber-950/30">自解耦规避防区</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-600 block uppercase font-black font-mono">阻阻摩擦细节</span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium">{conf.description}</p>
                </div>
                <div className="space-y-1.5 bg-zinc-950 border border-zinc-850 p-4 rounded-none">
                  <span className="text-[9px] text-amber-505 block uppercase font-black font-mono">架构师推荐的防渗漏规避隔离底座</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-mono mt-0.5 font-medium">{conf.mitigation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-zinc-850 rounded-none py-14 text-center text-zinc-500 text-xs space-y-2 bg-zinc-950/30 font-mono">
          <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 stroke-1" />
          <p className="font-mono uppercase tracking-widest font-black text-zinc-200 text-[11px]">开源授权配对一切优良</p>
          <p className="text-[10px] text-zinc-600 font-sans">未探测到任何 GPL / AGPL 的法理冲突或致命的版本同名文件碰撞。</p>
        </div>
      )}
    </div>
  );
}
