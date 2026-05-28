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

    appendLog("[00:01] 正在唤醒 RepoForge v1.0 全链合冶重构物理引擎...", 5);
    appendLog("[00:02] 系统载入对齐配置文件参数上下文...", 10);

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
        throw new Error(err?.error || `HTTP ${response.status}: 合冶算法运行中断。`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("流式响应不可用。");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              handleSSEEvent(currentEvent, parsed);
            } catch {
              // skip malformed
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error(err);
      dispatch({
        type: "SET_API_ERROR",
        payload: err.message || "合冶熔铸突发异常。请检查您的 GitHub 个人授权 Token 是否有效，或是否超出 API 会话上限。",
      });
    }
  }, [repos, audience, commercial, licenseChoice, techPreference, targetGoal, githubPat, dispatch, appendLog]);

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
    return () => {
      abortRef.current?.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-2xl mx-auto border border-zinc-850 bg-zinc-900/10 rounded-none p-8 space-y-8 flex flex-col items-center justify-center min-h-[460px] text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none scale-150 animate-pulse duration-[3000ms]" />

      <div className="relative">
        <div className="w-16 h-16 border-2 border-zinc-800 border-t-amber-500 animate-spin flex items-center justify-center shadow-lg" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-amber-500 rotate-12" />
        </div>
      </div>

      <div className="space-y-3.5 relative z-10">
        <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500 font-mono block animate-pulse">
          智能熔炼合流中 {smeltingProgress}%
        </span>
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
          DeepSeek 多物料合冶重组运转中
        </h2>
        <p className="text-xs text-zinc-450 max-w-sm mx-auto font-sans leading-relaxed">
          正在深度审验所导入 GitHub 物料的版本依存性、对齐技术底牌参数，调用 live API 进行实存补缺，编制标准指令体系...
        </p>
      </div>

      {/* Live streaming log console */}
      <div className="w-full bg-zinc-950 border border-zinc-850 rounded-none p-5 text-left font-mono text-[10px] text-zinc-405 space-y-2 h-48 overflow-y-auto relative z-10 selection:bg-zinc-800 selection:text-white">
        <div className="text-zinc-650 border-b border-zinc-900 pb-2 mb-2 uppercase flex items-center justify-between font-bold">
          <span>熔解分析核心日志 // 2026-05-25</span>
          <span className="animate-pulse w-2 h-2 rounded-none bg-amber-500" />
        </div>
        {smeltingLogs.map((log, idx) => (
          <p key={idx} className="line-clamp-1 last:text-amber-500 transition-colors">
            <span className="text-zinc-700">❯</span> {log}
          </p>
        ))}
      </div>

      {apiError && (
        <div className="text-red-450 bg-red-950/15 border border-red-900/35 p-5 rounded-none mt-4 text-left font-sans text-xs space-y-3.5 leading-relaxed w-full">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wide text-red-400 text-[11px] font-mono">物料合冶进程被阻断</p>
              <p className="text-zinc-400 text-[11px] mt-1 pr-4">{apiError}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-1.5 border-t border-red-900/15">
            <button
              onClick={runSmelting}
              className="bg-red-950/20 hover:bg-red-900/20 text-red-300 font-bold px-4 py-2 border border-red-800 cursor-pointer text-[9px] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3 animate-spin duration-3000" />
              <span>重新起用熔炉</span>
            </button>
            <button
              onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
              className="bg-zinc-900 hover:bg-zinc-850 text-zinc-300 px-4 py-2 border border-zinc-800 cursor-pointer text-[9px] uppercase tracking-wider transition-colors"
            >
              <span>返回重校参数</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
