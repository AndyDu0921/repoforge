"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import { useRepoForgeState } from "@/hooks/use-repo-forge-state";

export default function HarmonyPanel() {
  const { blueprintResult } = useRepoForgeState();
  const conflicts = blueprintResult?.conflicts ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">许可证检查</span>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> 开源许可证风险
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          检查所选仓库的许可证是否存在冲突，特别是 GPL/AGPL 等传染性协议可能影响你的代码能否闭源。
        </p>
      </div>

      {conflicts.length > 0 ? (
        <div className="space-y-4">
          {conflicts.map((conf: any, idx: number) => (
            <div key={idx} className="border border-amber-900/25 bg-amber-950/5 rounded-lg p-5 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> 风险类型：{conf.category}
                </span>
                <span className="text-xs font-mono font-bold py-1 px-2 border border-amber-700/50 text-amber-400 bg-amber-950/30 rounded">建议规避</span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-zinc-500 block font-bold mb-1">问题描述</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{conf.description}</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                  <span className="text-xs text-amber-400 block font-bold mb-1">建议的解决方案</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{conf.mitigation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-zinc-700 rounded-lg py-12 text-center text-sm space-y-2 bg-zinc-950/30">
          <CheckCircle className="w-8 h-8 mx-auto text-green-400" />
          <p className="font-bold text-zinc-200">未发现许可证冲突</p>
          <p className="text-zinc-500">所有仓库的许可证在你的使用场景下互相兼容。</p>
        </div>
      )}
    </div>
  );
}
