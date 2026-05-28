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
      dispatch({ type: "SET_URL_ERROR", payload: "请输入有效的 GitHub 仓库地址，例如：https://github.com/vercel/ai" });
      return;
    }
    const isDup = repos.some(
      (r) => r.owner.toLowerCase() === parsed.owner.toLowerCase() && r.repo.toLowerCase() === parsed.repo.toLowerCase()
    );
    if (isDup) {
      dispatch({ type: "SET_URL_ERROR", payload: "这个仓库已经添加过了。" });
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
    <div className="max-w-4xl mx-auto border border-zinc-800 bg-zinc-900/30 rounded-xl p-6 md:p-8 space-y-6">
      <div className="space-y-2 border-b border-zinc-800 pb-4">
        <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-amber-400 block">
          第 1 步
        </span>
        <h2 className="text-2xl font-bold text-white leading-tight">
          导入你的 GitHub 仓库
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          把你想组合的几个开源项目仓库链接贴进来，AI 会分析它们怎么搭配在一起。
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="粘贴 GitHub 仓库链接，如 https://github.com/vercel/ai"
              value={githubUrlInput}
              onChange={(e) => dispatch({ type: "SET_GITHUB_URL_INPUT", payload: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddRepository(); }}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-zinc-200 h-11 px-4 pl-10 rounded-lg text-sm placeholder:text-zinc-600 focus:outline-none transition-colors font-mono"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          </div>
          <button
            onClick={handleAddRepository}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>添加</span>
          </button>
        </div>
        {urlError && (
          <p className="text-red-400 text-sm flex items-center gap-2 bg-red-950/20 border border-red-900/30 px-4 py-2.5 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{urlError}</span>
          </p>
        )}
      </div>

      {/* Repo list */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 flex items-center justify-between">
          <span>已添加的仓库</span>
          <span className="text-amber-400 font-mono">{repos.length} 个</span>
        </h3>

        {repos.length === 0 ? (
          <div className="border border-dashed border-zinc-700 rounded-lg py-14 text-center text-zinc-500 text-sm space-y-2 bg-zinc-950/30">
            <GitBranch className="w-7 h-7 mx-auto text-zinc-600" />
            <p className="font-mono font-bold text-xs">还没有仓库</p>
            <p className="text-xs text-zinc-600">在上方粘贴 GitHub 链接，点击"添加"。</p>
          </div>
        ) : (
          <div className="space-y-3">
            {repos.map((repo, idx) => (
              <div
                key={repo.url + idx}
                className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all group"
              >
                <div className="flex items-start gap-3 flex-1 w-full">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                    <GitBranch className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-100">
                        {repo.owner}/{repo.repo}
                      </span>
                      <a href={repo.url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-amber-400 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <input
                      type="text"
                      placeholder="这个仓库在项目中起什么作用？（选填）"
                      value={repo.userNotes}
                      onChange={(e) => handleUpdateNotes(idx, e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500/30 text-sm text-zinc-300 px-3 py-2 rounded-lg focus:outline-none placeholder:text-zinc-600 transition-all font-sans"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveRepository(idx)}
                  className="text-zinc-500 hover:text-red-400 p-2 border border-zinc-800 hover:border-red-900/40 rounded-lg bg-zinc-900 hover:bg-red-950/10 transition-all self-end md:self-auto cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-zinc-800">
        <p className="text-xs text-zinc-500">至少 1 个仓库，推荐 2~3 个搭配</p>
        <button
          disabled={repos.length === 0}
          onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
          className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
            repos.length > 0
              ? "bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer shadow-lg shadow-amber-500/20"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          <span>下一步：设置偏好</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
