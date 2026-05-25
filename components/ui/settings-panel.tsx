"use client";

import { motion, AnimatePresence } from "motion/react";
import { Github } from "lucide-react";
import { useRepoForgeState, useRepoForgeDispatch } from "@/hooks/use-repo-forge-state";

export default function SettingsPanel() {
  const { showSettings, githubPat } = useRepoForgeState();
  const dispatch = useRepoForgeDispatch();

  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="bg-zinc-900 border border-zinc-850 px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-7xl mx-auto mt-6 rounded-none shadow-2xl z-40 relative"
        >
          <div className="space-y-1 max-w-xl">
            <h3 className="text-[11px] uppercase tracking-widest font-black text-amber-500 flex items-center gap-2">
              <Github className="w-4 h-4 text-zinc-400" />
              配置 GitHub 个人访问令牌 (PAT)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              GitHub API 针对匿名请求施加每小时 60 次的硬率限制。使用经认证的 PAT 能够获得顺畅高频的读写载入能力，避免限制中断。令牌将安全保留于您客户端的{" "}
              <span className="font-mono bg-zinc-950 text-amber-450 px-1.5 py-0.5 border border-zinc-800 text-[10px]">localStorage</span>{" "}
              中。
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto h-11">
            <input
              type="password"
              placeholder="github_pat_..."
              value={githubPat}
              onChange={(e) => dispatch({ type: "SET_GITHUB_PAT", payload: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700/80 focus:border-amber-500 text-zinc-200 h-full px-4 text-xs rounded-none font-mono placeholder:text-zinc-700 focus:outline-none w-full md:w-80 transition-colors"
            />
            <button
              onClick={() => dispatch({ type: "SET_GITHUB_PAT", payload: "" })}
              className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[10px] font-mono uppercase tracking-widest font-bold h-full px-5 rounded-none transition-colors border border-zinc-800 cursor-pointer"
            >
              清空
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
