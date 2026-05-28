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
      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 text-zinc-300 p-3 rounded-none text-xs placeholder:text-zinc-650 focus:outline-none transition-colors font-sans leading-relaxed mt-3"
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
    <div className="max-w-4xl mx-auto bg-zinc-900/10 border border-zinc-850 rounded-none p-8 space-y-10 group relative">
      <div className="space-y-2 border-b border-zinc-850 pb-5">
        <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
          阶段 02 // 目标重塑调配对齐
        </span>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">
          调配熔炼系统的定位参数对齐
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          在下方预设选项中快速对齐，或点击「+ 自定义」为每个维度补充你的独立构思与额外要求。DeepSeek 熔炉会综合考虑预设选项与自定义输入。
        </p>
      </div>

      {/* Q1: Audience */}
      <div className="space-y-4">
        <label className="text-xs font-black font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <Users className="w-4 h-4 text-zinc-500" /> <span>1. 目标受众与运作定位是？</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            { id: "saas" as Audience, title: "零售 SaaS 公网产品", desc: "注重极致的外观质感、首屏响应，集成主流凭据系统与 Stripe 支付计费体系。", meta: "周期付费 / 零售级" },
            { id: "internal" as Audience, title: "企业内网服务台", desc: "内网运行环境。强关系型持久化审计、全面的权限控制日志与统一的操作审计面板。", meta: "强审计 / 生产安全性" },
            { id: "personal" as Audience, title: "极客本地执行工具/CLI", desc: "无需联网的单兵脚本。本地 SQLite 极速起用、直观流畅，轻量化逻辑自洽反馈。", meta: "本地极速 / 零外部负担" },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: "SET_AUDIENCE", payload: item.id })}
              className={`text-left p-4.5 rounded-none border transition-all cursor-pointer flex flex-col gap-2 ${
                audience === item.id ? "border-amber-500 bg-amber-950/20 text-zinc-100" : "border-zinc-850 hover:border-zinc-750 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black uppercase tracking-tight text-zinc-150">{item.title}</span>
                <span className={`text-[8px] font-mono tracking-wider font-bold uppercase ${audience === item.id ? "text-amber-500" : "text-zinc-600"}`}>{item.meta}</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{item.desc}</p>
            </button>
          ))}
        </div>
        {!showAudienceCustom ? (
          <button onClick={() => setShowAudienceCustom(true)} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-550 hover:text-amber-400 transition-colors cursor-pointer ml-1">
            <Plus className="w-3 h-3" /> <span>添加自定义补充说明</span>
          </button>
        ) : (
          <div className="space-y-1.5">
            <button onClick={() => { setShowAudienceCustom(false); dispatch({ type: "SET_AUDIENCE_CUSTOM", payload: "" }); }} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              <Pencil className="w-3 h-3" /> <span>收起自定义</span>
            </button>
            <CustomInput value={audienceCustom} onChange={(v) => dispatch({ type: "SET_AUDIENCE_CUSTOM", payload: v })} placeholder="例如：面向海外留学生的学术写作辅助平台，需支持多语言、移动端优先..." />
          </div>
        )}
      </div>

      {/* Q2: Commercial */}
      <div className="space-y-4 pt-1">
        <label className="text-xs font-black font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-zinc-500" /> <span>2. 商业变现定位设计？</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            { id: "subscription" as Commercial, title: "典型按月/周期付费订阅", desc: "规划 API 支付验证门阻，建立按量计费逻辑，与第三方计费 SDK 做深度物料契合。", meta: "SaaS 收费" },
            { id: "opensource" as Commercial, title: "独立捐赠或完全开源分发", desc: "不进行任何多余的商业付费设计，崇尚开源分享，系统向极致的开发者自建进行对齐。", meta: "无付费墙" },
            { id: "selfhosted" as Commercial, title: "企业私有物理打包部署", desc: "支持本地导入许可证许可，封装成支持配置式独立启动的可自维护集群包结构。", meta: "私有许可证" },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: "SET_COMMERCIAL", payload: item.id })}
              className={`text-left p-4.5 rounded-none border transition-all cursor-pointer flex flex-col gap-2 ${
                commercial === item.id ? "border-amber-500 bg-amber-950/20 text-zinc-100" : "border-zinc-850 hover:border-zinc-750 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black uppercase tracking-tight text-zinc-150">{item.title}</span>
                <span className={`text-[8px] font-mono tracking-wider font-bold uppercase ${commercial === item.id ? "text-amber-500" : "text-zinc-650"}`}>{item.meta}</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{item.desc}</p>
            </button>
          ))}
        </div>
        {!showCommercialCustom ? (
          <button onClick={() => setShowCommercialCustom(true)} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-550 hover:text-amber-400 transition-colors cursor-pointer ml-1">
            <Plus className="w-3 h-3" /> <span>添加自定义补充说明</span>
          </button>
        ) : (
          <div className="space-y-1.5">
            <button onClick={() => { setShowCommercialCustom(false); dispatch({ type: "SET_COMMERCIAL_CUSTOM", payload: "" }); }} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              <Pencil className="w-3 h-3" /> <span>收起自定义</span>
            </button>
            <CustomInput value={commercialCustom} onChange={(v) => dispatch({ type: "SET_COMMERCIAL_CUSTOM", payload: v })} placeholder="例如：基础功能免费开源，高级 AI 功能按 token 计费，企业版支持私有部署授权..." />
          </div>
        )}
      </div>

      {/* Q3: Tech Stack */}
      <div className="space-y-4 pt-1">
        <label className="text-xs font-black font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <Code className="w-4 h-4 text-zinc-500" /> <span>3. 核心技术栈偏好（决定系统底牌逻辑，防止 AI 默认黑盒猜测）</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {([
            { id: "typescript-next", title: "Pure TS 全栈", desc: "Next.js 15+ (App Router) + Tailwind CSS + Prisma / Drizzle。全链路轻量快速部署。", meta: "Next.js / TS" },
            { id: "python-ai", title: "Python AI 后端", desc: "FastAPI / Django 后端服务 + React 前端独立。面向强人工核酸 agents 与数据分析。", meta: "FastAPI / Py" },
            { id: "go-rust", title: "Go / Rust 高性能型", desc: "Go Fin / Rust Actix 服务 + Next.js 前端混合。极致提升高频数据交换性能与小微打包体积。", meta: "Go & Rust / API" },
            { id: "agnostic-compose", title: "多语言容器异构", desc: "Docker Compose 分散微服务网络。完全解耦不强求语言同构，各尽所需开展网关拦截汇入。", meta: "agnostic micro" },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: "SET_TECH_PREFERENCE", payload: item.id })}
              className={`text-left p-4.5 rounded-none border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] ${
                techPreference === item.id ? "border-amber-500 bg-amber-950/20 text-zinc-100" : "border-zinc-850 hover:border-zinc-750 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-black uppercase tracking-tight text-zinc-100">{item.title}</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal font-sans">{item.desc}</p>
              </div>
              <span className={`text-[8px] font-mono tracking-wider font-bold uppercase block mt-3 border-t border-zinc-850/40 pt-1.5 ${techPreference === item.id ? "text-amber-500" : "text-zinc-650"}`}>{item.meta}</span>
            </button>
          ))}
        </div>
        {!showTechCustom ? (
          <button onClick={() => setShowTechCustom(true)} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-550 hover:text-amber-400 transition-colors cursor-pointer ml-1">
            <Plus className="w-3 h-3" /> <span>添加自定义技术栈需求</span>
          </button>
        ) : (
          <div className="space-y-1.5">
            <button onClick={() => { setShowTechCustom(false); dispatch({ type: "SET_TECH_CUSTOM", payload: "" }); }} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              <Pencil className="w-3 h-3" /> <span>收起自定义</span>
            </button>
            <CustomInput value={techCustom} onChange={(v) => dispatch({ type: "SET_TECH_CUSTOM", payload: v })} placeholder="例如：前端必须用 React，后端无偏好，但数据库必须用 PostgreSQL + Redis 缓存层，ORM 用 Drizzle..." />
          </div>
        )}
      </div>

      {/* Q4: License */}
      <div className="space-y-4 pt-1">
        <label className="text-xs font-black font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-500" /> <span>4. 开源许可证安全考量？</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            { id: "strict" as LicenseChoice, title: "严格仅限商用免传染", desc: "屏蔽 GPL、AGPL 等任何强传染和互惠式协议物料，首选 MIT/Apache-2.0 依赖，深度保护核心业务产权私有性。", meta: "强力私产保护" },
            { id: "permissive" as LicenseChoice, title: "宽松互惠可交互协议", desc: "允许部分 MPL、LGPL 允许的弱传染交互库，只要确保它们作为三方动态链接库或相对独立微服务，不影响主干闭源。", meta: "动态交互规避" },
            { id: "whatever" as LicenseChoice, title: "唯功用优先 (全吞入)", desc: "无需作任何开源法规限制，唯重现系统拼图完整性为最高旨意。合规法律事务预留予未来治理。", meta: "极简功能至上" },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: "SET_LICENSE_CHOICE", payload: item.id })}
              className={`text-left p-4.5 rounded-none border transition-all cursor-pointer flex flex-col gap-2 ${
                licenseChoice === item.id ? "border-amber-500 bg-amber-950/20 text-zinc-100" : "border-zinc-850 hover:border-zinc-750 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black uppercase tracking-tight text-zinc-150">{item.title}</span>
                <span className={`text-[8px] font-mono tracking-wider font-bold uppercase ${licenseChoice === item.id ? "text-amber-500" : "text-zinc-600"}`}>{item.meta}</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{item.desc}</p>
            </button>
          ))}
        </div>
        {!showLicenseCustom ? (
          <button onClick={() => setShowLicenseCustom(true)} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-550 hover:text-amber-400 transition-colors cursor-pointer ml-1">
            <Plus className="w-3 h-3" /> <span>添加自定义合规说明</span>
          </button>
        ) : (
          <div className="space-y-1.5">
            <button onClick={() => { setShowLicenseCustom(false); dispatch({ type: "SET_LICENSE_CUSTOM", payload: "" }); }} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              <Pencil className="w-3 h-3" /> <span>收起自定义</span>
            </button>
            <CustomInput value={licenseCustom} onChange={(v) => dispatch({ type: "SET_LICENSE_CUSTOM", payload: v })} placeholder="例如：我们公司有法务团队，允许 LGPL 动态链接，但任何 copyleft 代码必须放在独立微服务里..." />
          </div>
        )}
      </div>

      {/* Q5: Target Goal */}
      <div className="space-y-3 pt-1">
        <label className="text-xs font-black font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <Network className="w-4 h-4 text-zinc-500" /> <span>5. 业务合流与架构重构总要求叙述：</span>
        </label>
        <textarea
          rows={4}
          placeholder="在此细化您的架构组网逻辑（例如：将 A 仓库的 markdown 实时渲染编译器，深度挂接在 B 仓库的多端在线设计画布组件之内，支持对画布绘制内容进行文本级大模型研判纠错，并自动使用 C 仓库的 SQLite 控制套做本地落页存储。）"
          value={targetGoal}
          onChange={(e) => dispatch({ type: "SET_TARGET_GOAL", payload: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-850 focus:border-amber-500 text-zinc-250 p-4 rounded-none text-xs placeholder:text-zinc-750 focus:outline-none transition-colors font-sans leading-relaxed min-h-[120px]"
        />
      </div>

      {/* Navigation */}
      <div className="pt-6 flex items-center justify-between border-t border-zinc-805">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
          className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest font-black text-zinc-550 hover:text-zinc-300 transition-colors h-10 px-4 whitespace-nowrap cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回编辑物料仓</span>
        </button>

        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}
          className="bg-zinc-105 hover:bg-amber-500 text-zinc-950 px-8 py-3.5 rounded-none font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer border border-zinc-800"
        >
          <Terminal className="w-4 h-4" />
          <span>唤醒合冶重构熔炉</span>
        </button>
      </div>
    </div>
  );
}
