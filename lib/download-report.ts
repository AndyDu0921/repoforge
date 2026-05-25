export function downloadMarkdownReport(blueprintResult: any, techPreference: string) {
  if (!blueprintResult) return;

  const techLabel =
    techPreference === "typescript-next" ? "Pure TypeScript (Next.js / Tailwind)" :
    techPreference === "python-ai" ? "Python AI Backend (FastAPI + React)" :
    techPreference === "go-rust" ? "Go/Rust High Performance API stack" :
    "Container Agnostic microservices mesh";

  const sections = [
    `# ${blueprintResult.product_name} - 项目重合系统配置规范蓝图`,
    `> 由 RepoForge 合冶工作空间生成 | 处理器: DeepSeek V4 Pro | 导出时间: 2026-05-25`,
    `\n## 一、 重塑项目综合概述`,
    `${blueprintResult.product_description}`,
    `\n## 二、 开源材料底盘配准清单`,
    `| 存储库 (Repository) | 承担职责 (Role) | 重接导入特征 (Key Features) | 底盘兼容性研判 (${techLabel}) |`,
    `|---|---|---|---|`,
    ...(blueprintResult.modules ?? []).map((m: any) =>
      `| ${m.repo} | ${m.role} | ${m.key_features?.join(", ") || "核心基础引入"} | ${m.technical_compatibility} |`
    ),
    `\n## 三、 推荐目标高内聚技术栈清单`,
    `- **前端控制面配置**: ${blueprintResult.tech_stack?.frontend || "Next.js / Tailwind"}`,
    `- **后端业务逻辑配给**: ${blueprintResult.tech_stack?.backend || "Node.js / Express"}`,
    `- **数据持久化底座配置**: ${blueprintResult.tech_stack?.database || "PostgreSQL / Prisma"}`,
    `- **多节点云部署拓扑**: ${blueprintResult.tech_stack?.deployment || "Docker Compose"}`,
    `- **开源许可证最终 verdict 判定**: ${blueprintResult.tech_stack?.license_verdict || "MIT / Commercially safe"}`,
    `\n## 四、 平台系统拼图缺失与智能连接组件 (Gaps & Live Solvers)`,
    ...(blueprintResult.gaps ?? []).map((g: any) =>
      `### [缺失状态] ${g.title}\n*缺失诊断*: ${g.description}\n\n*检索出的 live GitHub 智能连接库方案*:\n` +
      (g.suggested_projects ?? []).map((p: any) => `- **${p.name}** (${p.url}): ${p.description} (⭐ ${p.stars} stars)`).join("\n")
    ),
    `\n## 五、 开源许可证合规规避审计`,
    blueprintResult.conflicts && blueprintResult.conflicts.length > 0
      ? blueprintResult.conflicts.map((c: any) => `### 判定类型: ${c.category}\n- **主要阻碍陈述**: ${c.description}\n- **推荐隔离规避手段**: ${c.mitigation}`).join("\n\n")
      : `*完全和谐：经过深入比对，所有开源物料许可证对所选商业化定位完全兼容，无任何 GPL 泄露传染风险。*`,
    `\n## 六、 阶段式重塑落地技术路径图`,
    ...(blueprintResult.step_by_step_roadmap ?? []).map((s: any) =>
      `### ${s.phase}: ${s.title} (${s.duration})\n` + (s.tasks ?? []).map((t: string) => `- ${t}`).join("\n")
    ),
    `\n## 七、 Claude Code / Cursor 系统拉取与开发标准 Prompt 模板 (CLAUDE.md)`,
    `\`\`\`markdown`,
    blueprintResult.prompt_template_claude,
    `\`\`\``,
  ].join("\n");

  const element = document.createElement("a");
  const file = new Blob([sections], { type: "text/plain;charset=utf-8" });
  element.href = URL.createObjectURL(file);
  element.download = `${(blueprintResult.product_name || "blueprint").toLowerCase().replace(/\s+/g, "-")}-system-blueprint.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
