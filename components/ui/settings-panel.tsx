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
          className="bg-zinc-900 border border-zinc-800 px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 max-w-7xl mx-auto mt-4 rounded-lg shadow-2xl z-40 relative"
        >
          <div className="space-y-1 max-w-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Github className="w-4 h-4 text-zinc-400" />
              GitHub 访问令牌
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              填写 GitHub Personal Access Token 可以提升 API 调用次数上限（无需任何权限，只读即可）。令牌仅保存在你的浏览器中。
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto h-10">
            <input
              type="password"
              placeholder="ghp_..."
              value={githubPat}
              onChange={(e) => dispatch({ type: "SET_GITHUB_PAT", payload: e.target.value })}
              className="bg-zinc-950 border border-zinc-700 hover:border-zinc-600 focus:border-amber-500 text-zinc-200 h-full px-4 text-xs rounded-lg font-mono placeholder:text-zinc-600 focus:outline-none w-full md:w-72 transition-colors"
            />
            <button
              onClick={() => dispatch({ type: "SET_GITHUB_PAT", payload: "" })}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium h-full px-4 rounded-lg transition-colors border border-zinc-700 cursor-pointer"
            >
              清空
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
