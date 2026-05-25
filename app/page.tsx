"use client";

import { useRepoForgeState } from "@/hooks/use-repo-forge-state";
import Header from "@/components/ui/header";
import Stepper from "@/components/ui/stepper";
import SettingsPanel from "@/components/ui/settings-panel";
import Step1Materials from "@/components/steps/step1-materials";
import Step2Alignment from "@/components/steps/step2-alignment";
import Step3Smelting from "@/components/steps/step3-smelting";
import Step4Blueprint from "@/components/steps/step4-blueprint";

function StepRenderer() {
  const { step } = useRepoForgeState();

  switch (step) {
    case 1: return <Step1Materials />;
    case 2: return <Step2Alignment />;
    case 3: return <Step3Smelting />;
    case 4: return <Step4Blueprint />;
  }
}

export default function RepoForgeWorkspace() {
  return (
    <div id="repoforge-workspace-root" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161619_1px,transparent_1px),linear-gradient(to_bottom,#161619_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_65%,transparent_100%)] pointer-events-none" />

      <Header />
      <SettingsPanel />

      <main className="max-w-7xl mx-auto px-8 py-10">
        <Stepper />
        <StepRenderer />
      </main>

      <footer className="border-t border-zinc-900 py-10 text-center text-[10px] text-zinc-650 font-mono mt-20 max-w-7xl mx-auto px-8 whitespace-nowrap overflow-hidden leading-relaxed uppercase tracking-widest font-bold">
        <div>RepoForge 物理多存储库熔炼工位 | 当前处于离线本地存储降级模式</div>
        <p className="text-zinc-700 font-sans text-[10px] mt-1.5 lowercase tracking-normal italic normal-case font-medium">
          系统底层调用 DeepSeek V4 Pro 开源重构研判大模型。向用户正式装配前，请核验各引入开源库之最终协议合规使用条例。
        </p>
      </footer>
    </div>
  );
}
