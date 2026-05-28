"use client";

import { Settings } from "lucide-react";
import { useRepoForgeState, useRepoForgeDispatch } from "@/hooks/use-repo-forge-state";

export default function Header() {
  const { showSettings } = useRepoForgeState();
  const dispatch = useRepoForgeDispatch();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-50 px-6 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-black text-zinc-950 text-base">
          RF
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white">RepoForge</h1>
            <span className="text-[9px] bg-zinc-800 border border-zinc-700 text-amber-400 px-1.5 py-0.5 font-mono font-bold rounded">
              DeepSeek
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-sans">
            把多个 GitHub 开源项目，组合成一个完整产品
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: "SET_SHOW_SETTINGS", payload: !showSettings })}
          className={`flex items-center gap-1.5 text-[11px] font-sans font-medium px-3 py-2 rounded-lg border transition-all ${
            showSettings
              ? "border-amber-500/50 bg-amber-950/20 text-amber-400"
              : "border-zinc-700 hover:border-zinc-600 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>设置 Token</span>
        </button>
      </div>
    </header>
  );
}
