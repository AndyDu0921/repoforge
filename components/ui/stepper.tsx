"use client";

import React from "react";
import { Check } from "lucide-react";
import { useRepoForgeState, useRepoForgeDispatch, type Step } from "@/hooks/use-repo-forge-state";

const STEPS: { id: Step; name: string; label: string }[] = [
  { id: 1, name: "Materials", label: "加载物料原料" },
  { id: 2, name: "Alignment", label: "对齐调质方针" },
  { id: 3, name: "Smelting", label: "熔炉合冶分析" },
  { id: 4, name: "Blueprint", label: "整合神兵方案" },
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
                className={`h-[1px] flex-1 mx-4 transition-all duration-500 ${isPassed ? "bg-amber-500" : "bg-zinc-800"}`}
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
                className={`w-8 h-8 rounded-none flex items-center justify-center font-bold border transition-all duration-300 ${
                  isActive
                    ? "border-amber-400 bg-amber-950/40 text-amber-300 ring-2 ring-amber-500/10"
                    : isPassed
                    ? "border-amber-500 bg-amber-500 text-zinc-950 font-black"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-600 group-hover:border-zinc-700"
                }`}
              >
                {isPassed ? <Check className="w-4 h-4 stroke-[2.5]" /> : st.id}
              </div>
              <div className="text-center font-sans">
                <p
                  className={`font-semibold text-[11px] ${
                    isActive ? "text-amber-300 font-bold" : isPassed ? "text-zinc-300 hover:text-amber-400" : "text-zinc-650"
                  }`}
                >
                  {st.name}
                </p>
                <span className="text-[9px] text-zinc-550 block font-mono">{st.label}</span>
              </div>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
