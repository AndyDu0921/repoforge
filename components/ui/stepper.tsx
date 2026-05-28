"use client";

import React from "react";
import { Check } from "lucide-react";
import { useRepoForgeState, useRepoForgeDispatch, type Step } from "@/hooks/use-repo-forge-state";

const STEPS: { id: Step; name: string; label: string }[] = [
  { id: 1, name: "导入", label: "添加 GitHub 仓库" },
  { id: 2, name: "配置", label: "设置项目偏好" },
  { id: 3, name: "分析", label: "AI 生成方案中" },
  { id: 4, name: "方案", label: "查看你的蓝图" },
];

export default function Stepper() {
  const { step, blueprintResult } = useRepoForgeState();
  const dispatch = useRepoForgeDispatch();

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12 text-xs text-zinc-400 font-mono">
      {STEPS.map((st, idx) => {
        const isActive = step === st.id;
        const isPassed = step > st.id;
        return (
          <React.Fragment key={st.id}>
            {idx > 0 && (
              <div
                className={`h-[1px] flex-1 mx-4 transition-all duration-500 ${isPassed ? "bg-green-500/60" : "bg-zinc-800"}`}
              />
            )}
            <button
              onClick={() => {
                if (st.id === 4 && !blueprintResult) return;
                if (step === 3) return;
                dispatch({ type: "SET_STEP", payload: st.id });
              }}
              disabled={step === 3 || (st.id === 4 && !blueprintResult)}
              className={`flex flex-col items-center gap-2 group transition-all focus:outline-none ${
                step === 3 || (st.id === 4 && !blueprintResult) ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${
                  isActive
                    ? "border-amber-400 bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20"
                    : isPassed
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-zinc-700 bg-zinc-900 text-zinc-500 group-hover:border-zinc-600"
                }`}
              >
                {isPassed ? <Check className="w-4 h-4 stroke-[2.5]" /> : st.id}
              </div>
              <div className="text-center">
                <p
                  className={`font-bold text-xs ${
                    isActive ? "text-white" : isPassed ? "text-zinc-300" : "text-zinc-550"
                  }`}
                >
                  {st.name}
                </p>
                <span className="text-[10px] text-zinc-500 block">{st.label}</span>
              </div>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
