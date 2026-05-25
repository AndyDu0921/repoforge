"use client";

import { useState } from "react";
import { Terminal, Copy, Check, FileText } from "lucide-react";
import { useRepoForgeState } from "@/hooks/use-repo-forge-state";

export default function ClaudePromptPanel() {
  const { blueprintResult } = useRepoForgeState();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!blueprintResult?.prompt_template_claude) return;
    navigator.clipboard.writeText(blueprintResult.prompt_template_claude);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roadmap = blueprintResult?.step_by_step_roadmap ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b border-zinc-850 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-500 block">系统重合全自动开发指令</span>
          <h3 className="text-xl font-black text-white font-mono uppercase flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-500" /> <span>Prompt Studio // CLAUDE.md 标准模板</span>
          </h3>
          <p className="text-xs text-zinc-450 pt-0.5 font-sans leading-relaxed">
            直接复制以下极详实的高保真开发指令放入 Claude Code, Cursor 或是 AI 代码沙箱，即可引导多物料自动拉取编译和整合构建！
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="bg-zinc-100 hover:bg-amber-500 text-zinc-950 hover:shadow-lg hover:shadow-amber-500/10 px-5 py-3 rounded-none text-[10px] font-mono uppercase tracking-widest font-black flex items-center gap-2 transition-all cursor-pointer select-none self-end md:self-auto border border-zinc-800 shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-zinc-950 stroke-[2.5]" /> : <Copy className="w-4 h-4 text-zinc-950 stroke-[2.5]" />}
          <span>{copied ? "已复制到剪贴板！" : "复制指令脚本"}</span>
        </button>
      </div>

      {/* Code preview */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-none overflow-hidden shadow-2xl relative font-mono text-xs flex flex-col">
        <div className="bg-zinc-900 border-b border-zinc-850 px-5 py-2.5 text-zinc-500 text-[9px] uppercase tracking-widest font-bold flex items-center justify-between">
          <span>CLAUDE.md</span>
          <span className="text-amber-500">READ-ONLY WORKSPACE // PRO ENGINE OUTPUT</span>
        </div>
        <pre className="p-5 overflow-auto text-zinc-400 select-all max-h-[460px] leading-relaxed select-text font-mono whitespace-pre-wrap break-words selection:bg-amber-500/20 selection:text-amber-300">
          {blueprintResult?.prompt_template_claude}
        </pre>
      </div>

      {/* Roadmap */}
      {roadmap.length > 0 && (
        <div className="bg-zinc-950/40 border border-zinc-850 p-6 rounded-none space-y-5">
          <h4 className="text-xs font-mono font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-850/50 pb-2.5">
            <FileText className="w-4 h-4 text-zinc-500" /> <span>整合融聚技术路径落地图里程碑</span>
          </h4>
          <div className="space-y-4 font-sans">
            {roadmap.map((step: any, sIdx: number) => (
              <div key={sIdx} className="relative pl-6 border-l border-zinc-850 space-y-2">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 bg-amber-500 border border-zinc-950" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <span className="text-xs font-black uppercase tracking-tight text-zinc-200">{step.phase}: {step.title}</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{step.duration}</span>
                </div>
                <ul className="text-[11px] text-zinc-400 space-y-1 list-none pl-1 font-sans">
                  {(step.tasks ?? []).map((task: string, tIdx: number) => (
                    <li key={tIdx} className="flex gap-2">
                      <span className="text-amber-500 font-bold">✓</span> <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
