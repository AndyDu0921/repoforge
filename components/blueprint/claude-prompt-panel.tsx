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
      <div className="space-y-2 border-b border-zinc-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">开发指令</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" /> AI 开发文档
          </h3>
          <p className="text-sm text-zinc-400 pt-0.5 leading-relaxed">
            把下面的内容复制到 Claude Code、Cursor 或其他 AI 编程工具中，AI 会按这个方案帮你写代码。
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="bg-zinc-100 hover:bg-amber-400 text-zinc-950 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border border-zinc-300"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "已复制！" : "复制开发文档"}</span>
        </button>
      </div>

      {/* Code preview */}
      <div className="bg-zinc-950 border border-zinc-700 rounded-lg overflow-hidden font-mono text-sm flex flex-col">
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 text-zinc-500 text-xs font-bold flex items-center justify-between">
          <span>CL AUDE.md</span>
          <span className="text-amber-400">可直接使用</span>
        </div>
        <pre className="p-5 overflow-auto text-zinc-400 select-all max-h-[460px] leading-relaxed whitespace-pre-wrap break-words">
          {blueprintResult?.prompt_template_claude}
        </pre>
      </div>

      {/* Roadmap */}
      {roadmap.length > 0 && (
        <div className="bg-zinc-950/40 border border-zinc-800 rounded-lg p-5 space-y-4">
          <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2 border-b border-zinc-800 pb-2">
            <FileText className="w-4 h-4 text-zinc-400" /> 实施路线图
          </h4>
          <div className="space-y-4">
            {roadmap.map((step: any, sIdx: number) => (
              <div key={sIdx} className="relative pl-6 border-l border-zinc-800 space-y-1.5">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full border border-zinc-950" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <span className="text-sm font-bold text-zinc-200">{step.phase}: {step.title}</span>
                  <span className="text-xs font-mono text-zinc-500">{step.duration}</span>
                </div>
                <ul className="text-sm text-zinc-400 space-y-0.5 list-none pl-1">
                  {(step.tasks ?? []).map((task: string, tIdx: number) => (
                    <li key={tIdx} className="flex gap-2">
                      <span className="text-amber-400 font-bold">-</span> <span>{task}</span>
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
