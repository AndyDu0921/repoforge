"use client";

import { GitBranch, Search, Plus, Trash2, ExternalLink, AlertTriangle, ArrowRight } from "lucide-react";
import { useRepoForgeState, useRepoForgeDispatch } from "@/hooks/use-repo-forge-state";

function parseGithubUrl(url: string) {
  const cleanUrl = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
  const match = cleanUrl.match(/(?:github\.com\/|git@github\.com:)([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

export default function Step1Materials() {
  const { repos, githubUrlInput, urlError } = useRepoForgeState();
  const dispatch = useRepoForgeDispatch();

  const handleAddRepository = () => {
    dispatch({ type: "SET_URL_ERROR", payload: "" });
    const parsed = parseGithubUrl(githubUrlInput);
    if (!parsed) {
      dispatch({ type: "SET_URL_ERROR", payload: "请输入有效的 GitHub 仓库 URL（例如：https://github.com/owner/repo）" });
      return;
    }
    const isDup = repos.some(
      (r) => r.owner.toLowerCase() === parsed.owner.toLowerCase() && r.repo.toLowerCase() === parsed.repo.toLowerCase()
    );
    if (isDup) {
      dispatch({ type: "SET_URL_ERROR", payload: "此仓库已加载至熔炼舱内。" });
      return;
    }
    dispatch({
      type: "SET_REPOS",
      payload: [...repos, { url: githubUrlInput.trim(), owner: parsed.owner, repo: parsed.repo, userNotes: "" }],
    });
    dispatch({ type: "SET_GITHUB_URL_INPUT", payload: "" });
  };

  const handleRemoveRepository = (index: number) => {
    dispatch({ type: "SET_REPOS", payload: repos.filter((_, i) => i !== index) });
  };

  const handleUpdateNotes = (index: number, val: string) => {
    const updated = [...repos];
    updated[index] = { ...updated[index], userNotes: val };
    dispatch({ type: "SET_REPOS", payload: updated });
  };

  return (
    <div className="max-w-4xl mx-auto border border-zinc-850 bg-zinc-900/10 p-8 space-y-8 relative group">
      <div className="space-y-2 border-b border-zinc-850 pb-5">
        <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-amber-500 mb-1 block">
          阶段 01 // 熔炉物料原料
        </span>
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
          导入 GitHub 待融合物理仓库
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          输入多个您希望融合在同一技术底牌中的 GitHub 存储库，RepoForge 熔炼大模型会在后面对依赖树和功能拼图展开智能配准与融网审计。
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="输入要导入存储库的 URL (如: https://github.com/vercel/ai)"
              value={githubUrlInput}
              onChange={(e) => dispatch({ type: "SET_GITHUB_URL_INPUT", payload: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddRepository(); }}
              className="w-full bg-zinc-950 border border-zinc-850 focus:border-amber-500 text-zinc-150 h-11 px-4 pl-10 rounded-none text-xs placeholder:text-zinc-700 focus:outline-none transition-colors font-mono"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-650" />
          </div>
          <button
            onClick={handleAddRepository}
            className="bg-zinc-100 hover:bg-amber-500 text-zinc-950 px-6 rounded-none font-black text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>添加载入</span>
          </button>
        </div>
        {urlError && (
          <p className="text-red-400 text-xs font-mono mt-1 flex items-center gap-2 bg-red-950/15 border border-red-900/35 px-4 py-2.5 rounded-none">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{urlError}</span>
          </p>
        )}
      </div>

      {/* Repo list */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black font-mono tracking-widest text-zinc-400 uppercase flex items-center justify-between">
          <span>当前已登记熔入物料清单</span>
          <span className="text-amber-500 font-mono">已导入 {repos.length} 个存储库</span>
        </h3>

        {repos.length === 0 ? (
          <div className="border border-dashed border-zinc-850 rounded-none py-14 text-center text-zinc-500 text-xs space-y-2 bg-zinc-950/20">
            <GitBranch className="w-7 h-7 mx-auto stroke-1 text-zinc-700" />
            <p className="font-mono uppercase tracking-widest text-[10px] text-zinc-500 font-black">仓库装载舱呈空白态</p>
            <p className="text-[9px] text-zinc-600 font-sans">请在上方输入有效的开源 GitHub URL 并点击右侧添加以开展对配进行。</p>
          </div>
        ) : (
          <div className="space-y-3">
            {repos.map((repo, idx) => (
              <div
                key={repo.url + idx}
                className="bg-zinc-950 border border-zinc-850 rounded-none p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:border-zinc-750 transition-all font-mono"
              >
                <div className="flex items-start gap-4 flex-1 w-full">
                  <div className="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <GitBranch className="w-4.5 h-4.5 text-amber-500" />
                  </div>
                  <div className="space-y-2.5 w-full">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black uppercase font-mono tracking-tight text-zinc-150">
                        {repo.owner}/{repo.repo}
                      </span>
                      <a href={repo.url} target="_blank" rel="noreferrer" className="text-zinc-650 hover:text-amber-500 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <input
                      type="text"
                      placeholder="在该综合平台中对该起用物料的期望功能定位"
                      value={repo.userNotes}
                      onChange={(e) => handleUpdateNotes(idx, e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 hover:border-zinc-800/80 focus:border-amber-500/30 text-xs text-zinc-300 px-3.5 py-2 rounded-none focus:outline-none placeholder:text-zinc-750 transition-all font-sans"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveRepository(idx)}
                  className="text-zinc-500 hover:text-red-400 p-2.5 border border-zinc-900 hover:border-red-950/40 rounded-none bg-zinc-900/60 hover:bg-red-950/10 transition-all self-end md:self-auto cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="pt-6 flex items-center justify-between border-t border-zinc-900/80">
        <div className="text-[10px] text-zinc-550 font-mono leading-relaxed">
          * 熔炉引擎至少需要裝载 1 个物料。为保障融合度, V1 推荐输入 2-3 个互补的开源项目。
        </div>
        <button
          disabled={repos.length === 0}
          onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
          className={`px-8 py-3.5 rounded-none font-black text-xs uppercase tracking-widest flex items-center gap-2.5 transition-all ${
            repos.length > 0
              ? "bg-amber-500 hover:bg-amber-600 text-zinc-950 cursor-pointer shadow-lg shadow-amber-950/10"
              : "bg-zinc-850 text-zinc-650 cursor-not-allowed border border-zinc-800"
          }`}
        >
          <span>继续对齐调质选项</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
