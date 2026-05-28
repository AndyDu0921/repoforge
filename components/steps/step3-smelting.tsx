"use client";

import { useEffect, useCallback, useRef } from "react";
import { Cpu, AlertTriangle, RefreshCw } from "lucide-react";
import { useRepoForgeState, useRepoForgeDispatch } from "@/hooks/use-repo-forge-state";

function resolveTechLabel(pref: string): string {
  if (pref === "typescript-next") return "Pure TypeScript (Next.js / Tailwind)";
  if (pref === "python-ai") return "Python AI Backend (FastAPI + React)";
  if (pref === "go-rust") return "Go/Rust High Performance backend stack";
  return "Container Docker Agnostic microservices mesh";
}

export default function Step3Smelting() {
  const { repos, audience, audienceCustom, commercial, commercialCustom, licenseChoice, licenseCustom, techPreference, techCustom, targetGoal, githubPat, smeltingLogs, smeltingProgress, apiError } = useRepoForgeState();
  const dispatch = useRepoForgeDispatch();
  const abortRef = useRef<AbortController | null>(null);

  const appendLog = useCallback(
    (msg: string, progress: number) => {
      dispatch({ type: "APPEND_SMELTING_LOG", payload: msg });
      dispatch({ type: "SET_SMELTING_PROGRESS", payload: progress });
    },
    [dispatch]
  );

  const runSmelting = useCallback(async () => {
    dispatch({ type: "RESET_SMELTING" });
    dispatch({ type: "SET_STEP", payload: 3 });

    appendLog("正在启动分析引擎...", 5);
    appendLog("已读取你的项目配置。", 10);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const response = await fetch("/api/repo-analyze/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repos: repos.map((r) => ({ owner: r.owner, repo: r.repo, userNotes: r.userNotes })),
          dialogueAnswers: {
            audience,
            audienceCustom,
            commercial,
            commercialCustom,
            licenseChoice,
            licenseCustom,
            techPreference: resolveTechLabel(techPreference),
            techCustom,
            targetGoal,
          },
          customToken: githubPat || undefined,
        }),
        signal: abort.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || "分析服务暂不可用，请稍后重试。");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("服务暂不可用。");

      const decoder = new TextDecoder();
      let buffer = "";

      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        streamDone = done;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
        }
        const lines = buffer.split("\n");
        buffer = streamDone ? "" : lines.pop() || "";

        let currentEvent = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              handleSSEEvent(currentEvent, parsed);
            } catch { /* skip */ }
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      dispatch({
        type: "SET_API_ERROR",
        payload: err.message || "分析出错，请检查网络后重试。",
      });
    }
  }, [repos, audience, audienceCustom, commercial, commercialCustom, licenseChoice, licenseCustom, techPreference, techCustom, targetGoal, githubPat, dispatch, appendLog]);

  function handleSSEEvent(event: string, data: any) {
    switch (event) {
      case "stage":
        appendLog(data.message, data.progress);
        break;
      case "result":
        dispatch({ type: "SET_SMELTING_PROGRESS", payload: 100 });
        dispatch({ type: "SET_BLUEPRINT_RESULT", payload: data.data });
        dispatch({ type: "SET_STEP", payload: 4 });
        break;
      case "error":
        dispatch({ type: "SET_API_ERROR", payload: data.message });
        break;
    }
  }

  useEffect(() => {
    runSmelting();
    return () => { abortRef.current?.abort(); };
  }, []); // eslint-disable-line

  return (
    <div className="max-w-2xl mx-auto border border-zinc-800 bg-zinc-900/30 rounded-xl p-6 md:p-8 space-y-6 flex flex-col items-center justify-center min-h-[440px] text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none scale-150 animate-pulse duration-[3000ms]" />

      {/* Spinner */}
      <div className="relative">
        <div className="w-14 h-14 border-2 border-zinc-700 border-t-amber-500 animate-spin rounded-full shadow-lg" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <span className="text-xs font-bold text-amber-400 font-mono animate-pulse">
          {smeltingProgress}%
        </span>
        <h2 className="text-xl font-bold text-white">AI 正在分析你的项目组合</h2>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
          读取仓库信息、分析依赖关系、检测潜在问题、搜索补充组件...
        </p>
      </div>

      {/* Log console */}
      <div className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-left font-mono text-xs text-zinc-400 space-y-1.5 h-44 overflow-y-auto relative z-10">
        <div className="text-zinc-600 border-b border-zinc-800 pb-2 mb-2 flex items-center justify-between font-bold">
          <span>分析日志</span>
          <span className="animate-pulse w-2 h-2 rounded-full bg-green-500" />
        </div>
        {smeltingLogs.map((log, idx) => (
          <p key={idx} className="text-zinc-500 transition-colors">
            <span className="text-amber-500">❯</span> {log}
          </p>
        ))}
      </div>

      {apiError && (
        <div className="bg-red-950/15 border border-red-900/30 p-5 rounded-lg text-left text-sm space-y-3 w-full">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-400">分析中断</p>
              <p className="text-zinc-400 text-xs mt-1">{apiError}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-red-900/15">
            <button onClick={runSmelting} className="bg-red-950/30 hover:bg-red-900/20 text-red-300 font-bold px-4 py-2 border border-red-800 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 transition-colors">
              <RefreshCw className="w-3 h-3" /> 重试
            </button>
            <button onClick={() => dispatch({ type: "SET_STEP", payload: 2 })} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700 rounded-lg cursor-pointer text-xs transition-colors">
              返回修改设置
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
