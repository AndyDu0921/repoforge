"use client";

import { FileText } from "lucide-react";

export default function V2BacklogPanel() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-b border-zinc-850 pb-5">
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-500 block">版本规划档案记录</span>
        <h3 className="text-xl font-black text-white font-mono uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" /> <span>V2 规划池：延期与高维可视化特征待办</span>
        </h3>
        <p className="text-xs text-zinc-450 font-sans leading-relaxed pr-10">
          根据架构审核意见，为防止 V1 阶段产品过度堆砌与结构不稳，我们将次要、重计算及商业模本特征延期移至 V2 中。特此建档存备：
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-zinc-850 p-6 bg-zinc-950/40 hover:border-zinc-750 transition-all space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
            <h4 className="text-xs font-black uppercase font-mono text-zinc-200">架构拓扑流图可视化交互画布</h4>
            <span className="text-[8px] font-mono uppercase tracking-wider text-amber-500 border border-amber-900/50 bg-amber-950/20 px-2 py-0.5 font-bold">V2 待办规划</span>
          </div>
          <p className="text-xs text-zinc-450 leading-relaxed font-sans font-medium">
            引入 <span className="font-mono bg-zinc-900 px-1 py-0.5 text-[10px] text-amber-400 border border-zinc-800">ReactFlow / D3.js</span>, 允许开发者在网页上直观拖拽模块节点、动态连线重映射 API 挂接点，并拖拽保存为系统配置文件。V1 采用轻量文字走向流进行高效率替代。
          </p>
        </div>

        <div className="border border-zinc-850 p-6 bg-zinc-950/40 hover:border-zinc-750 transition-all space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
            <h4 className="text-xs font-black uppercase font-mono text-zinc-200">行业高频付费开发预设箱 (Recipes)</h4>
            <span className="text-[8px] font-mono uppercase tracking-wider text-amber-500 border border-amber-900/50 bg-amber-950/20 px-2 py-0.5 font-bold">V2 待办规划</span>
          </div>
          <p className="text-xs text-zinc-450 leading-relaxed font-sans font-medium">
            针对高频商业化变现诉求（如协同交互看板、API 商场、多租户 SaaS 空间）沉淀 10 组以上物理代码拉取和环境配置文件的一键预置。V1 采用自定义空白调质模型，极致化跑通主业务闭环流程。
          </p>
        </div>
      </div>
    </div>
  );
}
