"use client";

import { Settings } from "lucide-react";
import { useRepoForgeState, useRepoForgeDispatch } from "@/hooks/use-repo-forge-state";

export default function Header() {
  const { showSettings } = useRepoForgeState();
  const dispatch = useRepoForgeDispatch();

  return (
    <header className="border-b border-zinc-900 bg-zinc-950/90 backdrop-blur sticky top-0 z-50 px-8 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 bg-amber-500 flex items-center justify-center font-black text-zinc-950 text-lg tracking-tighter">
          RF
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black tracking-tighter uppercase text-zinc-100">RepoForge</h1>
            <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-amber-500 px-2 py-0.5 font-mono tracking-wider font-bold uppercase">
              DeepSeek PRO ENGINE
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold">
            多物理 GitHub 仓库聚合合冶研判与提示词工程编排器
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: "SET_SHOW_SETTINGS", payload: !showSettings })}
          className={`flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest px-4 py-2.5 rounded-none border transition-all ${
            showSettings
              ? "border-amber-500 bg-amber-950/15 text-amber-400"
              : "border-zinc-850 hover:border-zinc-750 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>配置 GitHub 访问令牌</span>
        </button>
      </div>
    </header>
  );
}
