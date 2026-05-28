"use client";

import { FileText } from "lucide-react";

export default function V2BacklogPanel() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b border-zinc-800 pb-4">
        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">未来计划</span>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" /> 后续会做的功能
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          V1 版本先把核心流程跑通，以下功能排在后续规划中：
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-zinc-800 rounded-lg p-5 bg-zinc-950/40 hover:border-zinc-700 transition-all space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h4 className="text-sm font-bold text-zinc-200">可视化架构图编辑器</h4>
            <span className="text-[10px] font-mono font-bold text-amber-400 border border-amber-900/50 bg-amber-950/20 px-2 py-0.5 rounded">V2 计划</span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            用 <span className="font-mono text-amber-400 text-xs">ReactFlow / D3.js</span> 做一个拖拽式架构图编辑器，可以直接在网页上连线、改接口、导出配置文件。V1 先用文字关系图替代。
          </p>
        </div>

        <div className="border border-zinc-800 rounded-lg p-5 bg-zinc-950/40 hover:border-zinc-700 transition-all space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h4 className="text-sm font-bold text-zinc-200">一键预设模板包</h4>
            <span className="text-[10px] font-mono font-bold text-amber-400 border border-amber-900/50 bg-amber-950/20 px-2 py-0.5 rounded">V2 计划</span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            针对常见需求（支付系统、OAuth 登录、实时协作、AI 聊天等）提前配置好仓库组合和参数模板，一键加载。V1 先用自定义配置跑通流程。
          </p>
        </div>
      </div>
    </div>
  );
}
