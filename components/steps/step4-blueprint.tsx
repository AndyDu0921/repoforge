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
  { id: "architecture" as const, label: "技术架构", sub: "各仓库的角色分工", icon: Layers },
  { id: "gaps" as const, label: "能力检查", sub: "还缺什么功能", icon: Search },
  { id: "harmony" as const, label: "许可证", sub: "开源协议是否冲突", icon: AlertTriangle },
  { id: "claude" as const, label: "开发文档", sub: "复制给 AI 编程工具用", icon: Terminal },
  { id: "v2backlog" as const, label: "未来计划", sub: "后续版本待做功能", icon: FileText },
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
  const assessment = blueprintResult.assessment;

  const gradeColor = (g: string) => {
    if (!g) return "text-zinc-400";
    if (g.startsWith("S") || g.startsWith("A")) return "text-green-400";
    if (g.startsWith("B")) return "text-amber-400";
    return "text-red-400";
  };

  const gradeBg = (g: string) => {
    if (!g) return "bg-zinc-800";
    if (g.startsWith("S") || g.startsWith("A")) return "bg-green-500/20 border-green-500/30";
    if (g.startsWith("B")) return "bg-amber-500/20 border-amber-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/20 px-2.5 py-1 border border-amber-900/30 rounded inline-block">
            方案已生成
          </span>
          <h2 className="text-2xl font-bold text-white">{blueprintResult.product_name}</h2>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">{blueprintResult.product_description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <button
            onClick={() => downloadMarkdownReport(blueprintResult, techPreference)}
            className="bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> 导出方案 (.md)
          </button>
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
            className="bg-zinc-100 hover:bg-amber-400 text-zinc-950 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> 重新开始
          </button>
        </div>
      </div>

      {/* Assessment score card */}
      {assessment && (
        <div className={`border rounded-xl p-5 ${gradeBg(assessment.overall_grade)}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-black ${gradeColor(assessment.overall_grade)}`}>
                {assessment.overall_grade || "?"}
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-100">{assessment.summary || "方案已生成"}</p>
                <div className="flex flex-wrap gap-3 mt-1.5">
                  <span className="text-xs text-zinc-400">技术匹配<span className={`ml-1 font-bold ${gradeColor(assessment.tech_match)}`}>{assessment.tech_match || "-"}</span></span>
                  <span className="text-xs text-zinc-400">许可证<span className={`ml-1 font-bold ${gradeColor(assessment.license_risk)}`}>{assessment.license_risk || "-"}</span></span>
                  <span className="text-xs text-zinc-400">功能覆盖<span className={`ml-1 font-bold ${gradeColor(assessment.coverage)}`}>{assessment.coverage || "-"}</span></span>
                  <span className="text-xs text-zinc-400">维护风险<span className={`ml-1 font-bold ${gradeColor(assessment.maintenance_risk)}`}>{assessment.maintenance_risk || "-"}</span></span>
                </div>
              </div>
            </div>
          </div>
          {assessment.warnings?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-700/50 space-y-1">
              <p className="text-xs font-bold text-amber-400">需要关注</p>
              {assessment.warnings.map((w: string, i: number) => (
                <p key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0">⚠</span> {w}
                </p>
              ))}
            </div>
          )}
          {assessment.strengths?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-zinc-700/30 space-y-1">
              <p className="text-xs font-bold text-green-400">优点</p>
              {assessment.strengths.map((s: string, i: number) => (
                <p key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                  <span className="text-green-400 shrink-0">✓</span> {s}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tech stack stripe */}
      <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-zinc-800 bg-zinc-950 border border-zinc-800 rounded-lg text-sm overflow-hidden">
        {[
          { label: "前端", value: ts?.frontend || "Next.js / TS" },
          { label: "后端", value: ts?.backend || "Node.js" },
          { label: "数据库", value: ts?.database || "PostgreSQL" },
          { label: "部署", value: ts?.deployment || "Docker" },
          { label: "许可证结论", value: ts?.license_verdict || "MIT", highlight: true },
        ].map((item, i) => (
          <div key={i} className={`space-y-1 p-4 ${item.highlight ? "bg-amber-950/5 col-span-2 md:col-span-1" : "bg-zinc-900/10"}`}>
            <span className="text-xs text-zinc-500 font-bold block">{item.label}</span>
            <span className={`block font-bold truncate ${item.highlight ? "text-amber-400" : "text-zinc-200"}`}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs + Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-3 flex flex-col gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3">
          {TABS.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspaceTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => dispatch({ type: "SET_WORKSPACE_TAB", payload: item.id })}
                className={`text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3 ${
                  isActive
                    ? "border-amber-500 bg-amber-950/20 text-zinc-100 border-l-[3px] border-l-amber-500"
                    : "border-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-zinc-500"}`} />
                <div className="truncate">
                  <p className={`text-sm font-bold ${isActive ? "text-zinc-100" : "text-zinc-400"}`}>{item.label}</p>
                  <span className="text-xs text-zinc-500 block truncate">{item.sub}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-9 border border-zinc-800 bg-zinc-900/30 rounded-lg p-5 md:p-6 min-h-[420px]">
          {renderPanel(activeWorkspaceTab)}
        </div>
      </div>
    </div>
  );
}
