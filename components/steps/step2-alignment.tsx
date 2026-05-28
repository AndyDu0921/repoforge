"use client";

import { useState } from "react";
import { Users, DollarSign, Code, FileText, Network, ArrowLeft, Terminal, Plus, Pencil } from "lucide-react";
import { useRepoForgeState, useRepoForgeDispatch, type Audience, type Commercial, type LicenseChoice } from "@/hooks/use-repo-forge-state";

function CustomInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <textarea
      rows={2}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500/50 text-zinc-300 p-3 rounded-lg text-sm placeholder:text-zinc-600 focus:outline-none transition-colors font-sans leading-relaxed mt-3"
    />
  );
}

export default function Step2Alignment() {
  const { audience, audienceCustom, commercial, commercialCustom, techPreference, techCustom, licenseChoice, licenseCustom, targetGoal } = useRepoForgeState();
  const dispatch = useRepoForgeDispatch();

  const [showAudienceCustom, setShowAudienceCustom] = useState(!!audienceCustom);
  const [showCommercialCustom, setShowCommercialCustom] = useState(!!commercialCustom);
  const [showTechCustom, setShowTechCustom] = useState(!!techCustom);
  const [showLicenseCustom, setShowLicenseCustom] = useState(!!licenseCustom);

  return (
    <div className="max-w-4xl mx-auto border border-zinc-800 bg-zinc-900/30 rounded-xl p-6 md:p-8 space-y-8">
      <div className="space-y-2 border-b border-zinc-800 pb-4">
        <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-amber-400 block">第 2 步</span>
        <h2 className="text-2xl font-bold text-white leading-tight">告诉 AI 你想要什么</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          先选最接近的选项，再点「+ 自定义」补充你的具体想法。你说的越清楚，AI 出的方案越靠谱。
        </p>
      </div>

      {/* Q1: Audience */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" /> 1. 这款产品给谁用？
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { id: "saas" as Audience, title: "公开的 SaaS 产品", desc: "面向大众用户，需要好看的界面、注册登录、支付功能。", meta: "在线服务" },
            { id: "internal" as Audience, title: "公司内部工具", desc: "内部使用，注重权限管理、操作日志、数据安全。", meta: "内部系统" },
            { id: "personal" as Audience, title: "个人或小团队工具", desc: "轻量级，快速启动，不依赖外部服务。", meta: "轻量工具" },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: "SET_AUDIENCE", payload: item.id })}
              className={`text-left p-4 rounded-lg border transition-all cursor-pointer flex flex-col gap-2 ${
                audience === item.id
                  ? "border-amber-500 bg-amber-950/25 border-l-[3px] border-l-amber-500 text-zinc-100"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold">{item.title}</span>
                <span className={`text-[10px] font-mono font-bold ${audience === item.id ? "text-amber-400" : "text-zinc-600"}`}>{item.meta}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{item.desc}</p>
            </button>
          ))}
        </div>
        {!showAudienceCustom ? (
          <button onClick={() => setShowAudienceCustom(true)} className="flex items-center gap-1.5 text-xs font-sans text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer ml-1">
            <Plus className="w-3 h-3" /> 补充你的想法
          </button>
        ) : (
          <div className="space-y-1.5">
            <button onClick={() => { setShowAudienceCustom(false); dispatch({ type: "SET_AUDIENCE_CUSTOM", payload: "" }); }} className="flex items-center gap-1.5 text-xs font-sans text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
              <Pencil className="w-3 h-3" /> 收起
            </button>
            <CustomInput value={audienceCustom} onChange={(v) => dispatch({ type: "SET_AUDIENCE_CUSTOM", payload: v })} placeholder="比如：面向海外留学生，需要支持中英文切换，移动端优先..." />
          </div>
        )}
      </div>

      {/* Q2: Commercial */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-amber-400" /> 2. 怎么赚钱或运营？
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { id: "subscription" as Commercial, title: "按月/按量付费", desc: "用户按月订阅或按用量付费。需要接入支付、账单系统。", meta: "付费模式" },
            { id: "opensource" as Commercial, title: "完全开源免费", desc: "纯开源项目，不做商业付费设计，面向开发者社区。", meta: "免费开源" },
            { id: "selfhosted" as Commercial, title: "企业私有部署", desc: "打包成企业可自己部署的版本，按授权收费。", meta: "私有部署" },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: "SET_COMMERCIAL", payload: item.id })}
              className={`text-left p-4 rounded-lg border transition-all cursor-pointer flex flex-col gap-2 ${
                commercial === item.id
                  ? "border-amber-500 bg-amber-950/25 border-l-[3px] border-l-amber-500 text-zinc-100"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold">{item.title}</span>
                <span className={`text-[10px] font-mono font-bold ${commercial === item.id ? "text-amber-400" : "text-zinc-600"}`}>{item.meta}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{item.desc}</p>
            </button>
          ))}
        </div>
        {!showCommercialCustom ? (
          <button onClick={() => setShowCommercialCustom(true)} className="flex items-center gap-1.5 text-xs font-sans text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer ml-1">
            <Plus className="w-3 h-3" /> 补充你的想法
          </button>
        ) : (
          <div className="space-y-1.5">
            <button onClick={() => { setShowCommercialCustom(false); dispatch({ type: "SET_COMMERCIAL_CUSTOM", payload: "" }); }} className="flex items-center gap-1.5 text-xs font-sans text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
              <Pencil className="w-3 h-3" /> 收起
            </button>
            <CustomInput value={commercialCustom} onChange={(v) => dispatch({ type: "SET_COMMERCIAL_CUSTOM", payload: v })} placeholder="比如：基础功能免费，高级 AI 功能按次收费，企业版单独定价..." />
          </div>
        )}
      </div>

      {/* Q3: Tech Stack */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          <Code className="w-4 h-4 text-amber-400" /> 3. 想用什么技术栈？
        </label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {([
            { id: "typescript-next", title: "TypeScript 全栈", desc: "Next.js + Tailwind CSS + Prisma/Drizzle。现代化 Web 首选。", meta: "推荐" },
            { id: "python-ai", title: "Python 后端", desc: "FastAPI/Django 做后端，React 做前端。适合 AI 和数据项目。", meta: "AI 友好" },
            { id: "go-rust", title: "Go / Rust 高性能", desc: "高并发、低延迟、性能优先的后端服务。", meta: "高性能" },
            { id: "agnostic-compose", title: "混合架构", desc: "不同模块用不同语言，通过 Docker 和 API 协作。", meta: "灵活" },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: "SET_TECH_PREFERENCE", payload: item.id })}
              className={`text-left p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${
                techPreference === item.id
                  ? "border-amber-500 bg-amber-950/25 border-l-[3px] border-l-amber-500 text-zinc-100"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="space-y-1.5">
                <span className="text-sm font-bold text-zinc-100">{item.title}</span>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans">{item.desc}</p>
              </div>
              <span className={`text-[10px] font-mono font-bold block mt-2 border-t border-zinc-800/40 pt-1.5 ${techPreference === item.id ? "text-amber-400" : "text-zinc-600"}`}>{item.meta}</span>
            </button>
          ))}
        </div>
        {!showTechCustom ? (
          <button onClick={() => setShowTechCustom(true)} className="flex items-center gap-1.5 text-xs font-sans text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer ml-1">
            <Plus className="w-3 h-3" /> 补充技术要求
          </button>
        ) : (
          <div className="space-y-1.5">
            <button onClick={() => { setShowTechCustom(false); dispatch({ type: "SET_TECH_CUSTOM", payload: "" }); }} className="flex items-center gap-1.5 text-xs font-sans text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
              <Pencil className="w-3 h-3" /> 收起
            </button>
            <CustomInput value={techCustom} onChange={(v) => dispatch({ type: "SET_TECH_CUSTOM", payload: v })} placeholder="比如：前端必须 React，后端随便，但数据库一定要用 PostgreSQL + Redis..." />
          </div>
        )}
      </div>

      {/* Q4: License */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" /> 4. 开源许可证有什么要求？
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { id: "strict" as LicenseChoice, title: "严格：只允许商用安全协议", desc: "禁止 GPL/AGPL 等传染性协议。首选 MIT、Apache-2.0。保护你的代码闭源权利。", meta: "安全优先" },
            { id: "permissive" as LicenseChoice, title: "宽松：允许弱传染协议", desc: "可以接受 LGPL、MPL 等弱传染协议，确保它们以动态链接方式使用。", meta: "均衡" },
            { id: "whatever" as LicenseChoice, title: "无所谓：功能优先", desc: "不考虑许可证限制。先把功能做出来，合规的事以后再说。", meta: "快速" },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: "SET_LICENSE_CHOICE", payload: item.id })}
              className={`text-left p-4 rounded-lg border transition-all cursor-pointer flex flex-col gap-2 ${
                licenseChoice === item.id
                  ? "border-amber-500 bg-amber-950/25 border-l-[3px] border-l-amber-500 text-zinc-100"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold">{item.title}</span>
                <span className={`text-[10px] font-mono font-bold ${licenseChoice === item.id ? "text-amber-400" : "text-zinc-600"}`}>{item.meta}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{item.desc}</p>
            </button>
          ))}
        </div>
        {!showLicenseCustom ? (
          <button onClick={() => setShowLicenseCustom(true)} className="flex items-center gap-1.5 text-xs font-sans text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer ml-1">
            <Plus className="w-3 h-3" /> 补充合规要求
          </button>
        ) : (
          <div className="space-y-1.5">
            <button onClick={() => { setShowLicenseCustom(false); dispatch({ type: "SET_LICENSE_CUSTOM", payload: "" }); }} className="flex items-center gap-1.5 text-xs font-sans text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
              <Pencil className="w-3 h-3" /> 收起
            </button>
            <CustomInput value={licenseCustom} onChange={(v) => dispatch({ type: "SET_LICENSE_CUSTOM", payload: v })} placeholder="比如：公司法务要求所有 copyleft 代码必须放在独立微服务里，主代码库只能用 MIT/Apache-2.0..." />
          </div>
        )}
      </div>

      {/* Q5: Target Goal */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          <Network className="w-4 h-4 text-amber-400" /> 5. 描述一下你最终想要的产品
        </label>
        <p className="text-xs text-zinc-500 -mt-1">把 A 仓库的某功能和 B 仓库的某功能结合起来，变成一个什么产品？越具体越好。</p>
        <textarea
          rows={4}
          placeholder="比如：把 A 仓库的 Markdown 编辑器，和 B 仓库的在线画板拼在一起，让用户在画板上写文档时能实时 AI 纠错，内容自动存到 C 仓库的本地数据库里。"
          value={targetGoal}
          onChange={(e) => dispatch({ type: "SET_TARGET_GOAL", payload: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 text-zinc-200 p-4 rounded-lg text-sm placeholder:text-zinc-600 focus:outline-none transition-colors font-sans leading-relaxed min-h-[120px]"
        />
      </div>

      {/* Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-zinc-800">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors h-10 px-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Terminal className="w-4 h-4" />
          <span>开始分析，生成方案</span>
        </button>
      </div>
    </div>
  );
}
