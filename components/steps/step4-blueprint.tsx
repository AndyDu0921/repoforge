"use client";

import { Layers, Search, AlertTriangle, Terminal, FileText, Download, RefreshCw } from "lucide-react";
import { useRepoForgeState, useRepoForgeDispatch } from "@/hooks/use-repo-forge-state";
import ArchitecturePanel from "@/components/blueprint/architecture-panel";
import GapsPanel from "@/components/blueprint/gaps-panel";
import HarmonyPanel from "@/components/blueprint/harmony-panel";
import ClaudePromptPanel from "@/components/blueprint/claude-prompt-panel";
import V2BacklogPanel from "@/components/blueprint/v2-backlog-panel";
import { downloadMarkdownReport } from "@/lib/download-report";

const TABS = [
  { id: "architecture" as const, label: "核型架构配对", sub: "导入物料在综合底牌的角色职责", icon: Layers },
  { id: "gaps" as const, label: "系统拼图缺口", sub: "动态检索实存 GitHub 备选补缺包", icon: Search },
  { id: "harmony" as const, label: "开源合规审计", sub: "开源法学传染阻抗与解耦防线", icon: AlertTriangle },
  { id: "claude" as const, label: "CLAUDE.md 指令工坊", sub: "专属工作空间自动驱动提示文本", icon: Terminal },
  { id: "v2backlog" as const, label: "V2 待办研发池 (归并存案)", sub: "可视化拓扑流图等 V2 延期功能记录", icon: FileText },
];

function renderPanel(tab: string) {
  switch (tab) {
    case "architecture": return <ArchitecturePanel />;
    case "gaps": return <GapsPanel />;
    case "harmony": return <HarmonyPanel />;
    case "claude": return <ClaudePromptPanel />;
    case "v2backlog": return <V2BacklogPanel />;
    default: return null;
  }
}

export default function Step4Blueprint() {
  const { blueprintResult, activeWorkspaceTab, techPreference } = useRepoForgeState();
  const dispatch = useRepoForgeDispatch();

  if (!blueprintResult) return null;

  const ts = blueprintResult.tech_stack;

  return (
    <div className="space-y-10">
      {/* Header overview card */}
      <div className="bg-zinc-900/10 border border-zinc-850 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative group">
        <h2 className="text-9xl font-black leading-none tracking-tighter mb-4 opacity-5 group-hover:opacity-10 transition-opacity select-none absolute right-8 -top-10">04</h2>
        <div className="space-y-2.5 relative z-10">
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase bg-amber-950/20 px-3 py-1 border border-amber-900/40 inline-block mb-1">
            合冶熔铸就位 // DeepSeek 精准配合系统方案
          </span>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{blueprintResult.product_name}</h2>
          <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed font-sans font-medium">{blueprintResult.product_description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto relative z-10">
          <button
            onClick={() => downloadMarkdownReport(blueprintResult, techPreference)}
            className="bg-zinc-950 hover:bg-zinc-900 text-zinc-350 hover:text-white border border-zinc-850 hover:border-zinc-755 px-5 py-3 rounded-none text-[10px] font-mono uppercase tracking-widest font-black flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-zinc-500" /> <span>导出系统规范蓝图 (.md)</span>
          </button>
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
            className="bg-zinc-150 hover:bg-amber-500 text-zinc-950 px-5 py-3 rounded-none text-[10px] font-mono uppercase tracking-widest font-black flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" /> <span>载入新物料重置合冶</span>
          </button>
        </div>
      </div>

      {/* Tech stack metadata stripe */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-850 bg-zinc-950 border border-zinc-850 text-xs font-mono">
        {[
          { label: "表现控制面顶盘", value: ts?.frontend || "Next.js / TS", amber: false },
          { label: "业务中台配位", value: ts?.backend || "Node.js / Express", amber: false },
          { label: "共享持久性引擎", value: ts?.database || "Postgres / Redis", amber: false },
          { label: "云部署虚拟底座", value: ts?.deployment || "Docker Compose / Vercel", amber: false },
          { label: "许可证合规审计 verdict", value: ts?.license_verdict || "MIT Safe", amber: true },
        ].map((item, i) => (
          <div key={i} className={`space-y-1 p-5 ${item.amber ? "bg-amber-950/5 col-span-2 md:col-span-1 border-t md:border-t-0 border-amber-900/25" : "bg-zinc-900/10"}`}>
            <span className={`block text-[9px] font-bold tracking-widest uppercase ${item.amber ? "text-amber-500 font-black" : "text-zinc-650"}`}>{item.label}</span>
            <span className={`block truncate ${item.amber ? "text-zinc-200 font-sans text-xs pt-0.5 font-bold" : "text-amber-500 font-black"}`}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Workspace tabs + panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tab sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-1 bg-zinc-950 border border-zinc-850 p-4">
          {TABS.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspaceTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => dispatch({ type: "SET_WORKSPACE_TAB", payload: item.id })}
                className={`text-left p-4 rounded-none border transition-all cursor-pointer flex items-center gap-4 ${
                  isActive ? "border-amber-500 bg-amber-950/20 text-zinc-100" : "border-transparent bg-transparent hover:bg-zinc-900/40 text-zinc-500 hover:text-zinc-350"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-amber-500" : "text-zinc-650"}`} />
                <div className="space-y-0.5 truncate uppercase">
                  <p className={`text-[11px] font-black font-mono tracking-wide ${isActive ? "text-zinc-100" : "text-zinc-450"}`}>{item.label}</p>
                  <span className="text-[9px] text-zinc-605 font-mono tracking-wider block truncate">{item.sub}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Panel area */}
        <div className="lg:col-span-9 bg-zinc-900/10 border border-zinc-850 p-8 min-h-[460px] relative">
          {renderPanel(activeWorkspaceTab)}
        </div>
      </div>
    </div>
  );
}
